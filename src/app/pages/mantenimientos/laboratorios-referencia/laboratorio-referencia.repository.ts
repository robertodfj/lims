import { LaboratorioReferencia } from './laboratorio-referencia.model';

/**
 * Contrato de persistencia de laboratorios de referencia. Hoy respaldado por localStorage
 * (sembrado desde /mock/laboratorios-referencia.json); el día que exista la API real basta
 * con proveer otra implementación en app.config.ts sin tocar la página.
 */
export interface LaboratorioReferenciaRepository {
  list(): Promise<LaboratorioReferencia[]>;
  get(id: string): Promise<LaboratorioReferencia | null>;
  save(laboratorio: LaboratorioReferencia): Promise<LaboratorioReferencia>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico entre los laboratorios, +1. */
  nextCodigo(): Promise<string>;
}
