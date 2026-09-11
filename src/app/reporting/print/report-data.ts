import { Paciente } from '../../pages/mantenimientos/base-pacientes/paciente.model';
import { Peticionario } from '../../pages/mantenimientos/peticionarios/peticionario.model';
import { Sociedad } from '../../pages/mantenimientos/sociedades/sociedad.model';
import { Tecnica } from '../../pages/mantenimientos/tecnicas/tecnica.model';
import { Peticion } from '../../pages/proceso-diario/peticiones-resultados/peticion.model';

/**
 * Misma forma que `REPORT_DATA` en `public/vendor/lims-report-data.js`: cualquier informe
 * escrito contra ese mock funciona igual aquí, solo que con los datos reales de la petición.
 */
export interface ReportData {
  laboratorio: { nombre: string; logoUrl: string };
  informe: {
    numero: number;
    orden: string;
    fechaInicioAnalisis: string;
    fechaFinAnalisis: string;
    fechaEmisionInforme: string;
  };
  peticionario: { nombre: string; direccion: string; cif: string };
  muestra: { codigo: string; matriz: string; fechaRecepcion: string; horaRecepcion: string };
  resultados: { parametro: string; valor: string; unidad: string; referencia: string }[];
  firma: { nombre: string; imagenUrl: string };
}

function formatFecha(value: string | null): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatHora(value: string | null): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatReferencia(tecnica: Tecnica | undefined): string {
  if (!tecnica || (tecnica.referencia1 == null && tecnica.referencia2 == null)) {
    return '';
  }
  if (tecnica.referencia1 != null && tecnica.referencia2 != null) {
    return `${tecnica.referencia1} - ${tecnica.referencia2}`;
  }
  return tecnica.referencia2 != null ? `< ${tecnica.referencia2}` : `> ${tecnica.referencia1}`;
}

/** Construye el objeto de datos del informe a partir de una petición y sus entidades relacionadas. */
export function buildReportData(
  peticion: Peticion,
  paciente: Paciente | null,
  sociedad: Sociedad | null,
  peticionario: Peticionario | null,
  tecnicas: readonly Tecnica[],
): ReportData {
  const tecnicasPorId = new Map(tecnicas.map((tecnica) => [tecnica.id, tecnica]));
  const ahora = new Date().toISOString();

  return {
    laboratorio: {
      nombre: 'LIMS Laboratorio de Análisis Clínicos',
      logoUrl: '/report-assets/logo-placeholder.svg',
    },
    informe: {
      numero: peticion.numRegistro,
      orden: '',
      fechaInicioAnalisis: [formatFecha(peticion.fechaVisita), formatHora(peticion.fechaVisita)].filter(Boolean).join(' '),
      fechaFinAnalisis: '',
      fechaEmisionInforme: [formatFecha(ahora), formatHora(ahora)].filter(Boolean).join(' '),
    },
    peticionario: {
      nombre: sociedad?.nombre || peticionario?.nombre || '—',
      direccion: sociedad ? [sociedad.domicilio, sociedad.poblacion].filter(Boolean).join(', ') : '',
      cif: sociedad?.nifCif || '',
    },
    muestra: {
      codigo: String(peticion.numRegistro),
      matriz: paciente ? [paciente.apellidos, paciente.nombre].filter(Boolean).join(', ') : '',
      fechaRecepcion: formatFecha(peticion.fechaVisita),
      horaRecepcion: formatHora(peticion.fechaVisita),
    },
    resultados: peticion.tecnicas
      .map((linea) => ({ linea, tecnica: tecnicasPorId.get(linea.tecnicaId) }))
      .filter((item): item is { linea: (typeof peticion.tecnicas)[number]; tecnica: Tecnica } =>
        !!item.tecnica && item.tecnica.tipoResultadoId !== 'agrupacion-pruebas',
      )
      .map(({ linea, tecnica }) => ({
        parametro: tecnica.nombre,
        valor: linea.resultado?.trim() || '—',
        unidad: tecnica.unidad1 || '',
        referencia: formatReferencia(tecnica),
      })),
    firma: {
      nombre: peticionario?.nombre || '—',
      imagenUrl: '/report-assets/signature-placeholder.svg',
    },
  };
}

/** Serializa `REPORT_DATA` como el módulo ES que el informe importa vía `lims:report-data`. */
export function buildReportDataModuleCode(data: ReportData): string {
  return [
    `export const REPORT_DATA = ${JSON.stringify(data)};`,
    'export function useReportData() { return REPORT_DATA; }',
    '',
  ].join('\n');
}
