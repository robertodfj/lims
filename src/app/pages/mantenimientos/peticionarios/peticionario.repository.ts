import { Peticionario } from './peticionario.model';

/**
 * Contrato de persistencia de peticionarios. Hoy respaldado por localStorage (sembrado
 * desde /mock/peticionarios.json); el día que exista la API real basta con proveer otra
 * implementación en app.config.ts sin tocar la página. También lo consume Peticiones y
 * resultados para su campo "Peticionario".
 */
export interface PeticionarioRepository {
  list(): Promise<Peticionario[]>;
  get(id: string): Promise<Peticionario | null>;
  save(peticionario: Peticionario): Promise<Peticionario>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico entre los peticionarios activos, +1. */
  nextCodigo(): Promise<string>;
}
