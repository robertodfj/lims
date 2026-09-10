export interface TipoPeticion {
  readonly id: string;
  codigo: string;
  nombre: string;
  /** Color hexadecimal (#rrggbb) elegido con el selector de color. */
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyTipoPeticion(): TipoPeticion {
  return {
    id: '',
    codigo: '',
    nombre: '',
    color: '#3b57d9',
  };
}
