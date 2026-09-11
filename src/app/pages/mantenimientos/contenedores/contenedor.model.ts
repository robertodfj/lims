/** Un destino preanalítico asociado al contenedor, con su prioridad de uso (menor = primero). */
export interface ContenedorDestinoPreanalitico {
  destinoId: string;
  prioridad: number | null;
}

export interface Contenedor {
  readonly id: string;
  nombre: string;
  tipoMuestraId: string | null;
  volumen: string;
  /** Color hexadecimal (#rrggbb) elegido con el selector de color. */
  color: string;
  permanenciaSerotecaDias: number | null;
  /**
   * Destinos preanalíticos que puede usar este contenedor (Mantenimiento / Destino de
   * informes). Vacío = puede usar cualquiera; en cuanto se asocia alguno, el contenedor solo
   * admite los de esta lista.
   */
  destinosPreanaliticos: ContenedorDestinoPreanalitico[];
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyContenedor(): Contenedor {
  return {
    id: '',
    nombre: '',
    tipoMuestraId: null,
    volumen: '',
    color: '#3b57d9',
    permanenciaSerotecaDias: null,
    destinosPreanaliticos: [],
  };
}
