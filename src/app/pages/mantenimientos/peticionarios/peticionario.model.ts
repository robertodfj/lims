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
  especialidad: string;
  /** Campo libre para anotaciones sobre el profesional. */
  observaciones: string;
  telefono: string;
  movil: string;
  fax: string;
  /** Código del colegio oficial donde está colegiado. */
  colegiado: string;
  domicilio: string;
  poblacion: string;
  provinciaId: string | null;
  cp: string;
  /**
   * Texto que aparece como aviso (icono de exclamación) al seleccionar este peticionario en
   * una petición. Con carácter retroactivo: aparece en todas las peticiones donde se use.
   */
  avisoEnPeticiones: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyPeticionario(): Peticionario {
  return {
    id: '',
    codigo: '',
    nombre: '',
    especialidad: ESPECIALIDADES_PETICIONARIO[0],
    observaciones: '',
    telefono: '',
    movil: '',
    fax: '',
    colegiado: '',
    domicilio: '',
    poblacion: '',
    provinciaId: null,
    cp: '',
    avisoEnPeticiones: '',
  };
}
