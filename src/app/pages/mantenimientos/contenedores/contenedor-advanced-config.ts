import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Destino } from '../destino-informes/destino.model';
import { DESTINO_REPOSITORY } from '../destino-informes/destinos.tokens';
import { ContenedorDestinoPreanalitico } from './contenedor.model';

/**
 * Contenido de "Configuración avanzada" de un Contenedor: qué Destinos (Mantenimiento /
 * Destino de informes) puede usar como destino preanalítico. Funcional de verdad, como el
 * Avanzado de Soportes: persiste `destinosPreanaliticos` con la prioridad de cada uno. Sin
 * ninguno asignado, el contenedor admite cualquier destino.
 */
@Component({
  selector: 'app-contenedor-advanced-config',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contenedor-advanced-config.html',
  styleUrl: './contenedor-advanced-config.css',
})
export class ContenedorAdvancedConfig {
  private readonly destinoRepository = inject(DESTINO_REPOSITORY);

  readonly destinosPreanaliticos = input<readonly ContenedorDestinoPreanalitico[]>([]);
  readonly destinosPreanaliticosChange = output<readonly ContenedorDestinoPreanalitico[]>();

  protected readonly destinos = signal<Destino[]>([]);
  /** El botón "Prioridad" activa/desactiva mostrar el campo numérico de cada asignado. */
  protected readonly editandoPrioridad = signal(false);

  protected readonly asignados = computed(() => {
    const porId = new Map(this.destinos().map((destino) => [destino.id, destino]));
    return this.destinosPreanaliticos()
      .map((item) => ({ item, destino: porId.get(item.destinoId) }))
      .filter((entry): entry is { item: ContenedorDestinoPreanalitico; destino: Destino } => !!entry.destino)
      .sort((a, b) => (a.item.prioridad ?? Infinity) - (b.item.prioridad ?? Infinity));
  });

  protected readonly disponibles = computed(() => {
    const asignadosIds = new Set(this.destinosPreanaliticos().map((item) => item.destinoId));
    return this.destinos().filter((destino) => !asignadosIds.has(destino.id));
  });

  constructor() {
    void this.loadDestinos();
  }

  protected togglePrioridad(): void {
    this.editandoPrioridad.update((value) => !value);
  }

  protected agregar(destinoId: string): void {
    const actuales = this.destinosPreanaliticos();
    if (actuales.some((item) => item.destinoId === destinoId)) {
      return;
    }
    this.destinosPreanaliticosChange.emit([...actuales, { destinoId, prioridad: null }]);
  }

  protected quitar(destinoId: string): void {
    this.destinosPreanaliticosChange.emit(this.destinosPreanaliticos().filter((item) => item.destinoId !== destinoId));
  }

  protected updatePrioridad(destinoId: string, prioridad: number | null): void {
    this.destinosPreanaliticosChange.emit(
      this.destinosPreanaliticos().map((item) => (item.destinoId === destinoId ? { ...item, prioridad } : item)),
    );
  }

  private async loadDestinos(): Promise<void> {
    this.destinos.set(await this.destinoRepository.list());
  }
}
