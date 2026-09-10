import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { Contenedor, createEmptyContenedor } from './contenedor.model';
import { CONTENEDOR_REPOSITORY } from './contenedores.tokens';

@Component({
  selector: 'app-contenedores-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contenedores-page.html',
  styleUrl: './contenedores-page.css',
})
export class ContenedoresPage {
  private readonly repository = inject(CONTENEDOR_REPOSITORY);
  private readonly catalogService = inject(CatalogService);

  protected readonly contenedores = signal<Contenedor[] | null>(null);
  protected readonly search = signal('');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Contenedor>(createEmptyContenedor());
  protected readonly saving = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly tiposMuestra = signal<readonly CatalogItem[]>([]);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const tipos = this.tiposMuestra();

    return (this.contenedores() ?? [])
      .filter((contenedor) => !term || contenedor.nombre.toLowerCase().includes(term))
      .map((contenedor) => ({
        contenedor,
        tipoMuestraNombre: tipos.find((tipo) => tipo.id === contenedor.tipoMuestraId)?.nombre ?? '—',
      }));
  });

  constructor() {
    void this.loadContenedores();
    void this.loadCatalogs();
  }

  protected openNew(): void {
    this.draft.set(createEmptyContenedor());
    this.drawerOpen.set(true);
  }

  protected openEdit(contenedor: Contenedor): void {
    this.draft.set({ ...contenedor });
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
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
      await this.loadContenedores();
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
    await this.loadContenedores();
  }

  protected updateDraft<K extends keyof Contenedor>(key: K, value: Contenedor[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadContenedores(): Promise<void> {
    this.contenedores.set(await this.repository.list());
  }

  private async loadCatalogs(): Promise<void> {
    this.tiposMuestra.set(await this.catalogService.load('tipos-muestra'));
  }
}
