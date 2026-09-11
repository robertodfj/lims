export interface Tecnica {
  readonly id: string;
  codigo: string;
  nombre: string;

  grupoId: string | null;
  subgrupoId: string | null;
  /** Numérico, Texto Libre, Alfabético, Calculado, Agrupación de pruebas o Microbiología. */
  tipoResultadoId: string | null;
  numDecimales: number | null;
  /** Solo aplica a Texto Libre y Microbiología. Máximo 9. */
  numLineas: number | null;

  unidad1: string;
  unidad2: string;
  factorConversion: number | null;

  /** Límite inferior de la normalidad: por debajo, el resultado se resalta. */
  referencia1: number | null;
  /** Límite superior de la normalidad: por encima, el resultado se resalta. */
  referencia2: number | null;
  /** Límite inferior a partir del cual se pide confirmación antes de grabar. */
  alarma1: number | null;
  /** Límite superior a partir del cual se pide confirmación antes de grabar. */
  alarma2: number | null;
  /** Límite inferior a partir del cual el resultado se considera imposible y no se permite introducir. */
  panico1: number | null;
  /** Límite superior a partir del cual el resultado se considera imposible y no se permite introducir. */
  panico2: number | null;

  /** % de variación admitido respecto al resultado anterior de la misma técnica. */
  deltaCheckPorcentaje: number | null;
  /** Nº de días durante los que el resultado anterior se tiene en cuenta para el Delta Check. */
  deltaCheckDias: number | null;

  ordenImpresion: number | null;
  laboratorioExternoId: string | null;
  nombreInforme: string;
  cabeceraEdicion: string;
  comentarioEdicion: string;
  valorPorDefecto: string;

  incluirEnCatalogo: boolean;
  incluirEvolucion: boolean;
  noImprimible: boolean;
  noActiva: boolean;
  noPedibleIndividual: boolean;
  imprimirCodigoQr: boolean;

  contenedorId: string | null;
  tiempoRespuesta: string;
  /** Vincula la técnica a un sexo/especie concreto (Mantenimiento de Sexo / especie). */
  sexoEspecieId: string | null;
  /** Campo libre con los requisitos necesarios para realizar la prueba. */
  requerimientos: string;

  /** Código de texto alternativo al código numérico para solicitar la técnica en la petición. */
  codigoAuxiliar: string;
  /** Precio de coste para la realización de la prueba. */
  costo: number | null;

  /**
   * Técnicas que forman parte de esta Agrupación de pruebas (solo relevante si
   * tipoResultadoId es "agrupacion-pruebas"). Al añadir esta técnica a una petición, se
   * añaden automáticamente también todas estas.
   */
  tecnicasAgrupadasIds: string[];

  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyTecnica(): Tecnica {
  return {
    id: '',
    codigo: '',
    nombre: '',
    grupoId: null,
    subgrupoId: null,
    tipoResultadoId: null,
    numDecimales: null,
    numLineas: null,
    unidad1: '',
    unidad2: '',
    factorConversion: null,
    referencia1: null,
    referencia2: null,
    alarma1: null,
    alarma2: null,
    panico1: null,
    panico2: null,
    deltaCheckPorcentaje: null,
    deltaCheckDias: null,
    ordenImpresion: null,
    laboratorioExternoId: null,
    nombreInforme: '',
    cabeceraEdicion: '',
    comentarioEdicion: '',
    valorPorDefecto: '',
    incluirEnCatalogo: false,
    incluirEvolucion: false,
    noImprimible: false,
    noActiva: false,
    noPedibleIndividual: false,
    imprimirCodigoQr: false,
    contenedorId: null,
    tiempoRespuesta: '',
    sexoEspecieId: null,
    requerimientos: '',
    codigoAuxiliar: '',
    costo: null,
    tecnicasAgrupadasIds: [],
  };
}
