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
import { createEmptyProcedencia, Procedencia } from './procedencia.model';
import { PROCEDENCIA_REPOSITORY } from './procedencias.tokens';

interface Provincia extends CatalogItem {
  readonly paisId: string;
}

type EstadoFilter = 'todos' | 'activa' | 'no-activa';

@Component({
  selector: 'app-procedencias-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect, DrawerFormFooter, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './procedencias-page.html',
  styleUrl: './procedencias-page.css',
})
export class ProcedenciasPage {
  private readonly repository = inject(PROCEDENCIA_REPOSITORY);
  private readonly catalogService = inject(CatalogService);
  private readonly destinoRepository = inject(DESTINO_REPOSITORY);

  protected readonly crud = new EntityDrawerCrud(this.repository, createEmptyProcedencia, (value) => !!value.nombre.trim(), {
    field: 'codigo',
    next: () => this.repository.nextCodigo(),
  });
  protected readonly procedencias = this.crud.items;
  protected readonly drawerOpen = this.crud.drawerOpen;
  protected readonly draft = this.crud.draft;
  protected readonly saving = this.crud.saving;
  protected readonly generatingCodigo = this.crud.generating;
  protected readonly confirmDeleteId = this.crud.confirmDeleteId;

  protected readonly search = signal('');
  protected readonly estadoFilter = signal<EstadoFilter>('todos');

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
    void this.crud.load();
    void this.loadCatalogs();
  }

  protected openNew(): void {
    void this.crud.openNew();
  }

  protected generateCodigo(): Promise<void> {
    return this.crud.regenerate();
  }

  protected openEdit(procedencia: Procedencia): void {
    this.crud.openEdit(procedencia);
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

  protected updateDraft<K extends keyof Procedencia>(key: K, value: Procedencia[K]): void {
    this.crud.updateDraft(key, value);
  }

  private async loadCatalogs(): Promise<void> {
    const [paises, provincias, cabeceras, formasPago, destinos] = await Promise.all([
      this.catalogService.load('paises'),
      this.catalogService.load('provincias') as Promise<Provincia[]>,
      this.catalogService.load('cabeceras'),
      this.catalogService.load('formas-pago'),
      this.destinoRepository.list(),
    ]);
    this.paises.set(paises);
    this.provincias.set(provincias);
    this.cabeceras.set(cabeceras);
    this.formasPago.set(formasPago);
    this.destinos.set(destinos.map((destino) => ({ id: destino.id, nombre: `${destino.codigo} — ${destino.descripcion}` })));
  }
}
