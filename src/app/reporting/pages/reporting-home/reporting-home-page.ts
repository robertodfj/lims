import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NEW_REPORT_ROUTE_ID } from '../../reporting-paths';

@Component({
  selector: 'app-reporting-home-page',
  imports: [RouterLink],
  template: `
    <h1>Reporting</h1>
    <nav aria-label="Opciones de reporting">
      <ul>
        <li><a [routerLink]="['editor', newReportId]">Nuevo Reporting</a></li>
        <li><a routerLink="informes">Informes existentes</a></li>
      </ul>
    </nav>
  `,
})
export class ReportingHomePage {
  protected readonly newReportId = NEW_REPORT_ROUTE_ID;
}
