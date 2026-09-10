import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { SEXO_ESPECIE_REPOSITORY } from '../sexo-especie/sexo-especie.tokens';
import { SOCIEDAD_REPOSITORY } from '../sociedades/sociedades.tokens';
import { createEmptyPaciente, Paciente } from './paciente.model';
import { PACIENTE_REPOSITORY } from './base-pacientes.tokens';

@Component({
  selector: 'app-base-pacientes-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './base-pacientes-page.html',
  styleUrl: './base-pacientes-page.css',
})
export class BasePacientesPage {
  private readonly repository = inject(PACIENTE_REPOSITORY);
  private readonly catalogService = inject(CatalogService);
  private readonly sexoEspecieRepository = inject(SEXO_ESPECIE_REPOSITORY);
  private readonly sociedadRepository = inject(SOCIEDAD_REPOSITORY);

  protected readonly pacientes = signal<Paciente[] | null>(null);

  protected readonly search = signal('');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Paciente>(createEmptyPaciente());
  protected readonly saving = signal(false);
  protected readonly generatingHistoriaClinica = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly provincias = signal<readonly CatalogItem[]>([]);
  protected readonly sexosEspecies = signal<readonly CatalogItem[]>([]);
  protected readonly sociedades = signal<readonly CatalogItem[]>([]);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.pacientes() ?? []).filter(
      (paciente) =>
        !term ||
        paciente.apellidos.toLowerCase().includes(term) ||
        paciente.nombre.toLowerCase().includes(term) ||
        paciente.dni.toLowerCase().includes(term) ||
        paciente.historiaClinica.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.loadPacientes();
    void this.loadCatalogs();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptyPaciente());
    this.drawerOpen.set(true);
    await this.generateHistoriaClinica();
  }

  protected openEdit(paciente: Paciente): void {
    this.draft.set({ ...paciente });
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  protected async generateHistoriaClinica(): Promise<void> {
    this.generatingHistoriaClinica.set(true);
    try {
      const historiaClinica = await this.repository.nextHistoriaClinica();
      this.updateDraft('historiaClinica', historiaClinica);
    } finally {
      this.generatingHistoriaClinica.set(false);
    }
  }

  protected async save(): Promise<void> {
    const value = this.draft();
    if (!value.apellidos.trim()) {
      return;
    }

    this.saving.set(true);
    try {
      await this.repository.save(value);
      this.drawerOpen.set(false);
      await this.loadPacientes();
    } finally {
      this.saving.set(false);
    }
  }

  protected requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  protected async confirmDelete(id: string): Promise<void> {
    await this.repository.delete(id);
    this.confirmDeleteId.set(null);
    await this.loadPacientes();
  }

  protected updateDraft<K extends keyof Paciente>(key: K, value: Paciente[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadPacientes(): Promise<void> {
    this.pacientes.set(await this.repository.list());
  }

  private async loadCatalogs(): Promise<void> {
    const [provincias, sexosEspecies, sociedades] = await Promise.all([
      this.catalogService.load('provincias'),
      this.sexoEspecieRepository.list(),
      this.sociedadRepository.list(),
    ]);
    this.provincias.set(provincias);
    this.sexosEspecies.set(
      sexosEspecies.map((item) => ({
        id: item.id,
        nombre: item.codigo ? `${item.codigo} — ${item.sexoEspecie}` : item.sexoEspecie,
      })),
    );
    this.sociedades.set(sociedades.map((sociedad) => ({ id: sociedad.id, nombre: sociedad.nombre })));
  }
}
