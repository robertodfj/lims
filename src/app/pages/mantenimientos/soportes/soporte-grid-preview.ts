import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const MAX_CELDAS = 24;

/** Vista previa del soporte físico: una rejilla de huecos según nº de filas y columnas. */
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
  readonly color = input<string | null>(null);
  readonly size = input<'sm' | 'lg'>('lg');

  /**
   * Nº de filas/columnas ya describe la forma física del soporte. La orientación no gira
   * la rejilla: solo determina el orden de llenado desde Seroteca (horizontal = izquierda a
   * derecha y de arriba a abajo; vertical = de arriba a abajo y de izquierda a derecha), así
   * que la vista previa no depende de ella.
   */
  protected readonly filasVisibles = computed(() => clamp(this.filas()));
  protected readonly columnasVisibles = computed(() => clamp(this.columnas()));

  protected readonly holes = computed(() => Array.from({ length: this.filasVisibles() * this.columnasVisibles() }));
}

function clamp(value: number | null): number {
  if (!value || value < 1) {
    return 1;
  }
  return Math.min(value, MAX_CELDAS);
}
