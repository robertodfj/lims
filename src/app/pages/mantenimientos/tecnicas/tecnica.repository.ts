import { Tecnica } from './tecnica.model';

/**
 * Contrato de persistencia de técnicas. Hoy respaldado por localStorage (sembrado
 * desde /mock/tecnicas.json); el día que exista la API real basta con proveer otra
 * implementación en app.config.ts sin tocar la página.
 */
export interface TecnicaRepository {
  list(): Promise<Tecnica[]>;
  get(id: string): Promise<Tecnica | null>;
  save(tecnica: Tecnica): Promise<Tecnica>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico entre las técnicas activas, +1. */
  nextCodigo(): Promise<string>;
}
