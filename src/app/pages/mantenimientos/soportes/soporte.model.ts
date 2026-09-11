export type SoporteOrientacion = 'vertical' | 'horizontal';

export interface Soporte {
  readonly id: string;
  codigo: string;
  descripcion: string;
  numFilas: number | null;
  numColumnas: number | null;
  orientacion: SoporteOrientacion;
  /** Color hexadecimal (#rrggbb) elegido con el selector de color, para distinguirlos en la vista previa. */
  color: string;
  /**
   * Contenedores que admite este soporte. Vacío = se admiten todos (comportamiento por
   * defecto); en cuanto se asocia alguno, el soporte solo admite los de esta lista.
   */
  contenedoresAsociadosIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptySoporte(): Soporte {
  return {
    id: '',
    codigo: '',
    descripcion: '',
    numFilas: null,
    numColumnas: null,
    orientacion: 'vertical',
    color: '#3b57d9',
    contenedoresAsociadosIds: [],
  };
}
