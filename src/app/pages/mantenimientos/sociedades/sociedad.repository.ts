import { Sociedad } from './sociedad.model';

/**
 * Contrato de persistencia de sociedades. Hoy respaldado por localStorage (sembrado
 * desde /mock/sociedades.json); el día que exista la API real basta con proveer otra
 * implementación en app.config.ts sin tocar la página.
 */
export interface SociedadRepository {
  list(): Promise<Sociedad[]>;
  get(id: string): Promise<Sociedad | null>;
  save(sociedad: Sociedad): Promise<Sociedad>;
  delete(id: string): Promise<void>;
}
