import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Drawer } from '../drawer/drawer';
import { Icon } from '../icon/icon';

/**
 * Botón de "Configuración avanzada" reutilizable en Mantenimientos y en las líneas de
 * técnicas de una Petición. Por ahora la configuración avanzada no está implementada:
 * el botón solo abre un drawer vacío a modo de marcador de posición.
 */
@Component({
  selector: 'app-advanced-settings-button',
  imports: [Icon, Drawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // En un pie de drawer (justify-content: flex-end), esto separa "Avanzado" hacia la
    // izquierda mientras Cancelar/Guardar se mantienen agrupados a la derecha.
    '[class.asb--labeled]': "variant() === 'labeled'",
  },
  template: `
    @if (variant() === 'labeled') {
      <button type="button" class="btn btn--secondary" (click)="open.set(true)">
        <app-icon name="sliders" [size]="14" />
        Avanzado
      </button>
    } @else {
      <button type="button" class="btn btn--ghost btn--icon btn--sm" (click)="open.set(true)" aria-label="Configuración avanzada">
        <app-icon name="sliders" [size]="14" />
      </button>
    }

    <app-drawer [open]="open()" [size]="hasCustomContent() ? 'xl' : 'md'" title="Configuración avanzada" (closed)="open.set(false)">
      @if (hasCustomContent()) {
        <ng-content />
      } @else {
        <p class="asb__text">Esta configuración avanzada todavía no está implementada.</p>
      }

      <div drawerFooter>
        <button type="button" class="btn btn--secondary" (click)="open.set(false)">Cerrar</button>
      </div>
    </app-drawer>
  `,
  styles: `
    :host.asb--labeled {
      margin-right: auto;
    }

    .asb__text {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
  `,
})
export class AdvancedSettingsButton {
  readonly variant = input<'labeled' | 'icon'>('icon');
  /** Cuando es true, se proyecta el contenido pasado por el llamante en vez del texto por defecto. */
  readonly hasCustomContent = input(false);

  protected readonly open = signal(false);
}
