import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { DrawerStepNav } from '../../../shared/drawer-step-nav/drawer-step-nav';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { createEmptySexoEspecie, SexoEspecie } from './sexo-especie.model';
import { SEXO_ESPECIE_REPOSITORY } from './sexo-especie.tokens';

@Component({
  selector: 'app-sexo-especie-page',
  imports: [FormsModule, Icon, Drawer, DrawerFormFooter, DrawerStepNav, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sexo-especie-page.html',
  styleUrl: './sexo-especie-page.css',
})
export class SexoEspeciePage {
  private readonly repository = inject(SEXO_ESPECIE_REPOSITORY);

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptySexoEspecie, (value) => !!value.sexoEspecie.trim(), {
    field: 'codigo',
    next: () => this.repository.nextCodigo(),
  });
  protected readonly registros = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly generatingCodigo = this.crud.generating;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.registros() ?? []).filter(
      (registro) => !term || registro.sexoEspecie.toLowerCase().includes(term) || registro.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.crud.load();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected openEdit(registro: SexoEspecie): void {
    this.crud.openEdit(registro);
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

  protected updateDraft<K extends keyof SexoEspecie>(key: K, value: SexoEspecie[K]): void {
    this.crud.updateDraft(key, value);
  }
}
