import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportSummary } from '../../models/report.model';
import { REPORT_REPOSITORY } from '../../services/reporting.tokens';
import { NEW_REPORT_ROUTE_ID } from '../../reporting-paths';

@Component({
  selector: 'app-report-list-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './report-list-page.html',
})
export class ReportListPage {
  private readonly repository = inject(REPORT_REPOSITORY);

  protected readonly newReportId = NEW_REPORT_ROUTE_ID;
  protected readonly reports = signal<ReportSummary[] | null>(null);

  constructor() {
    void this.loadReports();
  }

  protected async deleteReport(report: ReportSummary): Promise<void> {
    if (confirm(`¿Eliminar el informe "${report.name}"?`)) {
      await this.repository.delete(report.id);
      await this.loadReports();
    }
  }

  private async loadReports(): Promise<void> {
    this.reports.set(await this.repository.list());
  }
}
