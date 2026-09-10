export interface Destino {
  readonly id: string;
  codigo: string;
  descripcion: string;
  orden: number | null;
  /** Otro destino al que este va asociado (p. ej. para agrupar envíos). */
  destinoAsociadoId: string | null;
  observaciones: string;
  avisoEnPeticiones: boolean;
  noActivo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyDestino(): Destino {
  return {
    id: '',
    codigo: '',
    descripcion: '',
    orden: null,
    destinoAsociadoId: null,
    observaciones: '',
    avisoEnPeticiones: false,
    noActivo: false,
  };
}
