export interface Subgrupo {
  readonly id: string;
  codigo: string;
  nombre: string;
  /** Orden de aparición en el informe: de menor a mayor. */
  orden: number | null;
  comentarioEdicion: string;
  /** Si está activo, el informe salta de página al llegar a este subgrupo. */
  saltoPagina: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptySubgrupo(): Subgrupo {
  return {
    id: '',
    codigo: '',
    nombre: '',
    orden: null,
    comentarioEdicion: '',
    saltoPagina: false,
  };
}
