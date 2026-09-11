import { createApp } from 'vue';
import ReportPreview from './ReportPreview.vue';

/**
 * Monta el informe (código .vue guardado en Reporting) en modo solo-lectura, sin editor,
 * con los datos reales de una petición inyectados vía `reportDataUrl`. Único punto de
 * contacto entre Angular y Vue para la vista de impresión/previsualización.
 */
export function mountReportPreview(target: HTMLElement, code: string, reportDataUrl: string): () => void {
  const app = createApp(ReportPreview, { code, reportDataUrl });
  app.mount(target);
  return () => app.unmount();
}
