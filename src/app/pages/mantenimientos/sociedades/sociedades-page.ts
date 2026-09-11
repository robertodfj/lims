import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { DESTINO_REPOSITORY } from '../destino-informes/destinos.tokens';
import { createEmptySociedad, Sociedad } from './sociedad.model';
import { SOCIEDAD_REPOSITORY } from './sociedades.tokens';

interface Provincia extends CatalogItem {
  readonly paisId: string;
}

type EstadoFilter = 'todos' | 'activa' | 'no-activa';

@Component({
  selector: 'app-sociedades-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect, DrawerFormFooter, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sociedades-page.html',
  styleUrl: './sociedades-page.css',
})
export class SociedadesPage {
  private readonly repository = inject(SOCIEDAD_REPOSITORY);
  private readonly catalogService = inject(CatalogService);
  private readonly destinoRepository = inject(DESTINO_REPOSITORY);

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptySociedad, (value) => !!value.nombre.trim());
  protected readonly sociedades = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');
  protected readonly estadoFilter = signal<EstadoFilter>('todos');

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
    void this.crud.load();
    void this.loadCatalogs();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected openEdit(sociedad: Sociedad): void {
    this.crud.openEdit(sociedad);
  }

  protected closeDrawer(): void {
    this.crud.closeDrawer();
  }

  /** Cambiar de país invalida la provincia elegida: evita combinaciones país/provincia inconsistentes. */
  protected onPaisChange(paisId: string | null): void {
    this.draft.update((current) => ({ ...current, paisId, provinciaId: null }));
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

  protected updateDraft<K extends keyof Sociedad>(key: K, value: Sociedad[K]): void {
    this.crud.updateDraft(key, value);
  }

  private async loadCatalogs(): Promise<void> {
    const [paises, provincias, tarifas, estadosFacturacion, formasPago, destinos] = await Promise.all([
      this.catalogService.load('paises'),
      this.catalogService.load('provincias') as Promise<Provincia[]>,
      this.catalogService.load('tarifas'),
      this.catalogService.load('estados-facturacion'),
      this.catalogService.load('formas-pago'),
      this.destinoRepository.list(),
    ]);
    this.paises.set(paises);
    this.provincias.set(provincias);
    this.tarifas.set(tarifas);
    this.estadosFacturacion.set(estadosFacturacion);
    this.formasPago.set(formasPago);
    this.destinos.set(destinos.map((destino) => ({ id: destino.id, nombre: `${destino.codigo} — ${destino.descripcion}` })));
  }
}
