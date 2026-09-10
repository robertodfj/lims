import { NavigationItem } from '../models/navigation-item.model';

/** Estructura del menú principal. Las rutas coinciden con los segmentos definidos en app.routes.ts. */
export const MAIN_NAVIGATION: readonly NavigationItem[] = [
  { label: 'Dashboard', path: 'dashboard' },
  {
    label: 'Proceso diario',
    path: 'proceso-diario',
    children: [
      { label: 'Peticiones y resultados', path: 'peticiones-resultados' },
      { label: 'Hojas de trabajo', path: 'hojas-trabajo' },
      { label: 'Informes', path: 'informes' },
      { label: 'Comunicaciones', path: 'comunicaciones' },
      { label: 'Validación de resultados', path: 'validacion-resultados' },
    ],
  },
  {
    label: 'Módulos',
    path: 'modulos',
    children: [
      { label: 'Presupuestos', path: 'presupuestos' },
      { label: 'Citaciones', path: 'citaciones' },
      { label: 'Urgencias', path: 'urgencias' },
      { label: 'Distribución de muestras', path: 'distribucion-muestras' },
      { label: 'Seroteca', path: 'seroteca' },
      { label: 'Laboratorio de referencia', path: 'laboratorio-referencia' },
      { label: 'Reglas inteligentes', path: 'reglas-inteligentes' },
    ],
  },
  {
    label: 'Mantenimientos',
    path: 'mantenimientos',
    children: [
      { label: 'Técnicas', path: 'tecnicas' },
      { label: 'Peticionarios', path: 'peticionarios' },
      { label: 'Procedencias', path: 'procedencias' },
      { label: 'Sociedades', path: 'sociedades' },
      { label: 'Tipos de petición', path: 'tipos-peticion' },
      { label: 'Destino de informes', path: 'destino-informes' },
      { label: 'Secciones', path: 'secciones' },
      { label: 'Soportes', path: 'soportes' },
      { label: 'Contenedores', path: 'contenedores' },
      { label: 'Tipos de muestra', path: 'tipos-muestra' },
      { label: 'Sistemáticos', path: 'sistematicos' },
      { label: 'Hojas de trabajo', path: 'hojas-trabajo' },
      { label: 'Comentarios', path: 'comentarios' },
      { label: 'Laboratorios de referencia', path: 'laboratorios-referencia' },
      { label: 'Microbiología', path: 'microbiologia' },
      { label: 'Grupos de técnicas', path: 'grupos-tecnicas' },
      { label: 'Base de pacientes', path: 'base-pacientes' },
      { label: 'Resultados alfabéticos', path: 'resultados-alfabeticos' },
      { label: 'Textos codificados', path: 'textos-codificados' },
      { label: 'Sexo / especie', path: 'sexo-especie' },
      { label: 'Facturación', path: 'facturacion' },
      { label: 'Tablas dinámicas', path: 'tablas-dinamicas' },
    ],
  },
  {
    label: 'Procesos auxiliares',
    path: 'procesos-auxiliares',
    children: [
      { label: 'Usuarios', path: 'usuarios' },
      { label: 'Laboratorios', path: 'laboratorios' },
    ],
  },
  { label: 'Reporting', path: 'reporting' },
];
