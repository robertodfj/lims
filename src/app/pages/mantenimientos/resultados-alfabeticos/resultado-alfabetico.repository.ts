import { ResultadoAlfabetico } from './resultado-alfabetico.model';

/**
 * Contrato de persistencia de resultados alfabéticos. Hoy respaldado por localStorage
 * (sembrado desde /mock/resultados-alfabeticos.json); el día que exista la API real basta
 * con proveer otra implementación en app.config.ts sin tocar la página.
 */
export interface ResultadoAlfabeticoRepository {
  list(): Promise<ResultadoAlfabetico[]>;
  get(id: string): Promise<ResultadoAlfabetico | null>;
  save(resultado: ResultadoAlfabetico): Promise<ResultadoAlfabetico>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico entre los resultados, +1. */
  nextCodigo(): Promise<string>;
}
