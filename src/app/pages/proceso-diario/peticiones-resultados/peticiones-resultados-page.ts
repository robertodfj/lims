import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { ReportSummary } from '../../../reporting/models/report.model';
import { REPORT_REPOSITORY } from '../../../reporting/services/reporting.tokens';
import { Alert } from '../../../shared/alert/alert';
import { Icon } from '../../../shared/icon/icon';
import { Modal } from '../../../shared/modal/modal';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { createEmptyPaciente, Paciente } from '../../mantenimientos/base-pacientes/paciente.model';
import { PACIENTE_REPOSITORY } from '../../mantenimientos/base-pacientes/base-pacientes.tokens';
import { DESTINO_REPOSITORY } from '../../mantenimientos/destino-informes/destinos.tokens';
import { GRUPO_REPOSITORY } from '../../mantenimientos/grupos-tecnicas/grupos-tecnicas.tokens';
import { LABORATORIO_REFERENCIA_REPOSITORY } from '../../mantenimientos/laboratorios-referencia/laboratorios-referencia.tokens';
import { Peticionario } from '../../mantenimientos/peticionarios/peticionario.model';
import { Procedencia } from '../../mantenimientos/procedencias/procedencia.model';
import { Sociedad } from '../../mantenimientos/sociedades/sociedad.model';
import { Destino } from '../../mantenimientos/destino-informes/destino.model';
import { PETICIONARIO_REPOSITORY } from '../../mantenimientos/peticionarios/peticionarios.tokens';
import { PROCEDENCIA_REPOSITORY } from '../../mantenimientos/procedencias/procedencias.tokens';
import { SEXO_ESPECIE_REPOSITORY } from '../../mantenimientos/sexo-especie/sexo-especie.tokens';
import { SOCIEDAD_REPOSITORY } from '../../mantenimientos/sociedades/sociedades.tokens';
import { TecnicaEditDrawer } from '../../mantenimientos/tecnicas/tecnica-edit-drawer';
import { Tecnica } from '../../mantenimientos/tecnicas/tecnica.model';
import { TECNICA_REPOSITORY } from '../../mantenimientos/tecnicas/tecnicas.tokens';
import { TIPO_PETICION_REPOSITORY } from '../../mantenimientos/tipos-peticion/tipos-peticion.tokens';
import { createEmptyPeticion, Peticion, PeticionTecnica } from './peticion.model';
import { PETICION_REPOSITORY } from './peticiones.tokens';

type RangeFilter = 'todas' | 'hoy' | 'mes' | 'anio' | 'rango';
type Desviacion = 'bajo' | 'alto' | 'normal' | null;

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

/** Texto "70 - 110" (o "< 200" si solo hay tope superior) a partir de los límites de la técnica. */
function formatReferencia(tecnica: Tecnica | undefined): string {
  if (!tecnica || (tecnica.referencia1 == null && tecnica.referencia2 == null)) {
    return '';
  }
  if (tecnica.referencia1 != null && tecnica.referencia2 != null) {
    return `${tecnica.referencia1} - ${tecnica.referencia2}`;
  }
  if (tecnica.referencia2 != null) {
    return `< ${tecnica.referencia2}`;
  }
  return `> ${tecnica.referencia1}`;
}

/** Compara el resultado numérico con los límites de normalidad de la técnica. */
function computeDesviacion(tecnica: Tecnica | undefined, resultado: string | null): Desviacion {
  if (!tecnica || tecnica.tipoResultadoId !== 'numerico' || !resultado?.trim()) {
    return null;
  }
  const valor = Number(resultado);
  if (Number.isNaN(valor)) {
    return null;
  }
  if (tecnica.referencia1 != null && valor < tecnica.referencia1) {
    return 'bajo';
  }
  if (tecnica.referencia2 != null && valor > tecnica.referencia2) {
    return 'alto';
  }
  return tecnica.referencia1 != null || tecnica.referencia2 != null ? 'normal' : null;
}

/**
 * `avisoEnPeticiones` es un texto libre en el modelo actual, pero navegadores con datos
 * antiguos en localStorage (de cuando este campo era un booleano) pueden tener guardado
 * `true`/`false`/`undefined` en su sitio: se ignora cualquier valor que no sea un string.
 */
function normalizeAviso(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  return value.trim() || null;
}

@Component({
  selector: 'app-peticiones-resultados-page',
  imports: [FormsModule, DatePipe, DecimalPipe, Icon, SearchableSelect, Modal, TecnicaEditDrawer, Alert],
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
  private readonly grupoRepository = inject(GRUPO_REPOSITORY);
  private readonly pacienteRepository = inject(PACIENTE_REPOSITORY);
  private readonly sexoEspecieRepository = inject(SEXO_ESPECIE_REPOSITORY);
  private readonly laboratorioReferenciaRepository = inject(LABORATORIO_REFERENCIA_REPOSITORY);
  private readonly reportRepository = inject(REPORT_REPOSITORY);

  protected readonly mode = signal<'list' | 'form'>('list');
  protected readonly activeTab = signal<'peticion' | 'demograficos' | 'resultados'>('peticion');

  protected readonly peticiones = signal<Peticion[] | null>(null);

  protected readonly search = signal('');
  protected readonly rangeFilter = signal<RangeFilter>('todas');
  protected readonly rangoDesde = signal<string | null>(null);
  protected readonly rangoHasta = signal<string | null>(null);

  protected readonly draft = signal<Peticion>(createEmptyPeticion());
  protected readonly saving = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly pacienteDraft = signal<Paciente>(createEmptyPaciente());
  protected readonly buscandoPaciente = signal(false);
  /** null = modal cerrado; array = candidatos entre los que elegir. */
  protected readonly candidatosPaciente = signal<Paciente[] | null>(null);
  /** Se muestra cuando una búsqueda no encuentra ningún paciente. */
  protected readonly ofrecerCrearPaciente = signal(false);

  /**
   * Los campos secundarios (contacto, dirección, datos administrativos) solo se habilitan
   * una vez se ha identificado al paciente con alguno de los campos principales: evita crear
   * fichas con datos de contacto sueltos sin saber a quién pertenecen.
   */
  protected readonly camposSecundariosHabilitados = computed(() => {
    const paciente = this.pacienteDraft();
    return !!(
      paciente.historiaClinica.trim() ||
      paciente.dni.trim() ||
      paciente.apellidos.trim() ||
      paciente.nombre.trim() ||
      paciente.fechaNacimiento
    );
  });

  protected readonly sociedades = signal<readonly CatalogItem[]>([]);
  /** Registros completos de sociedades (no solo id/nombre), para poder leer su aviso. */
  protected readonly sociedadesCompletas = signal<readonly Sociedad[]>([]);
  protected readonly procedencias = signal<readonly CatalogItem[]>([]);
  /** Registros completos de procedencias (no solo id/nombre), para poder leer su aviso. */
  protected readonly procedenciasCompletas = signal<readonly Procedencia[]>([]);
  protected readonly peticionarios = signal<readonly CatalogItem[]>([]);
  /** Registros completos de peticionarios (no solo id/nombre), para poder leer su aviso. */
  protected readonly peticionariosCompletos = signal<readonly Peticionario[]>([]);
  protected readonly tiposPeticion = signal<readonly CatalogItem[]>([]);
  protected readonly estadosFacturacion = signal<readonly CatalogItem[]>([]);
  protected readonly destinos = signal<readonly CatalogItem[]>([]);
  /** Registros completos de destinos (no solo id/nombre), para poder leer su aviso. */
  protected readonly destinosCompletos = signal<readonly Destino[]>([]);
  protected readonly tecnicas = signal<readonly CatalogItem[]>([]);
  /** Registros completos de técnicas (no solo id/nombre), para mostrar código y tiempo de respuesta en la solicitud. */
  protected readonly tecnicasCompletas = signal<readonly Tecnica[]>([]);
  protected readonly grupos = signal<readonly CatalogItem[]>([]);
  protected readonly provincias = signal<readonly CatalogItem[]>([]);
  protected readonly sexosEspecies = signal<readonly CatalogItem[]>([]);

  /** Aviso del peticionario elegido en la petición (si tiene uno configurado). */
  protected readonly avisoPeticionario = computed(() => {
    const id = this.draft().peticionarioId;
    const aviso = id && this.peticionariosCompletos().find((peticionario) => peticionario.id === id)?.avisoEnPeticiones;
    return normalizeAviso(aviso);
  });

  /** Aviso de la procedencia elegida en la petición (si tiene uno configurado). */
  protected readonly avisoProcedencia = computed(() => {
    const id = this.draft().procedenciaId;
    const aviso = id && this.procedenciasCompletas().find((procedencia) => procedencia.id === id)?.avisoEnPeticiones;
    return normalizeAviso(aviso);
  });

  /** Aviso de la sociedad elegida en la petición (si tiene uno configurado). */
  protected readonly avisoSociedad = computed(() => {
    const id = this.draft().sociedadId;
    const aviso = id && this.sociedadesCompletas().find((sociedad) => sociedad.id === id)?.avisoEnPeticiones;
    return normalizeAviso(aviso);
  });

  /** Aviso del destino elegido en la petición (si tiene uno configurado). */
  protected readonly avisoDestino = computed(() => {
    const id = this.draft().destinoId;
    const aviso = id && this.destinosCompletos().find((destino) => destino.id === id)?.avisoEnPeticiones;
    return normalizeAviso(aviso);
  });

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

  private readonly gruposPorId = computed(() => new Map(this.grupos().map((grupo) => [grupo.id, grupo.nombre])));

  protected readonly lineasSolicitud = computed(() => {
    const porId = new Map(this.tecnicasCompletas().map((tecnica) => [tecnica.id, tecnica]));
    return this.draft().tecnicas.map((linea) => {
      const tecnica = porId.get(linea.tecnicaId);
      return {
        linea,
        codigo: tecnica?.codigo ?? '—',
        nombre: tecnica?.nombre ?? linea.tecnicaId,
        grupo: tecnica?.grupoId ? (this.gruposPorId().get(tecnica.grupoId) ?? '—') : '—',
        tiempoRespuesta: tecnica?.tiempoRespuesta || '—',
      };
    });
  });

  protected readonly totalPrecio = computed(() =>
    this.draft().tecnicas.reduce((total, linea) => total + (linea.precio ?? 0), 0),
  );

  // ---------------------------------------------------------------------
  // Cabecera de la petición (resumen visible en cualquier pestaña) e impresión
  // ---------------------------------------------------------------------

  protected readonly pacienteNombreCompleto = computed(() => {
    const paciente = this.pacienteDraft();
    const nombre = [paciente.apellidos.trim(), paciente.nombre.trim()].filter(Boolean).join(', ');
    return nombre || '—';
  });

  protected readonly edadPaciente = computed(() => {
    const fechaNacimiento = this.pacienteDraft().fechaNacimiento;
    if (!fechaNacimiento) {
      return null;
    }
    const nacimiento = new Date(fechaNacimiento);
    if (Number.isNaN(nacimiento.getTime())) {
      return null;
    }
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const aunNoCumple =
      hoy.getMonth() < nacimiento.getMonth() ||
      (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
    if (aunNoCumple) {
      edad -= 1;
    }
    return edad >= 0 ? edad : null;
  });

  protected readonly tipoPeticionNombre = computed(() => {
    const id = this.draft().tipoPeticionId;
    return (id && this.tiposPeticion().find((tipo) => tipo.id === id)?.nombre) || '—';
  });

  /** Solo se puede imprimir una petición ya guardada (con id) y con al menos una técnica. */
  protected readonly puedeImprimir = computed(() => this.draft().id !== '' && this.draft().tecnicas.length > 0);

  protected readonly modelosInforme = signal<ReportSummary[]>([]);
  protected readonly imprimirModalOpen = signal(false);
  protected readonly modeloSeleccionadoId = signal<string | null>(null);
  /** Id de la petición a imprimir: puede venir de la cabecera del formulario o de una fila del listado. */
  private imprimirPeticionId: string | null = null;

  // ---------------------------------------------------------------------
  // Pestaña Resultados
  // ---------------------------------------------------------------------

  protected readonly resultadosSearch = signal('');
  protected readonly soloSinInformar = signal(false);

  protected readonly lineasResultados = computed(() => {
    const porId = new Map(this.tecnicasCompletas().map((tecnica) => [tecnica.id, tecnica]));
    return this.draft().tecnicas.map((linea) => {
      const tecnica = porId.get(linea.tecnicaId);
      return {
        linea,
        codigo: tecnica?.codigo ?? '—',
        nombre: tecnica?.nombre ?? linea.tecnicaId,
        tipoResultadoId: tecnica?.tipoResultadoId ?? null,
        unidad: tecnica?.unidad1 || '',
        referenciaTexto: formatReferencia(tecnica),
        desviacion: computeDesviacion(tecnica, linea.resultado),
        laboratorioNombre: this.laboratoriosExternosPorId().get(tecnica?.laboratorioExternoId ?? '') ?? '',
      };
    });
  });

  protected readonly laboratoriosExternos = signal<readonly CatalogItem[]>([]);
  private readonly laboratoriosExternosPorId = computed(
    () => new Map(this.laboratoriosExternos().map((laboratorio) => [laboratorio.id, laboratorio.nombre])),
  );

  protected readonly lineasResultadosFiltradas = computed(() => {
    const term = this.resultadosSearch().trim().toLowerCase();
    const soloSinInformar = this.soloSinInformar();
    return this.lineasResultados()
      .filter((item) => !soloSinInformar || !item.linea.resultado?.trim())
      .filter(
        (item) =>
          !term || item.nombre.toLowerCase().includes(term) || item.codigo.toLowerCase().includes(term),
      );
  });

  /** Id de la técnica cuya línea se está editando; null = drawer cerrado. */
  private readonly lineaEnEdicionId = signal<string | null>(null);

  /** Mismo formulario que Mantenimientos / Técnicas: se le pasa el registro completo de la técnica. */
  protected readonly tecnicaEnEdicion = computed<Tecnica | null>(() => {
    const id = this.lineaEnEdicionId();
    if (!id) {
      return null;
    }
    return this.tecnicasCompletas().find((tecnica) => tecnica.id === id) ?? null;
  });

  constructor() {
    void this.loadPeticiones();
    void this.loadCatalogs();
  }

  protected async openNueva(): Promise<void> {
    const numRegistro = await this.repository.nextNumRegistro();
    this.draft.set({ ...createEmptyPeticion(), numRegistro, fechaVisita: toDatetimeLocalValue(new Date()) });
    this.pacienteDraft.set(createEmptyPaciente());
    this.candidatosPaciente.set(null);
    this.ofrecerCrearPaciente.set(false);
    this.activeTab.set('peticion');
    this.mode.set('form');
  }

  protected async openEdit(peticion: Peticion): Promise<void> {
    this.draft.set({ ...peticion, tecnicas: peticion.tecnicas.map((linea) => ({ ...linea })) });
    const paciente = peticion.pacienteId ? await this.pacienteRepository.get(peticion.pacienteId) : null;
    this.pacienteDraft.set(paciente ?? createEmptyPaciente());
    this.candidatosPaciente.set(null);
    this.ofrecerCrearPaciente.set(false);
    this.activeTab.set('peticion');
    this.mode.set('form');
  }

  protected cancelarForm(): void {
    this.mode.set('list');
  }

  protected updatePacienteDraft<K extends keyof Paciente>(key: K, value: Paciente[K]): void {
    this.pacienteDraft.update((current) => ({ ...current, [key]: value }));
  }

  /**
   * Busca combinando los campos principales que se hayan rellenado (cada uno filtra por
   * separado, en AND): si solo hay Apellidos, busca por apellidos; si hay Nombre y
   * Apellidos, busca por ambos a la vez, y así con cualquier combinación. Si hay una única
   * coincidencia la carga directamente; si hay varias, abre el modal para elegir.
   */
  protected async buscarPaciente(): Promise<void> {
    const criterios = this.pacienteDraft();
    const historiaClinica = criterios.historiaClinica.trim().toLowerCase();
    const dni = criterios.dni.trim().toLowerCase();
    const apellidos = criterios.apellidos.trim().toLowerCase();
    const nombre = criterios.nombre.trim().toLowerCase();
    const fechaNacimiento = criterios.fechaNacimiento;

    if (!historiaClinica && !dni && !apellidos && !nombre && !fechaNacimiento) {
      return;
    }

    this.buscandoPaciente.set(true);
    try {
      const pacientes = await this.pacienteRepository.list();
      const candidatos = pacientes.filter(
        (paciente) =>
          (!historiaClinica || paciente.historiaClinica.toLowerCase().includes(historiaClinica)) &&
          (!dni || paciente.dni.toLowerCase().includes(dni)) &&
          (!apellidos || paciente.apellidos.toLowerCase().includes(apellidos)) &&
          (!nombre || paciente.nombre.toLowerCase().includes(nombre)) &&
          (!fechaNacimiento || paciente.fechaNacimiento === fechaNacimiento),
      );

      if (candidatos.length === 1) {
        this.seleccionarPaciente(candidatos[0]);
      } else if (candidatos.length > 1) {
        this.candidatosPaciente.set(candidatos);
      } else {
        this.ofrecerCrearPaciente.set(true);
      }
    } finally {
      this.buscandoPaciente.set(false);
    }
  }

  /** Resumen legible de los criterios usados en la última búsqueda, para el modal de "sin resultados". */
  protected readonly resumenBusquedaPaciente = computed(() => {
    const paciente = this.pacienteDraft();
    const partes: string[] = [];
    if (paciente.historiaClinica.trim()) partes.push(`historia clínica «${paciente.historiaClinica.trim()}»`);
    if (paciente.dni.trim()) partes.push(`DNI «${paciente.dni.trim()}»`);
    if (paciente.apellidos.trim()) partes.push(`apellidos «${paciente.apellidos.trim()}»`);
    if (paciente.nombre.trim()) partes.push(`nombre «${paciente.nombre.trim()}»`);
    if (paciente.fechaNacimiento) partes.push(`fecha de nacimiento «${paciente.fechaNacimiento}»`);
    return partes.join(', ');
  });

  protected seleccionarPaciente(paciente: Paciente): void {
    this.pacienteDraft.set({ ...paciente });
    this.candidatosPaciente.set(null);
  }

  protected cerrarCandidatosPaciente(): void {
    this.candidatosPaciente.set(null);
  }

  protected cerrarOfrecerCrearPaciente(): void {
    this.ofrecerCrearPaciente.set(false);
  }

  /** Lo que ya se ha escrito queda en pacienteDraft: solo hay que cerrar el aviso y seguir rellenando. */
  protected crearPacienteDesdeBusqueda(): void {
    this.ofrecerCrearPaciente.set(false);
  }

  protected addTecnica(tecnicaId: string | null): void {
    if (!tecnicaId) {
      return;
    }
    const porId = new Map(this.tecnicasCompletas().map((tecnica) => [tecnica.id, tecnica]));

    this.draft.update((current) => {
      const yaIncluidas = new Set(current.tecnicas.map((linea) => linea.tecnicaId));
      const idsAAñadir = [tecnicaId];

      // Si es una Agrupación de pruebas, sus técnicas asociadas se añaden automáticamente.
      const tecnica = porId.get(tecnicaId);
      if (tecnica?.tipoResultadoId === 'agrupacion-pruebas') {
        for (const hijaId of tecnica.tecnicasAgrupadasIds) {
          if (hijaId !== tecnicaId) {
            idsAAñadir.push(hijaId);
          }
        }
      }

      const nuevasLineas = idsAAñadir
        .filter((id, index) => idsAAñadir.indexOf(id) === index && !yaIncluidas.has(id))
        .map((id): PeticionTecnica => ({ tecnicaId: id, precio: null, resultado: null, validado: false }));

      return nuevasLineas.length === 0 ? current : { ...current, tecnicas: [...current.tecnicas, ...nuevasLineas] };
    });
  }

  protected removeTecnica(tecnicaId: string): void {
    this.draft.update((current) => ({
      ...current,
      tecnicas: current.tecnicas.filter((linea) => linea.tecnicaId !== tecnicaId),
    }));
    if (this.lineaEnEdicionId() === tecnicaId) {
      this.lineaEnEdicionId.set(null);
    }
  }

  protected updateTecnicaPrecio(tecnicaId: string, precio: number | null): void {
    this.draft.update((current) => ({
      ...current,
      tecnicas: current.tecnicas.map((linea) => (linea.tecnicaId === tecnicaId ? { ...linea, precio } : linea)),
    }));
  }

  protected updateTecnicaResultado(tecnicaId: string, resultado: string | null): void {
    this.draft.update((current) => ({
      ...current,
      tecnicas: current.tecnicas.map((linea) => (linea.tecnicaId === tecnicaId ? { ...linea, resultado } : linea)),
    }));
  }

  protected updateTecnicaValidado(tecnicaId: string, validado: boolean): void {
    this.draft.update((current) => ({
      ...current,
      tecnicas: current.tecnicas.map((linea) => (linea.tecnicaId === tecnicaId ? { ...linea, validado } : linea)),
    }));
  }

  // ---------------------------------------------------------------------
  // Imprimir: modal de selección de modelo + apertura del informe en otra pestaña
  // ---------------------------------------------------------------------

  /** Botón "Imprimir" de la cabecera del formulario: imprime la petición en edición. */
  protected abrirImprimirDraft(): void {
    if (!this.puedeImprimir()) {
      return;
    }
    void this.abrirImprimir(this.draft().id);
  }

  /** Icono "Imprimir" de una fila del listado: imprime esa petición directamente. */
  protected abrirImprimirFila(peticionId: string): void {
    void this.abrirImprimir(peticionId);
  }

  private async abrirImprimir(peticionId: string): Promise<void> {
    this.imprimirPeticionId = peticionId;
    this.modelosInforme.set(await this.reportRepository.list());
    this.modeloSeleccionadoId.set(this.modelosInforme()[0]?.id ?? null);
    this.imprimirModalOpen.set(true);
  }

  protected cerrarImprimir(): void {
    this.imprimirModalOpen.set(false);
  }

  protected confirmarImprimir(): void {
    const reportId = this.modeloSeleccionadoId();
    const peticionId = this.imprimirPeticionId;
    if (!reportId || !peticionId) {
      return;
    }
    window.open(`/imprimir/${reportId}/${peticionId}`, '_blank', 'noopener');
    this.imprimirModalOpen.set(false);
  }

  protected abrirEdicionTecnica(tecnicaId: string): void {
    this.lineaEnEdicionId.set(tecnicaId);
  }

  protected cerrarEdicionTecnica(): void {
    this.lineaEnEdicionId.set(null);
  }

  /** El formulario de edición pudo cambiar código/nombre/grupo: refresca el catálogo de técnicas. */
  protected async onTecnicaEditadaGuardada(): Promise<void> {
    await this.loadCatalogs();
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

  protected async guardarYDatos(): Promise<void> {
    if (!(await this.persistirDraft())) {
      return;
    }
    this.activeTab.set('demograficos');
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
    let value = this.draft();
    if (!value.sociedadId || !value.procedenciaId || !value.peticionarioId || value.tecnicas.length === 0) {
      return false;
    }

    this.saving.set(true);
    try {
      const paciente = this.pacienteDraft();
      if (paciente.apellidos.trim()) {
        const pacienteGuardado = await this.pacienteRepository.save(paciente);
        this.pacienteDraft.set(pacienteGuardado);
        value = { ...value, pacienteId: pacienteGuardado.id };
      }

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
    const [
      sociedades,
      procedencias,
      peticionarios,
      tiposPeticion,
      estadosFacturacion,
      destinos,
      tecnicas,
      provincias,
      sexosEspecies,
      grupos,
      laboratoriosExternos,
    ] = await Promise.all([
      this.sociedadRepository.list(),
      this.procedenciaRepository.list(),
      this.peticionarioRepository.list(),
      this.tipoPeticionRepository.list(),
      this.catalogService.load('estados-facturacion'),
      this.destinoRepository.list(),
      this.tecnicaRepository.list(),
      this.catalogService.load('provincias'),
      this.sexoEspecieRepository.list(),
      this.grupoRepository.list(),
      this.laboratorioReferenciaRepository.list(),
    ]);

    this.sociedades.set(sociedades.map((sociedad) => ({ id: sociedad.id, nombre: sociedad.nombre })));
    this.sociedadesCompletas.set(sociedades);
    this.procedencias.set(
      procedencias.map((procedencia) => ({
        id: procedencia.id,
        nombre: procedencia.codigo ? `${procedencia.codigo} — ${procedencia.nombre}` : procedencia.nombre,
      })),
    );
    this.procedenciasCompletas.set(procedencias);
    this.peticionarios.set(
      peticionarios.map((peticionario) => ({
        id: peticionario.id,
        nombre: peticionario.codigo ? `${peticionario.codigo} — ${peticionario.nombre}` : peticionario.nombre,
      })),
    );
    this.peticionariosCompletos.set(peticionarios);
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
    this.destinosCompletos.set(destinos);
    this.tecnicas.set(
      tecnicas.map((tecnica) => ({ id: tecnica.id, nombre: tecnica.codigo ? `${tecnica.codigo} — ${tecnica.nombre}` : tecnica.nombre })),
    );
    this.tecnicasCompletas.set(tecnicas);
    this.grupos.set(grupos.map((grupo) => ({ id: grupo.id, nombre: grupo.nombre })));
    this.provincias.set(provincias);
    this.sexosEspecies.set(
      sexosEspecies.map((item) => ({
        id: item.id,
        nombre: item.codigo ? `${item.codigo} — ${item.sexoEspecie}` : item.sexoEspecie,
      })),
    );
    this.laboratoriosExternos.set(
      laboratoriosExternos.map((laboratorio) => ({ id: laboratorio.id, nombre: laboratorio.nombre })),
    );
  }
}
