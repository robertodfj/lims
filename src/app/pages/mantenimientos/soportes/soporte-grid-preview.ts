import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SoporteOrientacion } from './soporte.model';

const MAX_CELDAS = 24;

/** Vista previa del soporte físico: una rejilla de huecos según filas, columnas y orientación. */
@Component({
  selector: 'app-soporte-grid-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sgp" [class.sgp--sm]="size() === 'sm'">
      <div
        class="sgp__grid"
        [style.grid-template-rows]="'repeat(' + filasVisibles() + ', 1fr)'"
        [style.grid-template-columns]="'repeat(' + columnasVisibles() + ', 1fr)'"
      >
        @for (hole of holes(); track $index) {
          <span class="sgp__hole" [style.border-color]="color()"></span>
        }
      </div>
    </div>
  `,
  styleUrl: './soporte-grid-preview.css',
})
export class SoporteGridPreview {
  readonly filas = input<number | null>(null);
  readonly columnas = input<number | null>(null);
  readonly orientacion = input<SoporteOrientacion>('vertical');
  readonly color = input<string | null>(null);
  readonly size = input<'sm' | 'lg'>('lg');

  private readonly filasSeguras = computed(() => clamp(this.filas()));
  private readonly columnasSeguras = computed(() => clamp(this.columnas()));

  /** En horizontal el soporte se representa girado: filas y columnas se intercambian. */
  protected readonly filasVisibles = computed(() =>
    this.orientacion() === 'vertical' ? this.filasSeguras() : this.columnasSeguras(),
  );
  protected readonly columnasVisibles = computed(() =>
    this.orientacion() === 'vertical' ? this.columnasSeguras() : this.filasSeguras(),
  );

  protected readonly holes = computed(() => Array.from({ length: this.filasVisibles() * this.columnasVisibles() }));
}

function clamp(value: number | null): number {
  if (!value || value < 1) {
    return 1;
  }
  return Math.min(value, MAX_CELDAS);
}
