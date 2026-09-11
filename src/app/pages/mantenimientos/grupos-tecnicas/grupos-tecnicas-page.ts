import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { DrawerStepNav } from '../../../shared/drawer-step-nav/drawer-step-nav';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { createEmptyGrupo, Grupo } from './grupo.model';
import { GRUPO_REPOSITORY } from './grupos-tecnicas.tokens';

@Component({
  selector: 'app-grupos-tecnicas-page',
  imports: [FormsModule, Icon, Drawer, DrawerFormFooter, DrawerStepNav, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grupos-tecnicas-page.html',
  styleUrl: './grupos-tecnicas-page.css',
})
export class GruposTecnicasPage {
  private readonly repository = inject(GRUPO_REPOSITORY);

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptyGrupo, (value) => !!value.nombre.trim(), {
    field: 'codigo',
    next: () => this.repository.nextCodigo(),
  });
  protected readonly grupos = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly generatingCodigo = this.crud.generating;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.grupos() ?? []).filter(
      (grupo) => !term || grupo.nombre.toLowerCase().includes(term) || grupo.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.crud.load();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected openEdit(grupo: Grupo): void {
    this.crud.openEdit(grupo);
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

  protected updateDraft<K extends keyof Grupo>(key: K, value: Grupo[K]): void {
    this.crud.updateDraft(key, value);
  }
}
