import { Grupo } from './grupo.model';

/**
 * Contrato de persistencia de grupos de técnicas. Hoy respaldado por localStorage
 * (sembrado desde /mock/grupos.json); el día que exista la API real basta con proveer
 * otra implementación en app.config.ts sin tocar la página. También lo consume Técnicas
 * para su campo "Grupo".
 */
export interface GrupoRepository {
  list(): Promise<Grupo[]>;
  get(id: string): Promise<Grupo | null>;
  save(grupo: Grupo): Promise<Grupo>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico entre los grupos, +1. */
  nextCodigo(): Promise<string>;
}
