import { Routes } from '@angular/router';

export const MANTENIMIENTOS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tecnicas' },
  {
    path: 'tecnicas',
    title: 'Técnicas',
    loadComponent: () => import('./tecnicas/tecnicas-page').then((m) => m.TecnicasPage),
  },
  {
    path: 'peticionarios',
    title: 'Peticionarios',
    loadComponent: () => import('./peticionarios/peticionarios-page').then((m) => m.PeticionariosPage),
  },
  {
    path: 'procedencias',
    title: 'Procedencias',
    loadComponent: () => import('./procedencias/procedencias-page').then((m) => m.ProcedenciasPage),
  },
  {
    path: 'sociedades',
    title: 'Sociedades',
    loadComponent: () => import('./sociedades/sociedades-page').then((m) => m.SociedadesPage),
  },
  {
    path: 'tipos-peticion',
    title: 'Tipos de petición',
    loadComponent: () => import('./tipos-peticion/tipos-peticion-page').then((m) => m.TiposPeticionPage),
  },
  {
    path: 'destino-informes',
    title: 'Destino de informes',
    loadComponent: () => import('./destino-informes/destino-informes-page').then((m) => m.DestinoInformesPage),
  },
  {
    path: 'soportes',
    title: 'Soportes',
    loadComponent: () => import('./soportes/soportes-page').then((m) => m.SoportesPage),
  },
  {
    path: 'contenedores',
    title: 'Contenedores',
    loadComponent: () => import('./contenedores/contenedores-page').then((m) => m.ContenedoresPage),
  },
  {
    path: 'comentarios',
    title: 'Comentarios',
    loadComponent: () => import('./comentarios/comentarios-page').then((m) => m.ComentariosPage),
  },
  {
    path: 'laboratorios-referencia',
    title: 'Laboratorios de referencia',
    loadComponent: () => import('./laboratorios-referencia/laboratorios-referencia-page').then((m) => m.LaboratoriosReferenciaPage),
  },
  {
    path: 'grupos-tecnicas',
    title: 'Grupos de técnicas',
    loadComponent: () => import('./grupos-tecnicas/grupos-tecnicas-page').then((m) => m.GruposTecnicasPage),
  },
  {
    path: 'subgrupos',
    title: 'Subgrupos',
    loadComponent: () => import('./subgrupos/subgrupos-page').then((m) => m.SubgruposPage),
  },
  {
    path: 'base-pacientes',
    title: 'Base de pacientes',
    loadComponent: () => import('./base-pacientes/base-pacientes-page').then((m) => m.BasePacientesPage),
  },
  {
    path: 'resultados-alfabeticos',
    title: 'Resultados alfabéticos',
    loadComponent: () => import('./resultados-alfabeticos/resultados-alfabeticos-page').then((m) => m.ResultadosAlfabeticosPage),
  },
  {
    path: 'sexo-especie',
    title: 'Sexo / especie',
    loadComponent: () => import('./sexo-especie/sexo-especie-page').then((m) => m.SexoEspeciePage),
  },
];
