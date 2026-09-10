import { Comentario } from './comentario.model';

/**
 * Contrato de persistencia de comentarios. Hoy respaldado por localStorage (sembrado
 * desde /mock/comentarios.json); el día que exista la API real basta con proveer otra
 * implementación en app.config.ts sin tocar la página.
 */
export interface ComentarioRepository {
  list(): Promise<Comentario[]>;
  get(id: string): Promise<Comentario | null>;
  save(comentario: Comentario): Promise<Comentario>;
  delete(id: string): Promise<void>;
  /** Siguiente código sugerido: el mayor código numérico entre los comentarios, +1. */
  nextCodigo(): Promise<string>;
}
