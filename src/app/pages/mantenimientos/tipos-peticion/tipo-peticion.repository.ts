import { TipoPeticion } from './tipo-peticion.model';

/**
 * Contrato de persistencia de tipos de petición. Hoy respaldado por localStorage
 * (sembrado desde /mock/tipos-peticion.json); el día que exista la API real basta con
 * proveer otra implementación en app.config.ts sin tocar la página.
 */
export interface TipoPeticionRepository {
  list(): Promise<TipoPeticion[]>;
  get(id: string): Promise<TipoPeticion | null>;
  save(tipo: TipoPeticion): Promise<TipoPeticion>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico existente, +1. */
  nextCodigo(): Promise<string>;
}
