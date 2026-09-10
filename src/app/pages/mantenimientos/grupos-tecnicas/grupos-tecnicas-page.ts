import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { createEmptyGrupo, Grupo } from './grupo.model';
import { GRUPO_REPOSITORY } from './grupos-tecnicas.tokens';

@Component({
  selector: 'app-grupos-tecnicas-page',
  imports: [FormsModule, Icon, Drawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grupos-tecnicas-page.html',
  styleUrl: './grupos-tecnicas-page.css',
})
export class GruposTecnicasPage {
  private readonly repository = inject(GRUPO_REPOSITORY);

  protected readonly grupos = signal<Grupo[] | null>(null);

  protected readonly search = signal('');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Grupo>(createEmptyGrupo());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.grupos() ?? []).filter(
      (grupo) => !term || grupo.nombre.toLowerCase().includes(term) || grupo.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.loadGrupos();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptyGrupo());
    this.drawerOpen.set(true);
    await this.generateCodigo();
  }

  protected openEdit(grupo: Grupo): void {
    this.draft.set({ ...grupo });
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
      await this.loadGrupos();
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
    await this.loadGrupos();
  }

  protected updateDraft<K extends keyof Grupo>(key: K, value: Grupo[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadGrupos(): Promise<void> {
    this.grupos.set(await this.repository.list());
  }
}
