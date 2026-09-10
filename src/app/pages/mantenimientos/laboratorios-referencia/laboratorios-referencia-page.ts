import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { TECNICA_REPOSITORY } from '../tecnicas/tecnicas.tokens';
import { createEmptyLaboratorioReferencia, LaboratorioReferencia } from './laboratorio-referencia.model';
import { LABORATORIO_REFERENCIA_REPOSITORY } from './laboratorios-referencia.tokens';

@Component({
  selector: 'app-laboratorios-referencia-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './laboratorios-referencia-page.html',
  styleUrl: './laboratorios-referencia-page.css',
})
export class LaboratoriosReferenciaPage {
  private readonly repository = inject(LABORATORIO_REFERENCIA_REPOSITORY);
  private readonly catalogService = inject(CatalogService);
  private readonly tecnicaRepository = inject(TECNICA_REPOSITORY);

  protected readonly laboratorios = signal<LaboratorioReferencia[] | null>(null);

  protected readonly search = signal('');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<LaboratorioReferencia>(createEmptyLaboratorioReferencia());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly provincias = signal<readonly CatalogItem[]>([]);
  protected readonly tecnicas = signal<readonly CatalogItem[]>([]);

  /** Técnicas aún no asociadas a este laboratorio: las que ofrece el buscador de "Añadir técnica". */
  protected readonly tecnicasDisponibles = computed<CatalogItem[]>(() => {
    const asociadas = new Set(this.draft().tecnicasAsociadasIds);
    return this.tecnicas().filter((tecnica) => !asociadas.has(tecnica.id));
  });

  protected readonly tecnicasAsociadas = computed<CatalogItem[]>(() => {
    const porId = new Map(this.tecnicas().map((tecnica) => [tecnica.id, tecnica]));
    return this.draft()
      .tecnicasAsociadasIds.map((id) => porId.get(id))
      .filter((tecnica): tecnica is CatalogItem => !!tecnica);
  });

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.laboratorios() ?? []).filter(
      (laboratorio) =>
        !term || laboratorio.nombre.toLowerCase().includes(term) || laboratorio.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.loadLaboratorios();
    void this.loadCatalogs();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptyLaboratorioReferencia());
    this.drawerOpen.set(true);
    await this.generateCodigo();
  }

  protected openEdit(laboratorio: LaboratorioReferencia): void {
    this.draft.set({ ...laboratorio, tecnicasAsociadasIds: [...laboratorio.tecnicasAsociadasIds] });
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  protected async generateCodigo(): Promise<void> {
    this.generatingCodigo.set(true);
    try {
      const codigo = await this.repository.nextCodigo();
      this.updateDraft('codigo', codigo);
    } finally {
      this.generatingCodigo.set(false);
    }
  }

  protected addTecnica(id: string | null): void {
    if (!id) {
      return;
    }
    this.draft.update((current) =>
      current.tecnicasAsociadasIds.includes(id)
        ? current
        : { ...current, tecnicasAsociadasIds: [...current.tecnicasAsociadasIds, id] },
    );
  }

  protected removeTecnica(id: string): void {
    this.draft.update((current) => ({
      ...current,
      tecnicasAsociadasIds: current.tecnicasAsociadasIds.filter((tecnicaId) => tecnicaId !== id),
    }));
  }

  protected async save(): Promise<void> {
    const value = this.draft();
    if (!value.nombre.trim()) {
      return;
    }

    this.saving.set(true);
    try {
      await this.repository.save(value);
      this.drawerOpen.set(false);
      await this.loadLaboratorios();
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
    await this.loadLaboratorios();
  }

  protected updateDraft<K extends keyof LaboratorioReferencia>(key: K, value: LaboratorioReferencia[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadLaboratorios(): Promise<void> {
    this.laboratorios.set(await this.repository.list());
  }

  private async loadCatalogs(): Promise<void> {
    const [provincias, tecnicas] = await Promise.all([
      this.catalogService.load('provincias'),
      this.tecnicaRepository.list(),
    ]);
    this.provincias.set(provincias);
    this.tecnicas.set(
      tecnicas.map((tecnica) => ({
        id: tecnica.id,
        nombre: tecnica.codigo ? `${tecnica.codigo} — ${tecnica.nombre}` : tecnica.nombre,
      })),
    );
  }
}
