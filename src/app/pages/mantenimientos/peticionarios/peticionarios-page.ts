import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';

interface Peticionario {
  readonly id: string;
  codigo: string;
  nombre: string;
  colegiado: string;
  especialidad: string;
  telefono: string;
  email: string;
  estado: 'activo' | 'inactivo';
}

type SortColumn = 'nombre' | 'colegiado' | 'especialidad' | 'estado';

const ESPECIALIDADES = ['Medicina General', 'Pediatría', 'Cardiología', 'Dermatología', 'Traumatología', 'Ginecología'] as const;

const SEED: readonly Peticionario[] = [
  { id: 'PT-001', codigo: '1', nombre: 'Elena Castro Muñoz', colegiado: '28/45210', especialidad: 'Medicina General', telefono: '600 112 233', email: 'ecastro@saludclin.es', estado: 'activo' },
  { id: 'PT-002', codigo: '2', nombre: 'Javier Ortega Sanz', colegiado: '28/38214', especialidad: 'Cardiología', telefono: '600 221 990', email: 'jortega@saludclin.es', estado: 'activo' },
  { id: 'PT-003', codigo: '3', nombre: 'Marta Pardo Villar', colegiado: '28/50122', especialidad: 'Pediatría', telefono: '600 334 021', email: 'mpardo@saludclin.es', estado: 'activo' },
  { id: 'PT-004', codigo: '4', nombre: 'Alberto Ruiz Nieto', colegiado: '28/41077', especialidad: 'Traumatología', telefono: '600 887 123', email: 'aruiz@saludclin.es', estado: 'inactivo' },
  { id: 'PT-005', codigo: '5', nombre: 'Cristina Vidal Serra', colegiado: '28/39944', especialidad: 'Ginecología', telefono: '600 556 431', email: 'cvidal@saludclin.es', estado: 'activo' },
  { id: 'PT-006', codigo: '6', nombre: 'Raúl Molina Cortés', colegiado: '28/44018', especialidad: 'Dermatología', telefono: '600 778 902', email: 'rmolina@saludclin.es', estado: 'activo' },
  { id: 'PT-007', codigo: '7', nombre: 'Sara Gómez Iglesias', colegiado: '28/47701', especialidad: 'Medicina General', telefono: '600 112 774', email: 'sgomez@saludclin.es', estado: 'inactivo' },
  { id: 'PT-008', codigo: '8', nombre: 'Diego Herrero Blanco', colegiado: '28/36650', especialidad: 'Cardiología', telefono: '600 902 341', email: 'dherrero@saludclin.es', estado: 'activo' },
  { id: 'PT-009', codigo: '9', nombre: 'Lucía Serrano Peña', colegiado: '28/48892', especialidad: 'Pediatría', telefono: '600 445 118', email: 'lserrano@saludclin.es', estado: 'activo' },
  { id: 'PT-010', codigo: '10', nombre: 'Pablo Domínguez Lara', colegiado: '28/42233', especialidad: 'Traumatología', telefono: '600 667 554', email: 'pdominguez@saludclin.es', estado: 'activo' },
  { id: 'PT-011', codigo: '11', nombre: 'Beatriz Campos Real', colegiado: '28/40015', especialidad: 'Ginecología', telefono: '600 223 890', email: 'bcampos@saludclin.es', estado: 'inactivo' },
  { id: 'PT-012', codigo: '12', nombre: 'Iván Delgado Rey', colegiado: '28/49560', especialidad: 'Dermatología', telefono: '600 334 665', email: 'idelgado@saludclin.es', estado: 'activo' },
];

@Component({
  selector: 'app-peticionarios-page',
  imports: [FormsModule, Icon, Drawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './peticionarios-page.html',
  styleUrl: './peticionarios-page.css',
})
export class PeticionariosPage {
  protected readonly especialidades = ESPECIALIDADES;

  private readonly data = signal<Peticionario[]>([...SEED]);

  protected readonly search = signal('');
  protected readonly estadoFilter = signal<'todos' | 'activo' | 'inactivo'>('todos');
  protected readonly sortColumn = signal<SortColumn>('nombre');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');

  protected readonly drawerOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly draft = signal<Peticionario>(this.emptyDraft());
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const estado = this.estadoFilter();
    const column = this.sortColumn();
    const dir = this.sortDir() === 'asc' ? 1 : -1;

    return this.data()
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

  protected toggleSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDir.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDir.set('asc');
    }
  }

  protected openNew(): void {
    this.editingId.set(null);
    this.draft.set({ ...this.emptyDraft(), codigo: this.nextCodigo() });
    this.drawerOpen.set(true);
  }

  protected generateCodigo(): void {
    this.updateDraft('codigo', this.nextCodigo());
  }

  /** Mayor código entre los peticionarios activos, +1. */
  private nextCodigo(): string {
    const maxActivo = this.data()
      .filter((row) => row.estado === 'activo')
      .reduce((max, row) => {
        const parsed = Number.parseInt(row.codigo, 10);
        return Number.isFinite(parsed) && parsed > max ? parsed : max;
      }, 0);
    return String(maxActivo + 1);
  }

  protected openEdit(row: Peticionario): void {
    this.editingId.set(row.id);
    this.draft.set({ ...row });
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  protected save(): void {
    const value = this.draft();
    if (!value.nombre.trim()) {
      return;
    }

    if (this.editingId()) {
      this.data.update((rows) => rows.map((row) => (row.id === value.id ? value : row)));
    } else {
      const id = `PT-${String(this.data().length + 1).padStart(3, '0')}`;
      this.data.update((rows) => [{ ...value, id }, ...rows]);
    }
    this.drawerOpen.set(false);
  }

  protected requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  protected confirmDelete(id: string): void {
    this.data.update((rows) => rows.filter((row) => row.id !== id));
    this.confirmDeleteId.set(null);
  }

  protected updateDraft<K extends keyof Peticionario>(key: K, value: Peticionario[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private emptyDraft(): Peticionario {
    return {
      id: '',
      codigo: '',
      nombre: '',
      colegiado: '',
      especialidad: ESPECIALIDADES[0],
      telefono: '',
      email: '',
      estado: 'activo',
    };
  }
}
