import { Procedencia } from './procedencia.model';

/**
 * Contrato de persistencia de procedencias. Hoy respaldado por localStorage (sembrado
 * desde /mock/procedencias.json); el día que exista la API real basta con proveer otra
 * implementación en app.config.ts sin tocar la página.
 */
export interface ProcedenciaRepository {
  list(): Promise<Procedencia[]>;
  get(id: string): Promise<Procedencia | null>;
  save(procedencia: Procedencia): Promise<Procedencia>;
  delete(id: string): Promise<void>;
}
