import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { NavigationItem } from '../../core/models/navigation-item.model';
import { MAIN_NAVIGATION } from '../../core/navigation/main-navigation';
import { Icon, IconName } from '../../shared/icon/icon';

const SECTION_ICONS: Record<string, IconName> = {
  dashboard: 'grid',
  'proceso-diario': 'clipboard',
  modulos: 'layers',
  mantenimientos: 'sliders',
  'procesos-auxiliares': 'cog',
  reporting: 'file-text',
};

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
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

  /** Primer segmento de la URL actual: sección activa por defecto. */
  protected readonly activeSection = computed(() => this.currentUrl().split(/[/?#]/)[1] ?? '');

  private readonly manualToggles = signal<Record<string, boolean>>({});

  protected iconFor(item: NavigationItem): IconName {
    return SECTION_ICONS[item.path] ?? 'grid';
  }

  protected isExpanded(item: NavigationItem): boolean {
    const manual = this.manualToggles()[item.path];
    return manual ?? item.path === this.activeSection();
  }

  protected toggle(item: NavigationItem): void {
    this.manualToggles.update((state) => ({ ...state, [item.path]: !this.isExpanded(item) }));
  }
}
