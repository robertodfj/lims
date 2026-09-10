import { Routes } from '@angular/router';
import { NEW_REPORT_ROUTE_ID } from './reporting-paths';

export const REPORTING_ROUTES: Routes = [
  {
    path: '',
    title: 'Reporting',
    loadComponent: () => import('./pages/reporting-home/reporting-home-page').then((m) => m.ReportingHomePage),
  },
  {
    path: 'informes',
    title: 'Informes existentes',
    loadComponent: () => import('./pages/report-list/report-list-page').then((m) => m.ReportListPage),
  },
  { path: 'editor', pathMatch: 'full', redirectTo: `editor/${NEW_REPORT_ROUTE_ID}` },
  {
    // Una sola ruta para "nuevo" y "existente": al guardar un informe nuevo la URL cambia
    // a su id sin volver a montar el editor.
    path: 'editor/:id',
    title: 'Editor de informes',
    loadComponent: () =>
      import('./pages/report-editor-host/report-editor-host').then((m) => m.ReportEditorHost),
  },
];
