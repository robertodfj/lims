import { Soporte } from './soporte.model';

/**
 * Contrato de persistencia de soportes. Hoy respaldado por localStorage (sembrado
 * desde /mock/soportes.json); el día que exista la API real basta con proveer otra
 * implementación en app.config.ts sin tocar la página.
 */
export interface SoporteRepository {
  list(): Promise<Soporte[]>;
  get(id: string): Promise<Soporte | null>;
  save(soporte: Soporte): Promise<Soporte>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico existente, +1. */
  nextCodigo(): Promise<string>;
}
