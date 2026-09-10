export interface Comentario {
  readonly id: string;
  codigo: string;
  nombre: string;
  /** Contenido con formato (negrita, cursiva, alineación, color), como HTML. */
  comentario: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyComentario(): Comentario {
  return {
    id: '',
    codigo: '',
    nombre: '',
    comentario: '',
  };
}
