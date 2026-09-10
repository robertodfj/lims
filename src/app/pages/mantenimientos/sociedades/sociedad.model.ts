export interface Sociedad {
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
  faxContacto: string;
  indicadorCompania: string;
  nifCif: string;
  valorPunto: number | null;
  tarifaAplicadaId: string | null;
  estadoFacturacionId: string | null;
  formaPagoId: string | null;
  cuentaBancaria: string;
  destinoId: string | null;
  observaciones: string;
  avisoEnPeticiones: boolean;
  noActiva: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptySociedad(): Sociedad {
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
    faxContacto: '',
    indicadorCompania: '',
    nifCif: '',
    valorPunto: null,
    tarifaAplicadaId: null,
    estadoFacturacionId: null,
    formaPagoId: null,
    cuentaBancaria: '',
    destinoId: null,
    observaciones: '',
    avisoEnPeticiones: false,
    noActiva: false,
  };
}
