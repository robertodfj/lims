import { Routes } from '@angular/router';
import { AppLayout } from './layout/app-layout/app-layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard-page').then((m) => m.DashboardPage),
      },
      {
        path: 'proceso-diario',
        loadChildren: () =>
          import('./pages/proceso-diario/proceso-diario.routes').then((m) => m.PROCESO_DIARIO_ROUTES),
      },
      {
        path: 'modulos',
        loadChildren: () => import('./pages/modulos/modulos.routes').then((m) => m.MODULOS_ROUTES),
      },
      {
        path: 'mantenimientos',
        loadChildren: () =>
          import('./pages/mantenimientos/mantenimientos.routes').then((m) => m.MANTENIMIENTOS_ROUTES),
      },
      {
        path: 'procesos-auxiliares',
        loadChildren: () =>
          import('./pages/procesos-auxiliares/procesos-auxiliares.routes').then(
            (m) => m.PROCESOS_AUXILIARES_ROUTES,
          ),
      },
      {
        path: 'reporting',
        loadChildren: () => import('./reporting/reporting.routes').then((m) => m.REPORTING_ROUTES),
      },
      {
        path: '**',
        title: 'Página no encontrada',
        loadComponent: () => import('./pages/not-found/not-found-page').then((m) => m.NotFoundPage),
      },
    ],
  },
];
