import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Drawer } from '../drawer/drawer';
import { Icon } from '../icon/icon';

/** Chrome consistente para secciones aún no implementadas, con un botón de creación de muestra. */
@Component({
  selector: 'app-page-placeholder',
  imports: [Icon, Drawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-header__title">{{ title() }}</h1>
          <p class="page-header__meta">{{ description() }}</p>
        </div>
        <div class="page-header__actions">
          <button type="button" class="btn btn--primary" (click)="drawerOpen.set(true)">
            <app-icon name="plus" [size]="14" />
            Crear nuevo
          </button>
        </div>
      </div>

      <div class="empty-state">
        <app-icon class="empty-state__icon" name="inbox" [size]="22" />
        <p class="empty-state__title">Sección pendiente de implementación</p>
        <p class="empty-state__desc">
          {{ title() }} se construirá en una fase posterior siguiendo el mismo sistema de tabla, filtros y panel
          lateral ya definido en Mantenimientos › Técnicas.
        </p>
      </div>
    </div>

    <app-drawer [open]="drawerOpen()" title="Nuevo registro" (closed)="drawerOpen.set(false)">
      <p class="placeholder-drawer__text">
        El formulario de creación de {{ title().toLowerCase() }} todavía no está implementado. Cuando se construya
        esta sección seguirá el mismo patrón de campos, catálogos y guardado que ya usan Técnicas y Procedencias.
      </p>

      <div drawerFooter>
        <button type="button" class="btn btn--secondary" (click)="drawerOpen.set(false)">Cerrar</button>
      </div>
    </app-drawer>
  `,
  styles: `
    .placeholder-drawer__text {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
  `,
})
export class PagePlaceholder {
  readonly title = input.required<string>();
  readonly description = input('');

  protected readonly drawerOpen = signal(false);
}
