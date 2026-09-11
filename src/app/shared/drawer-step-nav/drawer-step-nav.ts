import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EntityDrawerPosition } from '../entity-drawer-crud/entity-drawer-crud';
import { Icon } from '../icon/icon';

/**
 * "‹ 3 / 12 ›" a la izquierda del título del drawer: permite pasar al registro anterior o
 * siguiente sin cerrar el drawer y volver a abrirlo desde la lista. Se oculta sola (no
 * renderiza nada) mientras se da de alta un registro nuevo, ya que `position` es null en ese
 * caso — ver EntityDrawerCrud.position.
 */
@Component({
  selector: 'app-drawer-step-nav',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (position(); as pos) {
      <div class="drawer-step-nav">
        <button
          type="button"
          class="btn btn--ghost btn--icon btn--sm"
          [disabled]="pos.index <= 1"
          (click)="previous.emit()"
          aria-label="Registro anterior"
        >
          <app-icon name="chevron-down" [size]="14" class="icon-point-left" />
        </button>
        <span class="drawer-step-nav__count">{{ pos.index }} / {{ pos.total }}</span>
        <button
          type="button"
          class="btn btn--ghost btn--icon btn--sm"
          [disabled]="pos.index >= pos.total"
          (click)="next.emit()"
          aria-label="Registro siguiente"
        >
          <app-icon name="chevron-down" [size]="14" class="icon-point-right" />
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: contents;
    }

    .drawer-step-nav {
      display: flex;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;
    }

    .drawer-step-nav__count {
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      color: var(--text-tertiary);
      white-space: nowrap;
      padding: 0 2px;
    }
  `,
})
export class DrawerStepNav {
  readonly position = input<EntityDrawerPosition | null>(null);
  readonly previous = output<void>();
  readonly next = output<void>();
}
