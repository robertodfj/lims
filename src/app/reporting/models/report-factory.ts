import { createId } from '../../core/utils/create-id';
import {
  ReportDocument,
  ReportElement,
  ReportElementDataMap,
  ReportElementType,
  ReportPage,
} from './report.model';

type ReportElementCatalog = {
  readonly [K in ReportElementType]: {
    readonly label: string;
    readonly createData: () => ReportElementDataMap[K];
  };
};

/** Catálogo único de tipos de elemento: etiqueta visible y datos por defecto. */
export const REPORT_ELEMENT_CATALOG: ReportElementCatalog = {
  header: { label: 'Cabecera', createData: () => ({ title: 'Informe de resultados' }) },
  patient: { label: 'Datos del paciente', createData: () => ({ title: 'Datos del paciente' }) },
  sample: { label: 'Datos de la muestra', createData: () => ({ title: 'Datos de la muestra' }) },
  results: { label: 'Resultados', createData: () => ({ title: 'Resultados' }) },
  comments: { label: 'Comentarios', createData: () => ({ title: 'Comentarios' }) },
  signature: { label: 'Firma / validación', createData: () => ({ title: 'Validación' }) },
  footer: {
    label: 'Pie de página',
    createData: () => ({ text: 'Los resultados de este informe solo afectan a las muestras analizadas.' }),
  },
  text: { label: 'Texto libre', createData: () => ({ content: 'Texto libre' }) },
};

export const REPORT_ELEMENT_TYPES = Object.keys(REPORT_ELEMENT_CATALOG) as ReportElementType[];

/** Estructura con la que nace la primera página de un informe nuevo. */
export const DEFAULT_FIRST_PAGE_LAYOUT: readonly ReportElementType[] = [
  'header',
  'patient',
  'sample',
  'results',
  'footer',
];

export function createReportElement(type: ReportElementType): ReportElement {
  // TypeScript no puede correlacionar `type` con `data` en una unión genérica; el catálogo lo garantiza.
  return { id: createId('el'), type, data: REPORT_ELEMENT_CATALOG[type].createData() } as ReportElement;
}

export function createReportPage(layout: readonly ReportElementType[] = []): ReportPage {
  return { id: createId('pg'), elements: layout.map(createReportElement) };
}

export function createNewReport(): ReportDocument {
  return {
    id: null,
    name: 'Informe sin título',
    pages: [createReportPage(DEFAULT_FIRST_PAGE_LAYOUT)],
  };
}
