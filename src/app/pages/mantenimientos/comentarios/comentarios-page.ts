import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { RichTextEditor } from '../../../shared/rich-text-editor/rich-text-editor';
import { Comentario, createEmptyComentario } from './comentario.model';
import { COMENTARIO_REPOSITORY } from './comentarios.tokens';

@Component({
  selector: 'app-comentarios-page',
  imports: [FormsModule, Icon, Drawer, RichTextEditor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comentarios-page.html',
  styleUrl: './comentarios-page.css',
})
export class ComentariosPage {
  private readonly repository = inject(COMENTARIO_REPOSITORY);

  protected readonly comentarios = signal<Comentario[] | null>(null);

  protected readonly search = signal('');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Comentario>(createEmptyComentario());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.comentarios() ?? []).filter(
      (comentario) =>
        !term || comentario.nombre.toLowerCase().includes(term) || comentario.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.loadComentarios();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptyComentario());
    this.drawerOpen.set(true);
    await this.generateCodigo();
  }

  protected openEdit(comentario: Comentario): void {
    this.draft.set({ ...comentario });
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
      await this.loadComentarios();
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
    await this.loadComentarios();
  }

  protected updateDraft<K extends keyof Comentario>(key: K, value: Comentario[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  /** Vista previa en texto plano del comentario con formato, para la tabla. */
  protected plainText(html: string): string {
    const text = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > 90 ? `${text.slice(0, 90)}…` : text;
  }

  private async loadComentarios(): Promise<void> {
    this.comentarios.set(await this.repository.list());
  }
}
