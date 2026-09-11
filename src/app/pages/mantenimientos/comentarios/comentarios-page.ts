import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { RichTextEditor } from '../../../shared/rich-text-editor/rich-text-editor';
import { Comentario, createEmptyComentario } from './comentario.model';
import { COMENTARIO_REPOSITORY } from './comentarios.tokens';

@Component({
  selector: 'app-comentarios-page',
  imports: [FormsModule, Icon, Drawer, RichTextEditor, DrawerFormFooter, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comentarios-page.html',
  styleUrl: './comentarios-page.css',
})
export class ComentariosPage {
  private readonly repository = inject(COMENTARIO_REPOSITORY);

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptyComentario, (value) => !!value.nombre.trim(), {
    field: 'codigo',
    next: () => this.repository.nextCodigo(),
  });
  protected readonly comentarios = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly generatingCodigo = this.crud.generating;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.comentarios() ?? []).filter(
      (comentario) =>
        !term || comentario.nombre.toLowerCase().includes(term) || comentario.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.crud.load();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected openEdit(comentario: Comentario): void {
    this.crud.openEdit(comentario);
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

  protected updateDraft<K extends keyof Comentario>(key: K, value: Comentario[K]): void {
    this.crud.updateDraft(key, value);
  }

  /** Vista previa en texto plano del comentario con formato, para la tabla. */
  protected plainText(html: string): string {
    const text = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > 90 ? `${text.slice(0, 90)}…` : text;
  }
}
