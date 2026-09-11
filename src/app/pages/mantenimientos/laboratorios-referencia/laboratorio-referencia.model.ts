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
  /**
   * Color para identificar visualmente este laboratorio en su propio listado y en el código
   * de la técnica en la ventana de Resultados. `null` = sin color asignado.
   */
  colorAsociado: string | null;
  /**
   * Aplicación con la que, mediante un desarrollo adicional, se interconecta este laboratorio
   * (p. ej. para el envío automático de resultados). Puramente informativo: no existe hoy
   * ninguna integración real que lea este campo.
   */
  programaAsociado: string;
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
    colorAsociado: null,
    programaAsociado: '',
  };
}
