import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { createEmptyDestino, Destino } from './destino.model';
import { DESTINO_REPOSITORY } from './destinos.tokens';

type EstadoFilter = 'todos' | 'activo' | 'no-activo';

@Component({
  selector: 'app-destino-informes-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './destino-informes-page.html',
  styleUrl: './destino-informes-page.css',
})
export class DestinoInformesPage {
  private readonly repository = inject(DESTINO_REPOSITORY);

  protected readonly destinos = signal<Destino[] | null>(null);

  protected readonly search = signal('');
  protected readonly estadoFilter = signal<EstadoFilter>('todos');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Destino>(createEmptyDestino());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  /** Un destino no puede asociarse a sí mismo. */
  protected readonly destinosAsociables = computed<CatalogItem[]>(() => {
    const propioId = this.draft().id;
    return (this.destinos() ?? [])
      .filter((destino) => destino.id !== propioId)
      .map((destino) => ({ id: destino.id, nombre: `${destino.codigo} — ${destino.descripcion}` }));
  });

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const estado = this.estadoFilter();

    return (this.destinos() ?? [])
      .filter((destino) => {
        if (estado === 'activo') return !destino.noActivo;
        if (estado === 'no-activo') return destino.noActivo;
        return true;
      })
      .filter(
        (destino) => !term || destino.descripcion.toLowerCase().includes(term) || destino.codigo.toLowerCase().includes(term),
      );
  });

  constructor() {
    void this.loadDestinos();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptyDestino());
    this.drawerOpen.set(true);
    await this.generateCodigo();
  }

  protected openEdit(destino: Destino): void {
    this.draft.set({ ...destino });
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
    if (!value.descripcion.trim()) {
      return;
    }

    this.saving.set(true);
    try {
      await this.repository.save(value);
      this.drawerOpen.set(false);
      await this.loadDestinos();
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
    await this.loadDestinos();
  }

  protected updateDraft<K extends keyof Destino>(key: K, value: Destino[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadDestinos(): Promise<void> {
    this.destinos.set(await this.repository.list());
  }
}
