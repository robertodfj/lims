import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

/** Chrome consistente para secciones aún no implementadas. */
@Component({
  selector: 'app-page-placeholder',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-header__title">{{ title() }}</h1>
          <p class="page-header__meta">{{ description() }}</p>
        </div>
      </div>

      <div class="empty-state">
        <app-icon class="empty-state__icon" name="inbox" [size]="22" />
        <p class="empty-state__title">Sección pendiente de implementación</p>
        <p class="empty-state__desc">
          {{ title() }} se construirá en una fase posterior siguiendo el mismo sistema de tabla, filtros y panel
          lateral ya definido en Mantenimientos › Peticionarios.
        </p>
      </div>
    </div>
  `,
})
export class PagePlaceholder {
  readonly title = input.required<string>();
  readonly description = input('');
}
