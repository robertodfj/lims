export interface ReportPage {
  readonly id: string;
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
