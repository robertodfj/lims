import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { MAIN_NAVIGATION } from '../../core/navigation/main-navigation';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private readonly router = inject(Router);

  protected readonly items = MAIN_NAVIGATION;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Primer segmento de la URL actual: sirve para dejar desplegada la sección activa. */
  protected readonly activeSection = computed(() => this.currentUrl().split(/[/?#]/)[1] ?? '');
}
