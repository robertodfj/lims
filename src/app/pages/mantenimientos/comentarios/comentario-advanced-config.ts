import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Tecnica } from '../tecnicas/tecnica.model';
import { TECNICA_REPOSITORY } from '../tecnicas/tecnicas.tokens';

/**
 * Contenido de "Configuración avanzada" de un Comentario: a qué técnicas se puede vincular.
 * Como en Soportes/Contenedores, esta pestaña es funcional: persiste `tecnicasVinculadasIds`
 * en el propio Comentario. Luego, al introducir un comentario en un resultado, si la técnica
 * tiene comentarios vinculados solo se ofrecen esos por defecto (con la pestaña "Todos" para
 * ver el resto).
 */
@Component({
  selector: 'app-comentario-advanced-config',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comentario-advanced-config.html',
  styleUrl: './comentario-advanced-config.css',
})
export class ComentarioAdvancedConfig {
  private readonly tecnicaRepository = inject(TECNICA_REPOSITORY);

  readonly tecnicasVinculadasIds = input<readonly string[]>([]);
  readonly tecnicasVinculadasIdsChange = output<readonly string[]>();

  protected readonly tecnicas = signal<Tecnica[]>([]);

  /**
   * Registros guardados antes de que este campo existiera pueden traer `tecnicasVinculadasIds`
   * a `undefined` desde localStorage: se normaliza aquí para no romper el resto del componente.
   */
  private readonly idsNormalizados = computed(() => this.tecnicasVinculadasIds() ?? []);

  protected readonly tecnicasVinculadas = computed(() => {
    const ids = this.idsNormalizados();
    const porId = new Map(this.tecnicas().map((tecnica) => [tecnica.id, tecnica]));
    return ids.map((id) => porId.get(id)).filter((tecnica): tecnica is Tecnica => !!tecnica);
  });

  protected readonly tecnicasDisponibles = computed(() => {
    const vinculadas = new Set(this.idsNormalizados());
    return this.tecnicas().filter((tecnica) => !vinculadas.has(tecnica.id));
  });

  constructor() {
    void this.loadTecnicas();
  }

  protected agregar(tecnicaId: string): void {
    const actuales = this.idsNormalizados();
    if (actuales.includes(tecnicaId)) {
      return;
    }
    this.tecnicasVinculadasIdsChange.emit([...actuales, tecnicaId]);
  }

  protected quitar(tecnicaId: string): void {
    this.tecnicasVinculadasIdsChange.emit(this.idsNormalizados().filter((id) => id !== tecnicaId));
  }

  private async loadTecnicas(): Promise<void> {
    this.tecnicas.set(await this.tecnicaRepository.list());
  }
}
