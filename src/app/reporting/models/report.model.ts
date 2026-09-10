/**
 * Datos propios de cada tipo de elemento.
 * Los elementos no guardan datos de paciente/muestra: solo su configuración.
 * Los datos reales llegan aparte a través de ReportDataContext.
 */
export interface ReportElementDataMap {
  header: { title: string };
  patient: { title: string };
  sample: { title: string };
  results: { title: string };
  comments: { title: string };
  signature: { title: string };
  footer: { text: string };
  text: { content: string };
}

export type ReportElementType = keyof ReportElementDataMap;

/** Unión discriminada por `type`: al comprobar el tipo, TypeScript conoce la forma de `data`. */
export type ReportElement = {
  [K in ReportElementType]: {
    readonly id: string;
    readonly type: K;
    data: ReportElementDataMap[K];
  };
}[ReportElementType];

export interface ReportPage {
  readonly id: string;
  elements: ReportElement[];
}

export interface ReportDocument {
  /** null hasta que el informe se guarda por primera vez (futuro POST /api/reporting). */
  id: string | null;
  name: string;
  pages: ReportPage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedReportDocument extends ReportDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportSummary {
  readonly id: string;
  readonly name: string;
  readonly pageCount: number;
  readonly updatedAt: string;
}
