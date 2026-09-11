export interface Sociedad {
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
  faxContacto: string;
  /** Código interno que la sociedad/compañía asigna al laboratorio; necesario para la facturación en fichero. */
  indicadorCompania: string;
  nifCif: string;
  /**
   * Valor de cada "punto" para compañías que facturan por puntos. 0 = se factura en la
   * moneda habitual; distinto de 0 = se factura por puntos.
   */
  valorPunto: number | null;
  /** Para cuando el cliente usa los precios establecidos para otra compañía. */
  tarifaAplicadaId: string | null;
  /** Estado de facturación por defecto de las peticiones de este cliente: Facturar/Prefacturar/Omitir. */
  estadoFacturacionId: string | null;
  formaPagoId: string | null;
  cuentaBancaria: string;
  destinoId: string | null;
  observaciones: string;
  /** Texto que aparece como aviso (icono de exclamación) al elegir esta sociedad en una petición. */
  avisoEnPeticiones: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptySociedad(): Sociedad {
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
    avisoEnPeticiones: '',
  };
}
