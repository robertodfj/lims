import { Peticion } from './peticion.model';

/**
 * Contrato de persistencia de peticiones. Hoy respaldado por localStorage (sembrado
 * desde /mock/peticiones.json); el día que exista la API real basta con proveer otra
 * implementación en app.config.ts sin tocar la página.
 */
export interface PeticionRepository {
  list(): Promise<Peticion[]>;
  get(id: string): Promise<Peticion | null>;
  save(peticion: Peticion): Promise<Peticion>;
  delete(id: string): Promise<void>;
  /** Siguiente nº de registro sugerido: el mayor nº de registro existente, +1. */
  nextNumRegistro(): Promise<number>;
}
