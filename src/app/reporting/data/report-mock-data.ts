import { ReportDataContext } from '../models/report-data-context.model';

/** Datos de ejemplo para editar y previsualizar informes hasta que exista la API. */
export const REPORT_MOCK_DATA: ReportDataContext = {
  laboratory: {
    name: 'Laboratorio de Análisis Clínicos',
    address: 'Calle Mayor 1, 37001 Salamanca',
    phone: '923 000 000',
  },
  patient: {
    id: 'P-000123',
    name: 'Juan García',
    birthDate: '01/01/1990',
  },
  sample: {
    id: 'M-2026-001',
    type: 'Sangre',
    receivedAt: '10/09/2026',
  },
  results: [
    { test: 'Hemoglobina', value: '14.2', unit: 'g/dL' },
    { test: 'Leucocitos', value: '7.4', unit: '×10³/µL' },
    { test: 'Glucosa', value: '92', unit: 'mg/dL' },
  ],
  comments: ['Muestra recibida en condiciones adecuadas.'],
  validation: {
    validatedBy: 'Dra. Laura Martín',
    validatedAt: '10/09/2026',
  },
};
