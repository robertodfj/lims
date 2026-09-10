import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { MAIN_NAVIGATION } from '../../core/navigation/main-navigation';
import { Icon } from '../../shared/icon/icon';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Migas de pan derivadas de la sección/subsección activa en MAIN_NAVIGATION. */
  protected readonly breadcrumb = computed(() => {
    const [, sectionPath, childPath] = this.currentUrl().split(/[/?#]/);
    const section = MAIN_NAVIGATION.find((item) => item.path === sectionPath);
    if (!section) {
      return [];
    }
    const child = section.children?.find((item) => item.path === childPath);
    return child ? [section.label, child.label] : [section.label];
  });
}
