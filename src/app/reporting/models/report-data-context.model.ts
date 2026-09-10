/** Datos con los que se renderiza un informe. Hoy vienen de mocks; en el futuro, de la API .NET. */
export interface ReportDataContext {
  laboratory: {
    name: string;
    address: string;
    phone: string;
  };
  patient: {
    id: string;
    name: string;
    birthDate: string;
  };
  sample: {
    id: string;
    type: string;
    receivedAt: string;
  };
  results: ReportResultRow[];
  comments: string[];
  validation: {
    validatedBy: string;
    validatedAt: string;
  };
}

export interface ReportResultRow {
  test: string;
  value: string;
  unit: string;
}
