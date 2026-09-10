export interface Procedencia {
  readonly id: string;
  nombre: string;
  domicilio: string;
  poblacion: string;
  paisId: string | null;
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
  avisoEnPeticiones: boolean;
  noActiva: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyProcedencia(): Procedencia {
  return {
    id: '',
    nombre: '',
    domicilio: '',
    poblacion: '',
    paisId: null,
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
    avisoEnPeticiones: false,
    noActiva: false,
  };
}
