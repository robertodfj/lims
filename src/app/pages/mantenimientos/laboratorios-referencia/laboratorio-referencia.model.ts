export interface LaboratorioReferencia {
  readonly id: string;
  codigo: string;
  nombre: string;
  domicilio: string;
  poblacion: string;
  provinciaId: string | null;
  cp: string;
  /** Código que el propio laboratorio externo asigna al laboratorio como cliente suyo. */
  numCliente: string;
  personaContacto: string;
  telefono: string;
  fax: string;
  observaciones: string;
  /** Técnicas que este laboratorio externo realiza, para poder derivarlas desde el sistema. */
  tecnicasAsociadasIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyLaboratorioReferencia(): LaboratorioReferencia {
  return {
    id: '',
    codigo: '',
    nombre: '',
    domicilio: '',
    poblacion: '',
    provinciaId: null,
    cp: '',
    numCliente: '',
    personaContacto: '',
    telefono: '',
    fax: '',
    observaciones: '',
    tecnicasAsociadasIds: [],
  };
}
