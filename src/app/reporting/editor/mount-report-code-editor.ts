import { createApp } from 'vue';
import ReportCodeEditor from './ReportCodeEditor.vue';

export interface MountedReportCodeEditor {
  getCode(): string;
  unmount(): void;
}

/** Único punto de contacto entre Angular y Vue para el editor de código avanzado. */
export function mountReportCodeEditor(target: HTMLElement, initialCode: string): MountedReportCodeEditor {
  const app = createApp(ReportCodeEditor, { initialCode });
  const instance = app.mount(target) as unknown as { getCode(): string };
  return {
    getCode: () => instance.getCode(),
    unmount: () => app.unmount(),
  };
}
