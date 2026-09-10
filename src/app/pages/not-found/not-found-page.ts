import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <h1>Página no encontrada</h1>
    <p>La dirección {{ url }} no existe en el LIMS.</p>
    <p><a routerLink="/dashboard">Ir al dashboard</a></p>
  `,
})
export class NotFoundPage {
  protected readonly url = inject(Router).url;
}
