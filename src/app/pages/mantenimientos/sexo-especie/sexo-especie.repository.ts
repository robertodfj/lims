import { SexoEspecie } from './sexo-especie.model';

/**
 * Contrato de persistencia de sexo/especie. Hoy respaldado por localStorage (sembrado
 * desde /mock/sexo-especie.json); el día que exista la API real basta con proveer otra
 * implementación en app.config.ts sin tocar la página. También lo consume Base de
 * pacientes para su campo "Sexo / Especie".
 */
export interface SexoEspecieRepository {
  list(): Promise<SexoEspecie[]>;
  get(id: string): Promise<SexoEspecie | null>;
  save(sexoEspecie: SexoEspecie): Promise<SexoEspecie>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico entre los registros, +1. */
  nextCodigo(): Promise<string>;
}
