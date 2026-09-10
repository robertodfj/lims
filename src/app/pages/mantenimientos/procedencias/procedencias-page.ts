import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { createEmptyProcedencia, Procedencia } from './procedencia.model';
import { PROCEDENCIA_REPOSITORY } from './procedencias.tokens';

interface Provincia extends CatalogItem {
  readonly paisId: string;
}

type EstadoFilter = 'todos' | 'activa' | 'no-activa';

@Component({
  selector: 'app-procedencias-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './procedencias-page.html',
  styleUrl: './procedencias-page.css',
})
export class ProcedenciasPage {
  private readonly repository = inject(PROCEDENCIA_REPOSITORY);
  private readonly catalogService = inject(CatalogService);

  protected readonly procedencias = signal<Procedencia[] | null>(null);

  protected readonly search = signal('');
  protected readonly estadoFilter = signal<EstadoFilter>('todos');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Procedencia>(createEmptyProcedencia());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly paises = signal<readonly CatalogItem[]>([]);
  protected readonly provincias = signal<readonly Provincia[]>([]);
  protected readonly cabeceras = signal<readonly CatalogItem[]>([]);
  protected readonly formasPago = signal<readonly CatalogItem[]>([]);
  protected readonly destinos = signal<readonly CatalogItem[]>([]);

  /** Solo las provincias del país seleccionado en el formulario: Provincia depende de País. */
  protected readonly provinciasDelPais = computed(() => {
    const paisId = this.draft().paisId;
    return paisId ? this.provincias().filter((provincia) => provincia.paisId === paisId) : [];
  });

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const estado = this.estadoFilter();

    return (this.procedencias() ?? [])
      .filter((procedencia) => {
        if (estado === 'activa') return !procedencia.noActiva;
        if (estado === 'no-activa') return procedencia.noActiva;
        return true;
      })
      .filter(
        (procedencia) => !term || procedencia.nombre.toLowerCase().includes(term) || procedencia.codigo.toLowerCase().includes(term),
      );
  });

  constructor() {
    void this.loadProcedencias();
    void this.loadCatalogs();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptyProcedencia());
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

  protected openEdit(procedencia: Procedencia): void {
    this.draft.set({ ...procedencia });
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  /** Cambiar de país invalida la provincia elegida: evita combinaciones país/provincia inconsistentes. */
  protected onPaisChange(paisId: string | null): void {
    this.draft.update((current) => ({ ...current, paisId, provinciaId: null }));
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
      await this.loadProcedencias();
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
    await this.loadProcedencias();
  }

  protected updateDraft<K extends keyof Procedencia>(key: K, value: Procedencia[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadProcedencias(): Promise<void> {
    this.procedencias.set(await this.repository.list());
  }

  private async loadCatalogs(): Promise<void> {
    const [paises, provincias, cabeceras, formasPago, destinos] = await Promise.all([
      this.catalogService.load('paises'),
      this.catalogService.load('provincias') as Promise<Provincia[]>,
      this.catalogService.load('cabeceras'),
      this.catalogService.load('formas-pago'),
      this.catalogService.load('destinos'),
    ]);
    this.paises.set(paises);
    this.provincias.set(provincias);
    this.cabeceras.set(cabeceras);
    this.formasPago.set(formasPago);
    this.destinos.set(destinos);
  }
}
