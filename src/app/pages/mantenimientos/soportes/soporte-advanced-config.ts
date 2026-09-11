import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Contenedor } from '../contenedores/contenedor.model';
import { CONTENEDOR_REPOSITORY } from '../contenedores/contenedores.tokens';

/**
 * Contenido de "Configuración avanzada" de un Soporte: qué contenedores puede utilizar. A
 * diferencia del resto de "Avanzado" de la app, esta pestaña sí es funcional: persiste
 * `contenedoresAsociadosIds` en el propio Soporte. Sin ningún contenedor asociado, el
 * soporte admite todos (comportamiento por defecto); en cuanto se asocia alguno, solo
 * admite los de la lista.
 */
@Component({
  selector: 'app-soporte-advanced-config',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './soporte-advanced-config.html',
  styleUrl: './soporte-advanced-config.css',
})
export class SoporteAdvancedConfig {
  private readonly contenedorRepository = inject(CONTENEDOR_REPOSITORY);

  readonly contenedoresAsociadosIds = input<readonly string[]>([]);
  readonly contenedoresAsociadosIdsChange = output<readonly string[]>();

  protected readonly contenedores = signal<Contenedor[]>([]);

  protected readonly contenedoresIncluidos = computed(() => {
    const ids = this.contenedoresAsociadosIds();
    const porId = new Map(this.contenedores().map((contenedor) => [contenedor.id, contenedor]));
    return ids.map((id) => porId.get(id)).filter((contenedor): contenedor is Contenedor => !!contenedor);
  });

  protected readonly contenedoresDisponibles = computed(() => {
    const incluidos = new Set(this.contenedoresAsociadosIds());
    return this.contenedores().filter((contenedor) => !incluidos.has(contenedor.id));
  });

  constructor() {
    void this.loadContenedores();
  }

  protected agregar(contenedorId: string): void {
    const actuales = this.contenedoresAsociadosIds();
    if (actuales.includes(contenedorId)) {
      return;
    }
    this.contenedoresAsociadosIdsChange.emit([...actuales, contenedorId]);
  }

  protected quitar(contenedorId: string): void {
    this.contenedoresAsociadosIdsChange.emit(this.contenedoresAsociadosIds().filter((id) => id !== contenedorId));
  }

  private async loadContenedores(): Promise<void> {
    this.contenedores.set(await this.contenedorRepository.list());
  }
}
