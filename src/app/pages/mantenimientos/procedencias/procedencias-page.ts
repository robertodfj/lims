import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { DrawerStepNav } from '../../../shared/drawer-step-nav/drawer-step-nav';
import { Drawer } from '../../../shared/drawer/drawer';
import { EntityDrawerCrud } from '../../../shared/entity-drawer-crud/entity-drawer-crud';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { DESTINO_REPOSITORY } from '../destino-informes/destinos.tokens';
import { createEmptyProcedencia, Procedencia } from './procedencia.model';
import { PROCEDENCIA_REPOSITORY } from './procedencias.tokens';

@Component({
  selector: 'app-procedencias-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect, DrawerFormFooter, DrawerStepNav, ExcelActions],
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

  protected readonly provincias = signal<readonly CatalogItem[]>([]);
  protected readonly cabeceras = signal<readonly CatalogItem[]>([]);
  protected readonly formasPago = signal<readonly CatalogItem[]>([]);
  protected readonly destinos = signal<readonly CatalogItem[]>([]);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.procedencias() ?? []).filter(
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
    const [provincias, cabeceras, formasPago, destinos] = await Promise.all([
      this.catalogService.load('provincias'),
      this.catalogService.load('cabeceras'),
      this.catalogService.load('formas-pago'),
      this.destinoRepository.list(),
    ]);
    this.provincias.set(provincias);
    this.cabeceras.set(cabeceras);
    this.formasPago.set(formasPago);
    this.destinos.set(destinos.map((destino) => ({ id: destino.id, nombre: `${destino.codigo} — ${destino.descripcion}` })));
  }
}
