import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { createEmptyTipoPeticion, TipoPeticion } from './tipo-peticion.model';
import { TIPO_PETICION_REPOSITORY } from './tipos-peticion.tokens';

@Component({
  selector: 'app-tipos-peticion-page',
  imports: [FormsModule, Icon, Drawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tipos-peticion-page.html',
  styleUrl: './tipos-peticion-page.css',
})
export class TiposPeticionPage {
  private readonly repository = inject(TIPO_PETICION_REPOSITORY);

  protected readonly tipos = signal<TipoPeticion[] | null>(null);
  protected readonly search = signal('');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<TipoPeticion>(createEmptyTipoPeticion());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.tipos() ?? []).filter(
      (tipo) => !term || tipo.nombre.toLowerCase().includes(term) || tipo.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.loadTipos();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptyTipoPeticion());
    this.drawerOpen.set(true);
    await this.generateCodigo();
  }

  protected openEdit(tipo: TipoPeticion): void {
    this.draft.set({ ...tipo });
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
    if (!value.nombre.trim()) {
      return;
    }

    this.saving.set(true);
    try {
      await this.repository.save(value);
      this.drawerOpen.set(false);
      await this.loadTipos();
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
    await this.loadTipos();
  }

  protected updateDraft<K extends keyof TipoPeticion>(key: K, value: TipoPeticion[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadTipos(): Promise<void> {
    this.tipos.set(await this.repository.list());
  }
}
