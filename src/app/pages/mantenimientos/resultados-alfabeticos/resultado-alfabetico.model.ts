/**
 * Valores seleccionables para técnicas cuyo tipo de resultado es "alfabético": en la
 * introducción de resultados aparece un desplegable con estos valores en vez de un campo
 * numérico libre.
 */
export interface ResultadoAlfabetico {
  readonly id: string;
  codigo: string;
  texto: string;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyResultadoAlfabetico(): ResultadoAlfabetico {
  return {
    id: '',
    codigo: '',
    texto: '',
  };
}
