import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { createEmptySexoEspecie, SexoEspecie } from './sexo-especie.model';
import { SEXO_ESPECIE_REPOSITORY } from './sexo-especie.tokens';

@Component({
  selector: 'app-sexo-especie-page',
  imports: [FormsModule, Icon, Drawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sexo-especie-page.html',
  styleUrl: './sexo-especie-page.css',
})
export class SexoEspeciePage {
  private readonly repository = inject(SEXO_ESPECIE_REPOSITORY);

  protected readonly registros = signal<SexoEspecie[] | null>(null);

  protected readonly search = signal('');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<SexoEspecie>(createEmptySexoEspecie());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.registros() ?? []).filter(
      (registro) => !term || registro.sexoEspecie.toLowerCase().includes(term) || registro.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.loadRegistros();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptySexoEspecie());
    this.drawerOpen.set(true);
    await this.generateCodigo();
  }

  protected openEdit(registro: SexoEspecie): void {
    this.draft.set({ ...registro });
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

  protected async save(): Promise<void> {
    const value = this.draft();
    if (!value.sexoEspecie.trim()) {
      return;
    }

    this.saving.set(true);
    try {
      await this.repository.save(value);
      this.drawerOpen.set(false);
      await this.loadRegistros();
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
    await this.loadRegistros();
  }

  protected updateDraft<K extends keyof SexoEspecie>(key: K, value: SexoEspecie[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadRegistros(): Promise<void> {
    this.registros.set(await this.repository.list());
  }
}
