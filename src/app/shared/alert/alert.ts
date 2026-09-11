import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

/** 'i' = información (azul), 'w' = aviso (amarillo), 'e' = error (rojo). */
export type AlertType = 'i' | 'w' | 'e';

/**
 * Cartel de aviso reutilizable: rectángulo con icono + título + mensaje (proyectado). El
 * color/icono cambian según `type` — pensado para reutilizarse en cualquier sitio que
 * necesite mostrar información, un aviso o un error (p. ej. el "Aviso en peticiones" de un
 * peticionario al seleccionarlo en una Petición).
 */
@Component({
  selector: 'app-alert',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.alert--info]': "type() === 'i'",
    '[class.alert--warning]': "type() === 'w'",
    '[class.alert--error]': "type() === 'e'",
  },
  template: `
    <app-icon [name]="iconName()" [size]="18" class="alert__icon" />
    <div class="alert__body">
      @if (title()) {
        <p class="alert__title">{{ title() }}</p>
      }
      <div class="alert__message">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './alert.css',
})
export class Alert {
  readonly type = input<AlertType>('i');
  readonly title = input('');

  protected readonly iconName = computed<IconName>(() => {
    switch (this.type()) {
      case 'w':
        return 'alert-triangle';
      case 'e':
        return 'alert-circle';
      default:
        return 'info';
    }
  });
}
