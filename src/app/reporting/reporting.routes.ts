import { Routes } from '@angular/router';

export const REPORTING_ROUTES: Routes = [
  {
    path: '',
    title: 'Reporting',
    loadComponent: () => import('./pages/report-list/report-list-page').then((m) => m.ReportListPage),
  },
];
