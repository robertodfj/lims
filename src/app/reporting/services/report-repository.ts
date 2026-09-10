import { ReportDocument, ReportSummary, SavedReportDocument } from '../models/report.model';

/**
 * Contrato de persistencia de informes. Es asíncrono para que la implementación HTTP
 * pueda sustituir a la de localStorage sin tocar el editor:
 *   list()   -> GET    /api/reporting
 *   get(id)  -> GET    /api/reporting/{id}
 *   save(d)  -> POST   /api/reporting        (d.id === null)
 *               PUT    /api/reporting/{id}   (d.id !== null)
 *   delete() -> DELETE /api/reporting/{id}
 */
export interface ReportRepository {
  list(): Promise<ReportSummary[]>;
  get(id: string): Promise<SavedReportDocument | null>;
  save(document: ReportDocument): Promise<SavedReportDocument>;
  delete(id: string): Promise<void>;
}
