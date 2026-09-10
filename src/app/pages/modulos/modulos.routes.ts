import { Routes } from '@angular/router';

export const MODULOS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'presupuestos' },
  {
    path: 'presupuestos',
    title: 'Presupuestos',
    loadComponent: () => import('./presupuestos/presupuestos-page').then((m) => m.PresupuestosPage),
  },
  {
    path: 'citaciones',
    title: 'Citaciones',
    loadComponent: () => import('./citaciones/citaciones-page').then((m) => m.CitacionesPage),
  },
  {
    path: 'urgencias',
    title: 'Urgencias',
    loadComponent: () => import('./urgencias/urgencias-page').then((m) => m.UrgenciasPage),
  },
  {
    path: 'distribucion-muestras',
    title: 'Distribución de muestras',
    loadComponent: () => import('./distribucion-muestras/distribucion-muestras-page').then((m) => m.DistribucionMuestrasPage),
  },
  {
    path: 'seroteca',
    title: 'Seroteca',
    loadComponent: () => import('./seroteca/seroteca-page').then((m) => m.SerotecaPage),
  },
  {
    path: 'laboratorio-referencia',
    title: 'Laboratorio de referencia',
    loadComponent: () => import('./laboratorio-referencia/laboratorio-referencia-page').then((m) => m.LaboratorioReferenciaPage),
  },
  {
    path: 'reglas-inteligentes',
    title: 'Reglas inteligentes',
    loadComponent: () => import('./reglas-inteligentes/reglas-inteligentes-page').then((m) => m.ReglasInteligentesPage),
  },
];
