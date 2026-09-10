import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { DESTINO_REPOSITORY } from '../../mantenimientos/destino-informes/destinos.tokens';
import { PETICIONARIO_REPOSITORY } from '../../mantenimientos/peticionarios/peticionarios.tokens';
import { PROCEDENCIA_REPOSITORY } from '../../mantenimientos/procedencias/procedencias.tokens';
import { SOCIEDAD_REPOSITORY } from '../../mantenimientos/sociedades/sociedades.tokens';
import { TECNICA_REPOSITORY } from '../../mantenimientos/tecnicas/tecnicas.tokens';
import { TIPO_PETICION_REPOSITORY } from '../../mantenimientos/tipos-peticion/tipos-peticion.tokens';
import { createEmptyPeticion, Peticion, PeticionTecnica } from './peticion.model';
import { PETICION_REPOSITORY } from './peticiones.tokens';

type RangeFilter = 'todas' | 'hoy' | 'mes' | 'anio' | 'rango';

interface PeticionRow {
  readonly peticion: Peticion;
  readonly sociedadNombre: string;
  readonly procedenciaNombre: string;
  readonly peticionarioNombre: string;
}

function toDatetimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toDateOnlyValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

@Component({
  selector: 'app-peticiones-resultados-page',
  imports: [FormsModule, DecimalPipe, Icon, SearchableSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './peticiones-resultados-page.html',
  styleUrl: './peticiones-resultados-page.css',
})
export class PeticionesResultadosPage {
  private readonly repository = inject(PETICION_REPOSITORY);
  private readonly catalogService = inject(CatalogService);
  private readonly sociedadRepository = inject(SOCIEDAD_REPOSITORY);
  private readonly procedenciaRepository = inject(PROCEDENCIA_REPOSITORY);
  private readonly peticionarioRepository = inject(PETICIONARIO_REPOSITORY);
  private readonly tipoPeticionRepository = inject(TIPO_PETICION_REPOSITORY);
  private readonly destinoRepository = inject(DESTINO_REPOSITORY);
  private readonly tecnicaRepository = inject(TECNICA_REPOSITORY);

  protected readonly mode = signal<'list' | 'form'>('list');

  protected readonly peticiones = signal<Peticion[] | null>(null);

  protected readonly search = signal('');
  protected readonly rangeFilter = signal<RangeFilter>('todas');
  protected readonly rangoDesde = signal<string | null>(null);
  protected readonly rangoHasta = signal<string | null>(null);

  protected readonly draft = signal<Peticion>(createEmptyPeticion());
  protected readonly saving = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly sociedades = signal<readonly CatalogItem[]>([]);
  protected readonly procedencias = signal<readonly CatalogItem[]>([]);
  protected readonly peticionarios = signal<readonly CatalogItem[]>([]);
  protected readonly tiposPeticion = signal<readonly CatalogItem[]>([]);
  protected readonly estadosFacturacion = signal<readonly CatalogItem[]>([]);
  protected readonly destinos = signal<readonly CatalogItem[]>([]);
  protected readonly tecnicas = signal<readonly CatalogItem[]>([]);

  protected readonly mesAnioActual = computed(() =>
    new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date()).toUpperCase(),
  );

  protected readonly ultimoNumRegistro = computed(() =>
    (this.peticiones() ?? []).reduce((max, peticion) => Math.max(max, peticion.numRegistro), 0),
  );

  private readonly rows = computed<PeticionRow[]>(() => {
    const sociedadesById = new Map(this.sociedades().map((item) => [item.id, item.nombre]));
    const procedenciasById = new Map(this.procedencias().map((item) => [item.id, item.nombre]));
    const peticionariosById = new Map(this.peticionarios().map((item) => [item.id, item.nombre]));

    return (this.peticiones() ?? []).map((peticion) => ({
      peticion,
      sociedadNombre: (peticion.sociedadId && sociedadesById.get(peticion.sociedadId)) || '—',
      procedenciaNombre: (peticion.procedenciaId && procedenciasById.get(peticion.procedenciaId)) || '—',
      peticionarioNombre: (peticion.peticionarioId && peticionariosById.get(peticion.peticionarioId)) || '—',
    }));
  });

  protected readonly filtered = computed<PeticionRow[]>(() => {
    const term = this.search().trim().toLowerCase();
    const range = this.rangeFilter();
    const desde = this.rangoDesde();
    const hasta = this.rangoHasta();
    const now = new Date();

    return this.rows()
      .filter(
        (row) =>
          !term ||
          String(row.peticion.numRegistro).includes(term) ||
          row.sociedadNombre.toLowerCase().includes(term) ||
          row.procedenciaNombre.toLowerCase().includes(term) ||
          row.peticionarioNombre.toLowerCase().includes(term),
      )
      .filter((row) => {
        if (range === 'todas' || !row.peticion.fechaVisita) {
          return true;
        }
        const fecha = new Date(row.peticion.fechaVisita);
        if (range === 'hoy') {
          return toDateOnlyValue(fecha) === toDateOnlyValue(now);
        }
        if (range === 'mes') {
          return fecha.getFullYear() === now.getFullYear() && fecha.getMonth() === now.getMonth();
        }
        if (range === 'anio') {
          return fecha.getFullYear() === now.getFullYear();
        }
        // rango personalizado
        if (desde && toDateOnlyValue(fecha) < desde) {
          return false;
        }
        if (hasta && toDateOnlyValue(fecha) > hasta) {
          return false;
        }
        return true;
      });
  });

  /** Técnicas del catálogo aún no añadidas a la solicitud de pruebas. */
  protected readonly tecnicasDisponibles = computed<CatalogItem[]>(() => {
    const añadidas = new Set(this.draft().tecnicas.map((linea) => linea.tecnicaId));
    return this.tecnicas().filter((tecnica) => !añadidas.has(tecnica.id));
  });

  protected readonly lineasSolicitud = computed(() => {
    const porId = new Map(this.tecnicas().map((tecnica) => [tecnica.id, tecnica]));
    return this.draft().tecnicas.map((linea) => ({
      linea,
      nombre: porId.get(linea.tecnicaId)?.nombre ?? linea.tecnicaId,
    }));
  });

  protected readonly totalPrecio = computed(() =>
    this.draft().tecnicas.reduce((total, linea) => total + (linea.precio ?? 0), 0),
  );

  constructor() {
    void this.loadPeticiones();
    void this.loadCatalogs();
  }

  protected async openNueva(): Promise<void> {
    const numRegistro = await this.repository.nextNumRegistro();
    this.draft.set({ ...createEmptyPeticion(), numRegistro, fechaVisita: toDatetimeLocalValue(new Date()) });
    this.mode.set('form');
  }

  protected openEdit(peticion: Peticion): void {
    this.draft.set({ ...peticion, tecnicas: peticion.tecnicas.map((linea) => ({ ...linea })) });
    this.mode.set('form');
  }

  protected cancelarForm(): void {
    this.mode.set('list');
  }

  protected addTecnica(tecnicaId: string | null): void {
    if (!tecnicaId) {
      return;
    }
    this.draft.update((current) =>
      current.tecnicas.some((linea) => linea.tecnicaId === tecnicaId)
        ? current
        : { ...current, tecnicas: [...current.tecnicas, { tecnicaId, precio: null } satisfies PeticionTecnica] },
    );
  }

  protected removeTecnica(tecnicaId: string): void {
    this.draft.update((current) => ({
      ...current,
      tecnicas: current.tecnicas.filter((linea) => linea.tecnicaId !== tecnicaId),
    }));
  }

  protected updateTecnicaPrecio(tecnicaId: string, precio: number | null): void {
    this.draft.update((current) => ({
      ...current,
      tecnicas: current.tecnicas.map((linea) => (linea.tecnicaId === tecnicaId ? { ...linea, precio } : linea)),
    }));
  }

  protected async guardar(): Promise<void> {
    if (!(await this.persistirDraft())) {
      return;
    }
    this.mode.set('list');
  }

  protected async guardarYNuevo(): Promise<void> {
    if (!(await this.persistirDraft())) {
      return;
    }
    await this.openNueva();
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
    await this.loadPeticiones();
  }

  protected updateDraft<K extends keyof Peticion>(key: K, value: Peticion[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  /** Valida y guarda; devuelve si se pudo guardar (para encadenar "Guardar y Nuevo"). */
  private async persistirDraft(): Promise<boolean> {
    const value = this.draft();
    if (!value.sociedadId || !value.procedenciaId || !value.peticionarioId) {
      return false;
    }

    this.saving.set(true);
    try {
      await this.repository.save(value);
      await this.loadPeticiones();
      return true;
    } finally {
      this.saving.set(false);
    }
  }

  private async loadPeticiones(): Promise<void> {
    this.peticiones.set(await this.repository.list());
  }

  private async loadCatalogs(): Promise<void> {
    const [sociedades, procedencias, peticionarios, tiposPeticion, estadosFacturacion, destinos, tecnicas] = await Promise.all([
      this.sociedadRepository.list(),
      this.procedenciaRepository.list(),
      this.peticionarioRepository.list(),
      this.tipoPeticionRepository.list(),
      this.catalogService.load('estados-facturacion'),
      this.destinoRepository.list(),
      this.tecnicaRepository.list(),
    ]);

    this.sociedades.set(sociedades.map((sociedad) => ({ id: sociedad.id, nombre: sociedad.nombre })));
    this.procedencias.set(
      procedencias.map((procedencia) => ({
        id: procedencia.id,
        nombre: procedencia.codigo ? `${procedencia.codigo} — ${procedencia.nombre}` : procedencia.nombre,
      })),
    );
    this.peticionarios.set(
      peticionarios.map((peticionario) => ({
        id: peticionario.id,
        nombre: peticionario.codigo ? `${peticionario.codigo} — ${peticionario.nombre}` : peticionario.nombre,
      })),
    );
    this.tiposPeticion.set(
      tiposPeticion.map((tipo) => ({ id: tipo.id, nombre: tipo.codigo ? `${tipo.codigo} — ${tipo.nombre}` : tipo.nombre })),
    );
    this.estadosFacturacion.set(estadosFacturacion);
    this.destinos.set(
      destinos.map((destino) => ({
        id: destino.id,
        nombre: destino.codigo ? `${destino.codigo} — ${destino.descripcion}` : destino.descripcion,
      })),
    );
    this.tecnicas.set(
      tecnicas.map((tecnica) => ({ id: tecnica.id, nombre: tecnica.codigo ? `${tecnica.codigo} — ${tecnica.nombre}` : tecnica.nombre })),
    );
  }
}
