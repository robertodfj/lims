import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { SEXO_ESPECIE_REPOSITORY } from '../sexo-especie/sexo-especie.tokens';
import { SOCIEDAD_REPOSITORY } from '../sociedades/sociedades.tokens';
import { createEmptyPaciente, Paciente } from './paciente.model';
import { PACIENTE_REPOSITORY } from './base-pacientes.tokens';

@Component({
  selector: 'app-base-pacientes-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect, DrawerFormFooter, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './base-pacientes-page.html',
  styleUrl: './base-pacientes-page.css',
})
export class BasePacientesPage {
  private readonly repository = inject(PACIENTE_REPOSITORY);
  private readonly catalogService = inject(CatalogService);
  private readonly sexoEspecieRepository = inject(SEXO_ESPECIE_REPOSITORY);
  private readonly sociedadRepository = inject(SOCIEDAD_REPOSITORY);

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptyPaciente, (value) => !!value.apellidos.trim(), {
    field: 'historiaClinica',
    next: () => this.repository.nextHistoriaClinica(),
  });
  protected readonly pacientes = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly generatingHistoriaClinica = this.crud.generating;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');

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
    void this.crud.load();
    void this.loadCatalogs();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected openEdit(paciente: Paciente): void {
    this.crud.openEdit(paciente);
  }

  protected closeDrawer(): void {
    this.crud.closeDrawer();
  }

  protected generateHistoriaClinica(): Promise<void> {
    return this.crud.regenerate();
  }

  protected save(): Promise<void> {
    return this.crud.save();
  }

  protected requestDelete(id: string): void {
    this.crud.requestDelete(id);
  }

  protected cancelDelete(): void {
    this.crud.cancelDelete();
  }

  protected confirmDelete(id: string): Promise<void> {
    return this.crud.confirmDelete(id);
  }

  protected updateDraft<K extends keyof Paciente>(key: K, value: Paciente[K]): void {
    this.crud.updateDraft(key, value);
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
