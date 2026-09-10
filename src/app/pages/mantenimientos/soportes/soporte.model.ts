export type SoporteOrientacion = 'vertical' | 'horizontal';

export interface Soporte {
  readonly id: string;
  codigo: string;
  numFilas: number | null;
  numColumnas: number | null;
  orientacion: SoporteOrientacion;
  /** Color hexadecimal (#rrggbb) elegido con el selector de color. */
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptySoporte(): Soporte {
  return {
    id: '',
    codigo: '',
    numFilas: null,
    numColumnas: null,
    orientacion: 'vertical',
    color: '#3b57d9',
  };
}
