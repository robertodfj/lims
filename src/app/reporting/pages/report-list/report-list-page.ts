import { afterRenderEffect, ChangeDetectionStrategy, Component, ElementRef, inject, signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import type { MountedReportCodeEditor } from '../../editor/mount-report-code-editor';
import { createNewReport } from '../../models/report-factory';
import { ReportSummary, SavedReportDocument } from '../../models/report.model';
import { REPORT_REPOSITORY } from '../../services/reporting.tokens';
import { Icon } from '../../../shared/icon/icon';
import { Modal } from '../../../shared/modal/modal';

type NameModalMode = 'create' | 'rename';

@Component({
  selector: 'app-report-list-page',
  imports: [DatePipe, FormsModule, Icon, Modal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-list-page.html',
  styleUrl: './report-list-page.css',
})
export class ReportListPage {
  private readonly repository = inject(REPORT_REPOSITORY);

  protected readonly reports = signal<ReportSummary[] | null>(null);

  protected readonly nameModalOpen = signal(false);
  protected readonly nameModalMode = signal<NameModalMode>('create');
  protected readonly nameDraft = signal('');
  private editingReportId: string | null = null;

  protected readonly advancedEditOpen = signal(false);
  protected readonly advancedEditReport = signal<SavedReportDocument | null>(null);
  protected readonly savingAdvanced = signal(false);
  protected readonly confirmDiscardOpen = signal(false);
  private originalCode: string | null = null;

  protected readonly confirmDeleteId = signal<string | null>(null);

  private readonly codeEditorMount = viewChild<ElementRef<HTMLElement>>('codeEditorMount');
  private codeEditor: MountedReportCodeEditor | null = null;

  constructor() {
    void this.loadReports();

    // Import diferido: el editor de código (@vue/repl + CodeMirror) solo se carga
    // cuando se abre la edición avanzada, no al listar informes.
    afterRenderEffect(() => {
      const report = this.advancedEditReport();
      const target = this.codeEditorMount()?.nativeElement;

      untracked(() => {
        this.codeEditor?.unmount();
        this.codeEditor = null;
        if (report && target) {
          void import('../../editor/mount-report-code-editor').then(({ mountReportCodeEditor }) => {
            // El modal pudo cerrarse mientras se cargaba el chunk.
            if (this.advancedEditReport()?.id === report.id) {
              this.codeEditor = mountReportCodeEditor(target, report.code);
            }
          });
        }
      });
    });
  }

  protected openCreateModal(): void {
    this.nameModalMode.set('create');
    this.nameDraft.set('');
    this.editingReportId = null;
    this.nameModalOpen.set(true);
  }

  protected openRenameModal(report: ReportSummary): void {
    this.nameModalMode.set('rename');
    this.nameDraft.set(report.name);
    this.editingReportId = report.id;
    this.nameModalOpen.set(true);
  }

  protected closeNameModal(): void {
    this.nameModalOpen.set(false);
  }

  protected async saveName(): Promise<void> {
    const name = this.nameDraft().trim();
    if (!name) {
      return;
    }

    if (this.nameModalMode() === 'create') {
      await this.repository.save(createNewReport(name));
    } else if (this.editingReportId) {
      const existing = await this.repository.get(this.editingReportId);
      if (existing) {
        await this.repository.save({ ...existing, name });
      }
    }

    this.nameModalOpen.set(false);
    await this.loadReports();
  }

  protected async openAdvancedEdit(report: ReportSummary): Promise<void> {
    const full = await this.repository.get(report.id);
    if (!full) {
      return;
    }
    this.originalCode = full.code;
    this.advancedEditReport.set(full);
    this.advancedEditOpen.set(true);
  }

  /** Punto de cierre del modal (overlay, Escape, botón X o Cancelar): pide confirmación si hay cambios sin guardar. */
  protected requestCloseAdvancedEdit(): void {
    if (this.confirmDiscardOpen()) {
      return;
    }
    const currentCode = this.codeEditor?.getCode();
    const isDirty = currentCode != null && currentCode !== this.originalCode;
    if (isDirty) {
      this.confirmDiscardOpen.set(true);
    } else {
      this.closeAdvancedEdit();
    }
  }

  protected confirmDiscard(): void {
    this.confirmDiscardOpen.set(false);
    this.closeAdvancedEdit();
  }

  protected cancelDiscard(): void {
    this.confirmDiscardOpen.set(false);
  }

  protected closeAdvancedEdit(): void {
    this.advancedEditOpen.set(false);
    this.advancedEditReport.set(null);
    this.confirmDiscardOpen.set(false);
    this.originalCode = null;
  }

  protected async saveAdvancedEdit(): Promise<void> {
    const report = this.advancedEditReport();
    const code = this.codeEditor?.getCode();
    if (!report || code == null) {
      return;
    }

    this.savingAdvanced.set(true);
    try {
      await this.repository.save({ ...report, code });
      this.closeAdvancedEdit();
      await this.loadReports();
    } finally {
      this.savingAdvanced.set(false);
    }
  }

  protected requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  protected async confirmDelete(id: string): Promise<void> {
    await this.repository.delete(id);
    this.confirmDeleteId.set(null);
    await this.loadReports();
  }

  private async loadReports(): Promise<void> {
    this.reports.set(await this.repository.list());
  }
}
