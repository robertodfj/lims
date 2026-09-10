import { Routes } from '@angular/router';

export const PROCESO_DIARIO_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'peticiones-resultados' },
  {
    path: 'peticiones-resultados',
    title: 'Peticiones y resultados',
    loadComponent: () => import('./peticiones-resultados/peticiones-resultados-page').then((m) => m.PeticionesResultadosPage),
  },
  {
    path: 'hojas-trabajo',
    title: 'Hojas de trabajo',
    loadComponent: () => import('./hojas-trabajo/hojas-trabajo-page').then((m) => m.HojasTrabajoPage),
  },
  {
    path: 'informes',
    title: 'Informes',
    loadComponent: () => import('./informes/informes-page').then((m) => m.InformesPage),
  },
  {
    path: 'comunicaciones',
    title: 'Comunicaciones',
    loadComponent: () => import('./comunicaciones/comunicaciones-page').then((m) => m.ComunicacionesPage),
  },
  {
    path: 'validacion-resultados',
    title: 'Validación de resultados',
    loadComponent: () => import('./validacion-resultados/validacion-resultados-page').then((m) => m.ValidacionResultadosPage),
  },
];
