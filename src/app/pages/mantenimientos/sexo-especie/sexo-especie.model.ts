/**
 * Combinaciones de sexo/especie seleccionables desde la Historia clínica del paciente
 * (p. ej. "Macho — Canino", "Hembra — Felino", o simplemente "Mujer"/"Hombre" en humana).
 */
export interface SexoEspecie {
  readonly id: string;
  codigo: string;
  sexoEspecie: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptySexoEspecie(): SexoEspecie {
  return {
    id: '',
    codigo: '',
    sexoEspecie: '',
  };
}
