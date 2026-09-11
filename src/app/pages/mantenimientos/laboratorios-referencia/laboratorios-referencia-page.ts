import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { DrawerStepNav } from '../../../shared/drawer-step-nav/drawer-step-nav';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { TECNICA_REPOSITORY } from '../tecnicas/tecnicas.tokens';
import { LaboratorioAdvancedConfig } from './laboratorio-advanced-config';
import { createEmptyLaboratorioReferencia, LaboratorioReferencia } from './laboratorio-referencia.model';
import { LABORATORIO_REFERENCIA_REPOSITORY } from './laboratorios-referencia.tokens';

@Component({
  selector: 'app-laboratorios-referencia-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect, DrawerFormFooter, DrawerStepNav, ExcelActions, LaboratorioAdvancedConfig],
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

  /** Nº de técnicas asociadas por laboratorio (vía `tecnica.laboratorioExternoId`), para la columna del listado. */
  protected readonly numTecnicasPorLaboratorio = signal<ReadonlyMap<string, number>>(new Map());

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
    this.crud.openEdit(laboratorio);
  }

  protected closeDrawer(): void {
    this.crud.closeDrawer();
    // Las técnicas asociadas se guardan al instante desde el Avanzado: al cerrar, refresca el
    // recuento del listado por si ha cambiado.
    void this.loadNumTecnicasPorLaboratorio();
  }

  protected generateCodigo(): Promise<void> {
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

  protected updateDraft<K extends keyof LaboratorioReferencia>(key: K, value: LaboratorioReferencia[K]): void {
    this.crud.updateDraft(key, value);
  }

  private async loadCatalogs(): Promise<void> {
    this.provincias.set(await this.catalogService.load('provincias'));
    await this.loadNumTecnicasPorLaboratorio();
  }

  private async loadNumTecnicasPorLaboratorio(): Promise<void> {
    const tecnicas = await this.tecnicaRepository.list();
    const map = new Map<string, number>();
    for (const tecnica of tecnicas) {
      if (!tecnica.laboratorioExternoId) {
        continue;
      }
      map.set(tecnica.laboratorioExternoId, (map.get(tecnica.laboratorioExternoId) ?? 0) + 1);
    }
    this.numTecnicasPorLaboratorio.set(map);
  }
}
