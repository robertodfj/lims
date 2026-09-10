import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { createEmptySubgrupo, Subgrupo } from './subgrupo.model';
import { SUBGRUPO_REPOSITORY } from './subgrupos.tokens';

@Component({
  selector: 'app-subgrupos-page',
  imports: [FormsModule, Icon, Drawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subgrupos-page.html',
  styleUrl: './subgrupos-page.css',
})
export class SubgruposPage {
  private readonly repository = inject(SUBGRUPO_REPOSITORY);

  protected readonly subgrupos = signal<Subgrupo[] | null>(null);

  protected readonly search = signal('');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Subgrupo>(createEmptySubgrupo());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.subgrupos() ?? []).filter(
      (subgrupo) => !term || subgrupo.nombre.toLowerCase().includes(term) || subgrupo.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.loadSubgrupos();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptySubgrupo());
    this.drawerOpen.set(true);
    await this.generateCodigo();
  }

  protected openEdit(subgrupo: Subgrupo): void {
    this.draft.set({ ...subgrupo });
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
      await this.loadSubgrupos();
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
    await this.loadSubgrupos();
  }

  protected updateDraft<K extends keyof Subgrupo>(key: K, value: Subgrupo[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadSubgrupos(): Promise<void> {
    this.subgrupos.set(await this.repository.list());
  }
}
