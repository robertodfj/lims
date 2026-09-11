import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AdvancedSettingsButton } from '../advanced-settings-button/advanced-settings-button';

/**
 * Pie estándar de un drawer de alta/edición: botón "Avanzado" a la izquierda y
 * Cancelar/Guardar agrupados a la derecha. Se repetía de forma idéntica en cada
 * Mantenimiento; ahora basta con `<app-drawer-form-footer [saving]="saving()"
 * (cancelled)="closeDrawer()" (saved)="save()" />` dentro de `<div drawerFooter>`.
 *
 * `:host { display: contents }` hace que sus tres botones sigan siendo hijos flex
 * directos de `.drawer__footer`, así el truco de `asb--labeled` (que separa "Avanzado"
 * hacia la izquierda) sigue funcionando exactamente igual que si no hubiera wrapper.
 */
@Component({
  selector: 'app-drawer-form-footer',
  imports: [AdvancedSettingsButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasAdvanced()) {
      <app-advanced-settings-button variant="labeled" [hasCustomContent]="hasCustomAdvanced()">
        <ng-content />
      </app-advanced-settings-button>
    }
    <button type="button" class="btn btn--secondary" (click)="cancelled.emit()">Cancelar</button>
    <button type="button" class="btn btn--primary" [disabled]="saving()" (click)="saved.emit()">
      {{ saving() ? 'Guardando…' : 'Guardar' }}
    </button>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class DrawerFormFooter {
  readonly saving = input(false);
  /** False en entidades que de verdad no tienen configuración avanzada (p. ej. Peticionarios, Procedencias). */
  readonly hasAdvanced = input(true);
  /** True cuando el llamante proyecta contenido propio dentro del botón "Avanzado" (p. ej. Técnicas). */
  readonly hasCustomAdvanced = input(false);
  readonly cancelled = output<void>();
  readonly saved = output<void>();
}
