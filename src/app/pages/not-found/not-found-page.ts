import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="empty-state">
        <p class="empty-state__title">Página no encontrada</p>
        <p class="empty-state__desc">La dirección {{ url }} no existe en el LIMS.</p>
        <a class="btn btn--secondary empty-state__action" routerLink="/dashboard">Ir al dashboard</a>
      </div>
    </div>
  `,
})
export class NotFoundPage {
  protected readonly url = inject(Router).url;
}
