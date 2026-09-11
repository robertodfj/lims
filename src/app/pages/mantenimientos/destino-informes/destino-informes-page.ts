import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { createEmptyDestino, Destino } from './destino.model';
import { DESTINO_REPOSITORY } from './destinos.tokens';

type EstadoFilter = 'todos' | 'activo' | 'no-activo';

@Component({
  selector: 'app-destino-informes-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect, DrawerFormFooter, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './destino-informes-page.html',
  styleUrl: './destino-informes-page.css',
})
export class DestinoInformesPage {
  private readonly repository = inject(DESTINO_REPOSITORY);

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptyDestino, (value) => !!value.descripcion.trim(), {
    field: 'codigo',
    next: () => this.repository.nextCodigo(),
  });
  protected readonly destinos = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly generatingCodigo = this.crud.generating;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');
  protected readonly estadoFilter = signal<EstadoFilter>('todos');

  /** Un destino no puede asociarse a sí mismo. */
  protected readonly destinosAsociables = computed<CatalogItem[]>(() => {
    const propioId = this.draft().id;
    return (this.destinos() ?? [])
      .filter((destino) => destino.id !== propioId)
      .map((destino) => ({ id: destino.id, nombre: `${destino.codigo} — ${destino.descripcion}` }));
  });

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const estado = this.estadoFilter();

    return (this.destinos() ?? [])
      .filter((destino) => {
        if (estado === 'activo') return !destino.noActivo;
        if (estado === 'no-activo') return destino.noActivo;
        return true;
      })
      .filter(
        (destino) => !term || destino.descripcion.toLowerCase().includes(term) || destino.codigo.toLowerCase().includes(term),
      );
  });

  constructor() {
    void this.crud.load();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected openEdit(destino: Destino): void {
    this.crud.openEdit(destino);
  }

  protected closeDrawer(): void {
    this.crud.closeDrawer();
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

  protected updateDraft<K extends keyof Destino>(key: K, value: Destino[K]): void {
    this.crud.updateDraft(key, value);
  }
}
