import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { createEmptySoporte, Soporte, SoporteOrientacion } from './soporte.model';
import { SoporteGridPreview } from './soporte-grid-preview';
import { SOPORTE_REPOSITORY } from './soportes.tokens';

@Component({
  selector: 'app-soportes-page',
  imports: [FormsModule, Icon, Drawer, SoporteGridPreview, DrawerFormFooter, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './soportes-page.html',
  styleUrl: './soportes-page.css',
})
export class SoportesPage {
  private readonly repository = inject(SOPORTE_REPOSITORY);

  protected readonly crud = new EntityDrawerCrud(
    this.repository,
    createEmptySoporte,
    (value) => !!value.codigo.trim() && !!value.numFilas && !!value.numColumnas,
    { field: 'codigo', next: () => this.repository.nextCodigo() },
  );
  protected readonly soportes = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly generatingCodigo = this.crud.generating;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.soportes() ?? []).filter((soporte) => !term || soporte.codigo.toLowerCase().includes(term));
  });

  constructor() {
    void this.crud.load();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected openEdit(soporte: Soporte): void {
    this.crud.openEdit(soporte);
  }

  protected closeDrawer(): void {
    this.crud.closeDrawer();
  }

  protected generateCodigo(): Promise<void> {
    return this.crud.regenerate();
  }

  protected setOrientacion(orientacion: SoporteOrientacion): void {
    this.updateDraft('orientacion', orientacion);
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

  protected updateDraft<K extends keyof Soporte>(key: K, value: Soporte[K]): void {
    this.crud.updateDraft(key, value);
  }
}
