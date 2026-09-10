import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { createEmptyPeticionario, ESPECIALIDADES_PETICIONARIO, Peticionario } from './peticionario.model';
import { PETICIONARIO_REPOSITORY } from './peticionarios.tokens';

type SortColumn = 'nombre' | 'colegiado' | 'especialidad' | 'estado';

@Component({
  selector: 'app-peticionarios-page',
  imports: [FormsModule, Icon, Drawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './peticionarios-page.html',
  styleUrl: './peticionarios-page.css',
})
export class PeticionariosPage {
  private readonly repository = inject(PETICIONARIO_REPOSITORY);

  protected readonly especialidades = ESPECIALIDADES_PETICIONARIO;

  protected readonly peticionarios = signal<Peticionario[] | null>(null);

  protected readonly search = signal('');
  protected readonly estadoFilter = signal<'todos' | 'activo' | 'inactivo'>('todos');
  protected readonly sortColumn = signal<SortColumn>('nombre');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Peticionario>(createEmptyPeticionario());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const estado = this.estadoFilter();
    const column = this.sortColumn();
    const dir = this.sortDir() === 'asc' ? 1 : -1;

    return (this.peticionarios() ?? [])
      .filter((row) => estado === 'todos' || row.estado === estado)
      .filter(
        (row) =>
          !term ||
          row.nombre.toLowerCase().includes(term) ||
          row.codigo.toLowerCase().includes(term) ||
          row.colegiado.toLowerCase().includes(term) ||
          row.email.toLowerCase().includes(term),
      )
      .sort((a, b) => a[column].localeCompare(b[column]) * dir);
  });

  constructor() {
    void this.loadPeticionarios();
  }

  protected toggleSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDir.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDir.set('asc');
    }
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptyPeticionario());
    this.drawerOpen.set(true);
    await this.generateCodigo();
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

  protected openEdit(row: Peticionario): void {
    this.draft.set({ ...row });
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
      await this.loadPeticionarios();
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
    await this.loadPeticionarios();
  }

  protected updateDraft<K extends keyof Peticionario>(key: K, value: Peticionario[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadPeticionarios(): Promise<void> {
    this.peticionarios.set(await this.repository.list());
  }
}
