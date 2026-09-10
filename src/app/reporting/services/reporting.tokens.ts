import { InjectionToken } from '@angular/core';
import { LocalStorageReportRepository } from './local-storage-report-repository';
import { ReportRepository } from './report-repository';

/** Para pasar a la API basta con proveer otra implementación en app.config.ts. */
export const REPORT_REPOSITORY = new InjectionToken<ReportRepository>('REPORT_REPOSITORY', {
  providedIn: 'root',
  factory: () => new LocalStorageReportRepository(),
});
