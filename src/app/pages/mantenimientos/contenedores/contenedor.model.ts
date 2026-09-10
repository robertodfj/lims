export interface Contenedor {
  readonly id: string;
  nombre: string;
  tipoMuestraId: string | null;
  volumen: string;
  /** Color hexadecimal (#rrggbb) elegido con el selector de color. */
  color: string;
  permanenciaSerotecaDias: number | null;
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
  };
}
