import { createId } from '../../core/utils/create-id';
import { ReportDocument, ReportPage } from './report.model';

export function createReportPage(): ReportPage {
  return { id: createId('pg') };
}

export function createNewReport(): ReportDocument {
  return {
    id: null,
    name: 'Informe sin título',
    pages: [createReportPage()],
  };
}
