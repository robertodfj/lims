import { Routes } from '@angular/router';

export const PROCESOS_AUXILIARES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
  {
    path: 'usuarios',
    title: 'Usuarios',
    loadComponent: () => import('./usuarios/usuarios-page').then((m) => m.UsuariosPage),
  },
  {
    path: 'laboratorios',
    title: 'Laboratorios',
    loadComponent: () => import('./laboratorios/laboratorios-page').then((m) => m.LaboratoriosPage),
  },
];
