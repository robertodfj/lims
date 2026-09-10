import { Subgrupo } from './subgrupo.model';

/**
 * Contrato de persistencia de subgrupos de técnicas. Hoy respaldado por localStorage
 * (sembrado desde /mock/subgrupos.json); el día que exista la API real basta con proveer
 * otra implementación en app.config.ts sin tocar la página. También lo consume Técnicas
 * para su campo "Subgrupo".
 */
export interface SubgrupoRepository {
  list(): Promise<Subgrupo[]>;
  get(id: string): Promise<Subgrupo | null>;
  save(subgrupo: Subgrupo): Promise<Subgrupo>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico entre los subgrupos, +1. */
  nextCodigo(): Promise<string>;
}
