import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { TECNICA_REPOSITORY } from '../tecnicas/tecnicas.tokens';
import { createEmptyLaboratorioReferencia, LaboratorioReferencia } from './laboratorio-referencia.model';
import { LABORATORIO_REFERENCIA_REPOSITORY } from './laboratorios-referencia.tokens';

@Component({
  selector: 'app-laboratorios-referencia-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect, DrawerFormFooter, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './laboratorios-referencia-page.html',
  styleUrl: './laboratorios-referencia-page.css',
})
export class LaboratoriosReferenciaPage {
  private readonly repository = inject(LABORATORIO_REFERENCIA_REPOSITORY);
  private readonly catalogService = inject(CatalogService);
  private readonly tecnicaRepository = inject(TECNICA_REPOSITORY);

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptyLaboratorioReferencia, (value) => !!value.nombre.trim(), {
    field: 'codigo',
    next: () => this.repository.nextCodigo(),
  });
  protected readonly laboratorios = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly generatingCodigo = this.crud.generating;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');

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
    void this.crud.load();
    void this.loadCatalogs();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected openEdit(laboratorio: LaboratorioReferencia): void {
    this.crud.openEdit({ ...laboratorio, tecnicasAsociadasIds: [...laboratorio.tecnicasAsociadasIds] });
  }

  protected closeDrawer(): void {
    this.crud.closeDrawer();
  }

  protected generateCodigo(): Promise<void> {
    return this.crud.regenerate();
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

  protected updateDraft<K extends keyof LaboratorioReferencia>(key: K, value: LaboratorioReferencia[K]): void {
    this.crud.updateDraft(key, value);
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
