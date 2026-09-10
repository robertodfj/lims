export const ESPECIALIDADES_PETICIONARIO = [
  'Medicina General',
  'Pediatría',
  'Cardiología',
  'Dermatología',
  'Traumatología',
  'Ginecología',
] as const;

export interface Peticionario {
  readonly id: string;
  codigo: string;
  nombre: string;
  colegiado: string;
  especialidad: string;
  telefono: string;
  email: string;
  estado: 'activo' | 'inactivo';
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyPeticionario(): Peticionario {
  return {
    id: '',
    codigo: '',
    nombre: '',
    colegiado: '',
    especialidad: ESPECIALIDADES_PETICIONARIO[0],
    telefono: '',
    email: '',
    estado: 'activo',
  };
}
