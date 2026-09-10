export interface ReportDocument {
  /** null hasta que el informe se guarda por primera vez (futuro POST /api/reporting). */
  id: string | null;
  name: string;
  /** Código fuente del informe: un único archivo .vue (script + plantilla + estilos). */
  code: string;
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
  readonly updatedAt: string;
}
