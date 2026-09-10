import { Contenedor } from './contenedor.model';

/**
 * Contrato de persistencia de contenedores. Hoy respaldado por localStorage (sembrado
 * desde /mock/contenedores.json); el día que exista la API real basta con proveer otra
 * implementación en app.config.ts sin tocar la página. También lo consume Técnicas
 * para su campo "Contenedor".
 */
export interface ContenedorRepository {
  list(): Promise<Contenedor[]>;
  get(id: string): Promise<Contenedor | null>;
  save(contenedor: Contenedor): Promise<Contenedor>;
  delete(id: string): Promise<void>;
}
