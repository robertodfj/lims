import { InjectionToken } from '@angular/core';
import { REPORT_MOCK_DATA } from '../data/report-mock-data';
import { ReportDataContext } from '../models/report-data-context.model';
import { LocalStorageReportRepository } from './local-storage-report-repository';
import { ReportRepository } from './report-repository';

/** Para pasar a la API basta con proveer otra implementación en app.config.ts. */
export const REPORT_REPOSITORY = new InjectionToken<ReportRepository>('REPORT_REPOSITORY', {
  providedIn: 'root',
  factory: () => new LocalStorageReportRepository(),
});

/** Datos usados para renderizar el editor y la vista previa. */
export const REPORT_PREVIEW_DATA = new InjectionToken<ReportDataContext>('REPORT_PREVIEW_DATA', {
  providedIn: 'root',
  factory: () => REPORT_MOCK_DATA,
});
