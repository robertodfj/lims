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
import { ContenedorAdvancedConfig } from './contenedor-advanced-config';
import { Contenedor, createEmptyContenedor } from './contenedor.model';
import { CONTENEDOR_REPOSITORY } from './contenedores.tokens';

@Component({
  selector: 'app-contenedores-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect, DrawerFormFooter, DrawerStepNav, ExcelActions, ContenedorAdvancedConfig],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contenedores-page.html',
  styleUrl: './contenedores-page.css',
})
export class ContenedoresPage {
  private readonly repository = inject(CONTENEDOR_REPOSITORY);
  private readonly catalogService = inject(CatalogService);

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptyContenedor, (value) => !!value.nombre.trim());
  protected readonly contenedores = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');

  protected readonly tiposMuestra = signal<readonly CatalogItem[]>([]);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const tipos = this.tiposMuestra();

    return (this.contenedores() ?? [])
      .filter((contenedor) => !term || contenedor.nombre.toLowerCase().includes(term))
      .map((contenedor) => ({
        contenedor,
        tipoMuestraNombre: tipos.find((tipo) => tipo.id === contenedor.tipoMuestraId)?.nombre ?? '—',
      }));
  });

  constructor() {
    void this.crud.load();
    void this.loadCatalogs();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected openEdit(contenedor: Contenedor): void {
    this.crud.openEdit(contenedor);
  }

  protected closeDrawer(): void {
    this.crud.closeDrawer();
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

  protected updateDraft<K extends keyof Contenedor>(key: K, value: Contenedor[K]): void {
    this.crud.updateDraft(key, value);
  }

  private async loadCatalogs(): Promise<void> {
    this.tiposMuestra.set(await this.catalogService.load('tipos-muestra'));
  }
}
