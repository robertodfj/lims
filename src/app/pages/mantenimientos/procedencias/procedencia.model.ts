export interface Procedencia {
  readonly id: string;
  codigo: string;
  nombre: string;
  domicilio: string;
  poblacion: string;
  provinciaId: string | null;
  cp: string;
  personaContacto: string;
  telefono: string;
  movil: string;
  email: string;
  fax: string;
  nif: string;
  cabeceraId: string | null;
  formaPagoId: string | null;
  cuentaBancaria: string;
  destinoId: string | null;
  observaciones: string;
  /** Texto que aparece como aviso (icono de exclamación) al elegir esta procedencia en una petición. */
  avisoEnPeticiones: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyProcedencia(): Procedencia {
  return {
    id: '',
    codigo: '',
    nombre: '',
    domicilio: '',
    poblacion: '',
    provinciaId: null,
    cp: '',
    personaContacto: '',
    telefono: '',
    movil: '',
    email: '',
    fax: '',
    nif: '',
    cabeceraId: null,
    formaPagoId: null,
    cuentaBancaria: '',
    destinoId: null,
    observaciones: '',
    avisoEnPeticiones: '',
  };
}
