import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { createEmptySoporte, Soporte, SoporteOrientacion } from './soporte.model';
import { SoporteGridPreview } from './soporte-grid-preview';
import { SOPORTE_REPOSITORY } from './soportes.tokens';

@Component({
  selector: 'app-soportes-page',
  imports: [FormsModule, Icon, Drawer, SoporteGridPreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './soportes-page.html',
  styleUrl: './soportes-page.css',
})
export class SoportesPage {
  private readonly repository = inject(SOPORTE_REPOSITORY);

  protected readonly soportes = signal<Soporte[] | null>(null);
  protected readonly search = signal('');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Soporte>(createEmptySoporte());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.soportes() ?? []).filter((soporte) => !term || soporte.codigo.toLowerCase().includes(term));
  });

  constructor() {
    void this.loadSoportes();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptySoporte());
    this.drawerOpen.set(true);
    await this.generateCodigo();
  }

  protected openEdit(soporte: Soporte): void {
    this.draft.set({ ...soporte });
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

  protected setOrientacion(orientacion: SoporteOrientacion): void {
    this.updateDraft('orientacion', orientacion);
  }

  protected async save(): Promise<void> {
    const value = this.draft();
    if (!value.codigo.trim() || !value.numFilas || !value.numColumnas) {
      return;
    }

    this.saving.set(true);
    try {
      await this.repository.save(value);
      this.drawerOpen.set(false);
      await this.loadSoportes();
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
    await this.loadSoportes();
  }

  protected updateDraft<K extends keyof Soporte>(key: K, value: Soporte[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadSoportes(): Promise<void> {
    this.soportes.set(await this.repository.list());
  }
}
