import { Paciente } from './paciente.model';

/**
 * Contrato de persistencia de la base de pacientes (historia clínica). Hoy respaldado
 * por localStorage (sembrado desde /mock/base-pacientes.json); el día que exista la API
 * real basta con proveer otra implementación en app.config.ts sin tocar la página.
 */
export interface PacienteRepository {
  list(): Promise<Paciente[]>;
  get(id: string): Promise<Paciente | null>;
  save(paciente: Paciente): Promise<Paciente>;
  delete(id: string): Promise<void>;
  /** Siguiente nº de historia clínica sugerido: el mayor número entre los pacientes, +1. */
  nextHistoriaClinica(): Promise<string>;
}
