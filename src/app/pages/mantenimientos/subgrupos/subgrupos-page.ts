import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { createEmptySubgrupo, Subgrupo } from './subgrupo.model';
import { SUBGRUPO_REPOSITORY } from './subgrupos.tokens';

@Component({
  selector: 'app-subgrupos-page',
  imports: [FormsModule, Icon, Drawer, DrawerFormFooter, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subgrupos-page.html',
  styleUrl: './subgrupos-page.css',
})
export class SubgruposPage {
  private readonly repository = inject(SUBGRUPO_REPOSITORY);

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptySubgrupo, (value) => !!value.nombre.trim(), {
    field: 'codigo',
    next: () => this.repository.nextCodigo(),
  });
  protected readonly subgrupos = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly generatingCodigo = this.crud.generating;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.subgrupos() ?? []).filter(
      (subgrupo) => !term || subgrupo.nombre.toLowerCase().includes(term) || subgrupo.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.crud.load();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected openEdit(subgrupo: Subgrupo): void {
    this.crud.openEdit(subgrupo);
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

  protected updateDraft<K extends keyof Subgrupo>(key: K, value: Subgrupo[K]): void {
    this.crud.updateDraft(key, value);
  }
}
