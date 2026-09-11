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
import { createEmptyPeticionario, ESPECIALIDADES_PETICIONARIO, Peticionario } from './peticionario.model';
import { PETICIONARIO_REPOSITORY } from './peticionarios.tokens';

type SortColumn = 'nombre' | 'colegiado' | 'especialidad';

@Component({
  selector: 'app-peticionarios-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect, DrawerFormFooter, DrawerStepNav, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './peticionarios-page.html',
  styleUrl: './peticionarios-page.css',
})
export class PeticionariosPage {
  private readonly repository = inject(PETICIONARIO_REPOSITORY);
  private readonly catalogService = inject(CatalogService);

  protected readonly especialidades = ESPECIALIDADES_PETICIONARIO;

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptyPeticionario, (value) => !!value.nombre.trim(), {
    field: 'codigo',
    next: () => this.repository.nextCodigo(),
  });
  protected readonly peticionarios = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly generatingCodigo = this.crud.generating;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly provincias = signal<readonly CatalogItem[]>([]);

  protected readonly search = signal('');
  protected readonly sortColumn = signal<SortColumn>('nombre');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const column = this.sortColumn();
    const dir = this.sortDir() === 'asc' ? 1 : -1;

    return (this.peticionarios() ?? [])
      .filter(
        (row) =>
          !term ||
          row.nombre.toLowerCase().includes(term) ||
          row.codigo.toLowerCase().includes(term) ||
          row.colegiado.toLowerCase().includes(term),
      )
      .sort((a, b) => a[column].localeCompare(b[column]) * dir);
  });

  constructor() {
    void this.crud.load();
    void this.loadCatalogs();
  }

  protected toggleSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDir.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDir.set('asc');
    }
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected generateCodigo(): Promise<void> {
    return this.crud.regenerate();
  }

  protected openEdit(row: Peticionario): void {
    this.crud.openEdit(row);
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

  protected updateDraft<K extends keyof Peticionario>(key: K, value: Peticionario[K]): void {
    this.crud.updateDraft(key, value);
  }

  private async loadCatalogs(): Promise<void> {
    this.provincias.set(await this.catalogService.load('provincias'));
  }
}
