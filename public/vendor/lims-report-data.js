// Datos de ejemplo con la misma forma que tendrán al venir de la API/BD real.
// Mientras no exista esa conexión, un informe nuevo se crea con este contenido
// para poder maquetar y probar sin depender del backend.
export const REPORT_DATA = {
  laboratorio: {
    nombre: 'LIMS Laboratorio de Análisis Clínicos',
    logoUrl: '/report-assets/logo-placeholder.svg',
  },
  informe: {
    numero: 3,
    orden: '',
    fechaInicioAnalisis: '20/07/2026 10:03',
    fechaFinAnalisis: '',
    fechaEmisionInforme: '21/07/2026 02:00',
  },
  peticionario: {
    nombre: 'Instalaciones Deportivas Masquatro S.L.',
    direccion: 'C/San Agustín 9, 31001 Pamplona, NAVARRA',
    cif: 'B31896277',
  },
  muestra: {
    codigo: '3',
    matriz: 'SPA',
    fechaRecepcion: '21/07/2026',
    horaRecepcion: '08:41',
  },
  resultados: [
    { parametro: 'Glucosa', valor: '92', unidad: 'mg/dL', referencia: '70 - 110' },
    { parametro: 'Colesterol total', valor: '180', unidad: 'mg/dL', referencia: '< 200' },
    { parametro: 'Triglicéridos', valor: '95', unidad: 'mg/dL', referencia: '< 150' },
    { parametro: 'Creatinina', valor: '0.9', unidad: 'mg/dL', referencia: '0.6 - 1.2' },
  ],
  firma: {
    // Vinculado conceptualmente al peticionario que solicitó la prueba
    // (mismo dato que Mantenimientos › Peticionarios).
    nombre: 'Elena Castro Muñoz',
    imagenUrl: '/report-assets/signature-placeholder.svg',
  },
};

/** Punto de acceso único a los datos del informe: hoy mock, mañana la API real. */
export function useReportData() {
  return REPORT_DATA;
}
