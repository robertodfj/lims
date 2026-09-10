import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NEW_REPORT_ROUTE_ID } from '../../reporting-paths';

@Component({
  selector: 'app-reporting-home-page',
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Reporting</h1>
          <p class="page-header__meta">Diseña y consulta los informes del laboratorio.</p>
        </div>
      </div>

      <nav class="reporting-links" aria-label="Opciones de reporting">
        <a class="panel reporting-link" [routerLink]="['editor', newReportId]">
          <span class="panel__title">Nuevo informe</span>
          <span class="reporting-link__desc">Abrir el editor y crear un informe desde cero.</span>
        </a>
        <a class="panel reporting-link" routerLink="informes">
          <span class="panel__title">Informes existentes</span>
          <span class="reporting-link__desc">Ver, abrir y eliminar los informes guardados.</span>
        </a>
      </nav>
    </div>
  `,
  styles: `
    .reporting-links {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
      max-width: 640px;
    }

    .reporting-link {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 14px 16px;
      transition: border-color 100ms ease;
    }

    .reporting-link:hover {
      border-color: var(--border-strong);
    }

    .reporting-link__desc {
      font-size: 12px;
      color: var(--text-tertiary);
    }
  `,
})
export class ReportingHomePage {
  protected readonly newReportId = NEW_REPORT_ROUTE_ID;
}
