import { Destino } from './destino.model';

/**
 * Contrato de persistencia de destinos. Hoy respaldado por localStorage (sembrado
 * desde /mock/destinos.json); el día que exista la API real basta con proveer otra
 * implementación en app.config.ts sin tocar la página. También lo consumen
 * Procedencias y Sociedades para su campo "Destino".
 */
export interface DestinoRepository {
  list(): Promise<Destino[]>;
  get(id: string): Promise<Destino | null>;
  save(destino: Destino): Promise<Destino>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico entre los destinos activos, +1. */
  nextCodigo(): Promise<string>;
}
