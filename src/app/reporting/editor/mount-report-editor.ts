import { createApp } from 'vue';
import type { ReportDataContext } from '../models/report-data-context.model';
import type { ReportRepository } from '../services/report-repository';
import ReportEditor from './ReportEditor.vue';

// `type` (no `interface`) para que sea asignable a las props genéricas de createApp.
export type ReportEditorMountOptions = {
  reportId: string | null;
  repository: ReportRepository;
  data: ReportDataContext;
  onSaved: (reportId: string) => void;
};

export interface MountedReportEditor {
  unmount(): void;
}

/** Único punto de contacto entre Angular y Vue: monta el editor en un elemento del DOM. */
export function mountReportEditor(target: HTMLElement, options: ReportEditorMountOptions): MountedReportEditor {
  const app = createApp(ReportEditor, options);
  app.mount(target);
  return { unmount: () => app.unmount() };
}
