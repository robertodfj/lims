import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { createEmptySociedad, Sociedad } from './sociedad.model';
import { SOCIEDAD_REPOSITORY } from './sociedades.tokens';

interface Provincia extends CatalogItem {
  readonly paisId: string;
}

type EstadoFilter = 'todos' | 'activa' | 'no-activa';

@Component({
  selector: 'app-sociedades-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sociedades-page.html',
  styleUrl: './sociedades-page.css',
})
export class SociedadesPage {
  private readonly repository = inject(SOCIEDAD_REPOSITORY);
  private readonly catalogService = inject(CatalogService);

  protected readonly sociedades = signal<Sociedad[] | null>(null);

  protected readonly search = signal('');
  protected readonly estadoFilter = signal<EstadoFilter>('todos');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Sociedad>(createEmptySociedad());
  protected readonly saving = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly paises = signal<readonly CatalogItem[]>([]);
  protected readonly provincias = signal<readonly Provincia[]>([]);
  protected readonly tarifas = signal<readonly CatalogItem[]>([]);
  protected readonly estadosFacturacion = signal<readonly CatalogItem[]>([]);
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

    return (this.sociedades() ?? [])
      .filter((sociedad) => {
        if (estado === 'activa') return !sociedad.noActiva;
        if (estado === 'no-activa') return sociedad.noActiva;
        return true;
      })
      .filter((sociedad) => !term || sociedad.nombre.toLowerCase().includes(term));
  });

  constructor() {
    void this.loadSociedades();
    void this.loadCatalogs();
  }

  protected openNew(): void {
    this.draft.set(createEmptySociedad());
    this.drawerOpen.set(true);
  }

  protected openEdit(sociedad: Sociedad): void {
    this.draft.set({ ...sociedad });
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
      await this.loadSociedades();
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
    await this.loadSociedades();
  }

  protected updateDraft<K extends keyof Sociedad>(key: K, value: Sociedad[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadSociedades(): Promise<void> {
    this.sociedades.set(await this.repository.list());
  }

  private async loadCatalogs(): Promise<void> {
    const [paises, provincias, tarifas, estadosFacturacion, formasPago, destinos] = await Promise.all([
      this.catalogService.load('paises'),
      this.catalogService.load('provincias') as Promise<Provincia[]>,
      this.catalogService.load('tarifas'),
      this.catalogService.load('estados-facturacion'),
      this.catalogService.load('formas-pago'),
      this.catalogService.load('destinos'),
    ]);
    this.paises.set(paises);
    this.provincias.set(provincias);
    this.tarifas.set(tarifas);
    this.estadosFacturacion.set(estadosFacturacion);
    this.formasPago.set(formasPago);
    this.destinos.set(destinos);
  }
}
