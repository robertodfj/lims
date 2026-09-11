import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { COMENTARIO_REPOSITORY } from '../comentarios/comentarios.tokens';
import { Comentario } from '../comentarios/comentario.model';
import { ResultadoAlfabetico } from '../resultados-alfabeticos/resultado-alfabetico.model';
import { RESULTADO_ALFABETICO_REPOSITORY } from '../resultados-alfabeticos/resultados-alfabeticos.tokens';
import { SEXO_ESPECIE_REPOSITORY } from '../sexo-especie/sexo-especie.tokens';
import { Tecnica } from './tecnica.model';
import { TECNICA_REPOSITORY } from './tecnicas.tokens';

type AdvancedTab =
  | 'rangos'
  | 'extendida'
  | 'decimales'
  | 'interpretacion'
  | 'comentarios'
  | 'agrupaciones'
  | 'alfabeticos'
  | 'formula'
  | 'articulos';

/**
 * Contenido de la ventana "Configuración avanzada" de una técnica: rangos de referencia,
 * decimales por intervalo, interpretación de resultado, comentarios/agrupaciones/resultados
 * alfabéticos/artículos vinculados y la fórmula (técnicas calculadas). Por ahora es solo
 * visual — ningún campo se guarda todavía, según lo pedido.
 */
@Component({
  selector: 'app-tecnica-advanced-config',
  imports: [SearchableSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tecnica-advanced-config.html',
  styleUrl: './tecnica-advanced-config.css',
})
export class TecnicaAdvancedConfig {
  private readonly comentarioRepository = inject(COMENTARIO_REPOSITORY);
  private readonly tecnicaRepository = inject(TECNICA_REPOSITORY);
  private readonly resultadoAlfabeticoRepository = inject(RESULTADO_ALFABETICO_REPOSITORY);
  private readonly sexoEspecieRepository = inject(SEXO_ESPECIE_REPOSITORY);

  /** Tipo de resultado de la técnica que se está editando: decide qué pestañas tienen sentido. */
  readonly tipoResultadoId = input<string | null>(null);
  /** Id de la técnica que se está editando, para excluirla de la lista de "Disponibles". */
  readonly tecnicaId = input<string | null>(null);
  /**
   * Ids de las técnicas incluidas en esta Agrupación de pruebas. A diferencia del resto de
   * pestañas (solo estéticas por ahora), esta sí es funcional: al añadir la técnica padre a
   * una petición, se añaden automáticamente también todas estas.
   */
  readonly tecnicasAgrupadasIds = input<readonly string[]>([]);
  readonly tecnicasAgrupadasIdsChange = output<readonly string[]>();

  protected readonly activeTab = signal<AdvancedTab>('rangos');

  protected readonly mostrarAgrupaciones = computed(() => this.tipoResultadoId() === 'agrupacion-pruebas');
  protected readonly mostrarAlfabeticos = computed(() => this.tipoResultadoId() === 'alfabetico');
  protected readonly mostrarFormula = computed(() => this.tipoResultadoId() === 'calculado');

  protected readonly numerosDel1Al7 = [1, 2, 3, 4, 5, 6, 7] as const;

  protected readonly sexosEspecies = signal<readonly CatalogItem[]>([]);
  protected readonly comentarios = signal<Comentario[]>([]);
  protected readonly tecnicas = signal<Tecnica[]>([]);
  protected readonly resultadosAlfabeticos = signal<ResultadoAlfabetico[]>([]);

  /** Técnicas incluidas actualmente en la agrupación, con su ficha completa. */
  protected readonly tecnicasIncluidas = computed(() => {
    const ids = this.tecnicasAgrupadasIds();
    const porId = new Map(this.tecnicas().map((tecnica) => [tecnica.id, tecnica]));
    return ids.map((id) => porId.get(id)).filter((tecnica): tecnica is Tecnica => !!tecnica);
  });

  /** Técnicas disponibles para añadir: todas menos la propia técnica y las ya incluidas. */
  protected readonly tecnicasDisponibles = computed(() => {
    const incluidas = new Set(this.tecnicasAgrupadasIds());
    const propiaId = this.tecnicaId();
    return this.tecnicas().filter((tecnica) => tecnica.id !== propiaId && !incluidas.has(tecnica.id));
  });

  constructor() {
    void this.loadListas();
  }

  protected setTab(tab: AdvancedTab): void {
    this.activeTab.set(tab);
  }

  protected agregarAgrupada(tecnicaId: string): void {
    const actuales = this.tecnicasAgrupadasIds();
    if (actuales.includes(tecnicaId)) {
      return;
    }
    this.tecnicasAgrupadasIdsChange.emit([...actuales, tecnicaId]);
  }

  protected quitarAgrupada(tecnicaId: string): void {
    this.tecnicasAgrupadasIdsChange.emit(this.tecnicasAgrupadasIds().filter((id) => id !== tecnicaId));
  }

  private async loadListas(): Promise<void> {
    const [sexosEspecies, comentarios, tecnicas, resultadosAlfabeticos] = await Promise.all([
      this.sexoEspecieRepository.list(),
      this.comentarioRepository.list(),
      this.tecnicaRepository.list(),
      this.resultadoAlfabeticoRepository.list(),
    ]);
    this.sexosEspecies.set(
      sexosEspecies.map((item) => ({
        id: item.id,
        nombre: item.codigo ? `${item.codigo} — ${item.sexoEspecie}` : item.sexoEspecie,
      })),
    );
    this.comentarios.set(comentarios);
    this.tecnicas.set(tecnicas);
    this.resultadosAlfabeticos.set(resultadosAlfabeticos);
  }
}
