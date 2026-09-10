export interface Tecnica {
  readonly id: string;
  codigo: string;
  nombre: string;

  grupoId: string | null;
  subgrupoId: string | null;
  tipoResultadoId: string | null;
  numDecimales: number | null;
  acreditado: boolean;
  ordenImpresion: number | null;
  laboratorioExternoId: string | null;
  nombreInforme: string;
  valorPorDefecto: string;
  incluirEnCatalogo: boolean;
  noImprimible: boolean;
  noActiva: boolean;
  noPedibleIndividual: boolean;
  contenedorId: string | null;
  tiempoRespuesta: string;
  especieId: string | null;

  // Requerimientos (técnicas moleculares)
  codigoAuxiliar: string;
  nombrePrimer: string;
  idControlPositivo: string;
  stockPrimers: string;
  programaTermociclador: string;
  dnm: string;
  metodo: string;
  tamanoAmplicon: string;
  codigoGenero: string;
  tipoMuestraAnalisis: string;
  tecnicasAuxiliares: string;

  cifrasSignificativas: number | null;
  cabeceraEdicion: string;
  comentarioEdicion: string;

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
    acreditado: false,
    ordenImpresion: null,
    laboratorioExternoId: null,
    nombreInforme: '',
    valorPorDefecto: '',
    incluirEnCatalogo: false,
    noImprimible: false,
    noActiva: false,
    noPedibleIndividual: false,
    contenedorId: null,
    tiempoRespuesta: '',
    especieId: null,
    codigoAuxiliar: '',
    nombrePrimer: '',
    idControlPositivo: '',
    stockPrimers: '',
    programaTermociclador: '',
    dnm: '',
    metodo: '',
    tamanoAmplicon: '',
    codigoGenero: '',
    tipoMuestraAnalisis: '',
    tecnicasAuxiliares: '',
    cifrasSignificativas: null,
    cabeceraEdicion: '',
    comentarioEdicion: '',
  };
}
