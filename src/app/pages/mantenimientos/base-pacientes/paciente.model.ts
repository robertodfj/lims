export interface Paciente {
  readonly id: string;
  /** Nº de historia clínica: identifica al paciente en este sistema, como un código. */
  historiaClinica: string;
  apellidos: string;
  nombre: string;
  /** Fecha en formato ISO (yyyy-MM-dd), tal y como la entrega <input type="date">. */
  fechaNacimiento: string | null;
  sexoEspecieId: string | null;
  dni: string;
  domicilio: string;
  poblacion: string;
  provinciaId: string | null;
  cp: string;
  telefono: string;
  telefono2: string;
  movil: string;
  email: string;
  fax: string;
  sociedadId: string | null;
  historiaClinicaHost: string;
  auxiliar5: string;
  auxiliar6: string;
  auxiliar7: string;
  auxiliar8: string;
  auxiliar9: string;
  auxiliar10: string;
  observaciones: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyPaciente(): Paciente {
  return {
    id: '',
    historiaClinica: '',
    apellidos: '',
    nombre: '',
    fechaNacimiento: null,
    sexoEspecieId: null,
    dni: '',
    domicilio: '',
    poblacion: '',
    provinciaId: null,
    cp: '',
    telefono: '',
    telefono2: '',
    movil: '',
    email: '',
    fax: '',
    sociedadId: null,
    historiaClinicaHost: '',
    auxiliar5: '',
    auxiliar6: '',
    auxiliar7: '',
    auxiliar8: '',
    auxiliar9: '',
    auxiliar10: '',
    observaciones: '',
  };
}
