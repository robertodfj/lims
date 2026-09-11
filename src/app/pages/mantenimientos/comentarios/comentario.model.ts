export interface Comentario {
  readonly id: string;
  codigo: string;
  nombre: string;
  /** Contenido con formato (negrita, cursiva, alineación, color), como HTML. */
  comentario: string;
  /** Técnicas a las que se puede vincular este comentario (Avanzado). */
  tecnicasVinculadasIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyComentario(): Comentario {
  return {
    id: '',
    codigo: '',
    nombre: '',
    comentario: '',
    tecnicasVinculadasIds: [],
  };
}
