import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  inject,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MountedReportEditor, mountReportEditor } from '../../editor/mount-report-editor';
import { NEW_REPORT_ROUTE_ID } from '../../reporting-paths';
import { REPORT_PREVIEW_DATA, REPORT_REPOSITORY } from '../../services/reporting.tokens';

/**
 * Componente host: Angular controla la ruta y las dependencias,
 * Vue controla todo lo que ocurre dentro del editor.
 */
@Component({
  selector: 'app-report-editor-host',
  imports: [RouterLink],
  template: `
    <p><a routerLink="/reporting">Volver a Reporting</a></p>
    <div #editorMountPoint></div>
  `,
})
export class ReportEditorHost {
  /** Parámetro :id de la ruta, enlazado con withComponentInputBinding(). */
  readonly id = input.required<string>();

  private readonly router = inject(Router);
  private readonly repository = inject(REPORT_REPOSITORY);
  private readonly previewData = inject(REPORT_PREVIEW_DATA);
  private readonly mountPoint = viewChild.required<ElementRef<HTMLElement>>('editorMountPoint');

  private editor: MountedReportEditor | null = null;
  private openReportId: string | null = null;

  constructor() {
    afterRenderEffect(() => {
      const routeId = this.id();
      const reportId = routeId === NEW_REPORT_ROUTE_ID ? null : routeId;
      const target = this.mountPoint().nativeElement;
      untracked(() => this.open(target, reportId));
    });
    inject(DestroyRef).onDestroy(() => this.editor?.unmount());
  }

  private open(target: HTMLElement, reportId: string | null): void {
    // Tras guardar un informe nuevo la URL pasa a su id: el editor ya lo tiene abierto.
    if (this.editor && reportId === this.openReportId) {
      return;
    }
    this.editor?.unmount();
    this.openReportId = reportId;
    this.editor = mountReportEditor(target, {
      reportId,
      repository: this.repository,
      data: this.previewData,
      onSaved: (savedId) => this.onSaved(savedId),
    });
  }

  private onSaved(savedId: string): void {
    if (savedId !== this.openReportId) {
      this.openReportId = savedId;
      void this.router.navigate(['/reporting/editor', savedId], { replaceUrl: true });
    }
  }
}
