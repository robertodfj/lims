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
    path: 'tipos-muestra',
    title: 'Tipos de muestra',
    loadComponent: () => import('./tipos-muestra/tipos-muestra-page').then((m) => m.TiposMuestraPage),
  },
  {
    path: 'hojas-trabajo',
    title: 'Hojas de trabajo',
    loadComponent: () => import('./hojas-trabajo/hojas-trabajo-page').then((m) => m.HojasTrabajoMantenimientoPage),
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
    path: 'microbiologia',
    title: 'Microbiología',
    loadComponent: () => import('./microbiologia/microbiologia-page').then((m) => m.MicrobiologiaPage),
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
    path: 'textos-codificados',
    title: 'Textos codificados',
    loadComponent: () => import('./textos-codificados/textos-codificados-page').then((m) => m.TextosCodificadosPage),
  },
  {
    path: 'sexo-especie',
    title: 'Sexo / especie',
    loadComponent: () => import('./sexo-especie/sexo-especie-page').then((m) => m.SexoEspeciePage),
  },
  {
    path: 'facturacion',
    title: 'Facturación',
    loadComponent: () => import('./facturacion/facturacion-page').then((m) => m.FacturacionPage),
  },
  {
    path: 'tablas-dinamicas',
    title: 'Tablas dinámicas',
    loadComponent: () => import('./tablas-dinamicas/tablas-dinamicas-page').then((m) => m.TablasDinamicasPage),
  },
];
