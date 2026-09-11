export const TIPOS_DESTINO = [
  { id: 'informes-resultados', nombre: 'Informes de resultados' },
  { id: 'facturas', nombre: 'Facturas' },
  { id: 'impresion-general', nombre: 'Impresión general' },
  { id: 'pedidos-almacen', nombre: 'Pedidos de almacén' },
  { id: 'presupuestos', nombre: 'Presupuestos' },
] as const;

export interface Destino {
  readonly id: string;
  codigo: string;
  descripcion: string;
  orden: number | null;
  /** Categoría del destino y desde dónde puede usarse (ver TIPOS_DESTINO). */
  tipoDestinoId: string | null;
  /** Otro destino al que este va asociado, para que también reciba la misma información. */
  destinoAsociadoId: string | null;
  observaciones: string;
  /** Texto que aparece como aviso (icono de exclamación) al elegir este destino en una petición. */
  avisoEnPeticiones: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyDestino(): Destino {
  return {
    id: '',
    codigo: '',
    descripcion: '',
    orden: null,
    tipoDestinoId: null,
    destinoAsociadoId: null,
    observaciones: '',
    avisoEnPeticiones: '',
  };
}
