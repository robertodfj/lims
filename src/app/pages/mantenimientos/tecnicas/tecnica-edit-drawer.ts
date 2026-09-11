import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { Drawer } from '../../../shared/drawer/drawer';
import { DrawerFormFooter } from '../../../shared/drawer-form-footer/drawer-form-footer';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { CONTENEDOR_REPOSITORY } from '../contenedores/contenedores.tokens';
import { GRUPO_REPOSITORY } from '../grupos-tecnicas/grupos-tecnicas.tokens';
import { LABORATORIO_REFERENCIA_REPOSITORY } from '../laboratorios-referencia/laboratorios-referencia.tokens';
import { SEXO_ESPECIE_REPOSITORY } from '../sexo-especie/sexo-especie.tokens';
import { SUBGRUPO_REPOSITORY } from '../subgrupos/subgrupos.tokens';
import { TecnicaAdvancedConfig } from './tecnica-advanced-config';
import { createEmptyTecnica, Tecnica } from './tecnica.model';
import { TECNICA_REPOSITORY } from './tecnicas.tokens';

/**
 * Formulario de alta/edición de una técnica, autocontenido (carga sus propios catálogos y
 * guarda directamente en TECNICA_REPOSITORY). Se usa tanto en Mantenimientos / Técnicas como
 * en la línea de una técnica dentro de una Petición, para que sea exactamente el mismo
 * formulario en los dos sitios.
 */
@Component({
  selector: 'app-tecnica-edit-drawer',
  imports: [FormsModule, Drawer, SearchableSelect, DrawerFormFooter, TecnicaAdvancedConfig],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tecnica-edit-drawer.html',
  styleUrl: './tecnica-edit-drawer.css',
})
export class TecnicaEditDrawer {
  private readonly repository = inject(TECNICA_REPOSITORY);
  private readonly catalogService = inject(CatalogService);
  private readonly contenedorRepository = inject(CONTENEDOR_REPOSITORY);
  private readonly laboratorioReferenciaRepository = inject(LABORATORIO_REFERENCIA_REPOSITORY);
  private readonly grupoRepository = inject(GRUPO_REPOSITORY);
  private readonly subgrupoRepository = inject(SUBGRUPO_REPOSITORY);
  private readonly sexoEspecieRepository = inject(SEXO_ESPECIE_REPOSITORY);

  readonly open = input(false);
  /** Técnica a editar; null = alta de una técnica nueva. */
  readonly tecnica = input<Tecnica | null>(null);
  readonly closed = output<void>();
  readonly saved = output<Tecnica>();

  protected readonly draft = signal<Tecnica>(createEmptyTecnica());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);

  protected readonly grupos = signal<readonly CatalogItem[]>([]);
  protected readonly subgrupos = signal<readonly CatalogItem[]>([]);
  protected readonly tiposResultado = signal<readonly CatalogItem[]>([]);
  protected readonly laboratoriosExternos = signal<readonly CatalogItem[]>([]);
  protected readonly contenedores = signal<readonly CatalogItem[]>([]);
  protected readonly sexosEspecies = signal<readonly CatalogItem[]>([]);

  constructor() {
    void this.loadCatalogs();

    effect(() => {
      if (!this.open()) {
        return;
      }
      const tecnica = this.tecnica();
      if (tecnica) {
        this.draft.set({ ...tecnica });
      } else {
        this.draft.set(createEmptyTecnica());
        void this.generateCodigo();
      }
    });
  }

  protected requestClose(): void {
    this.closed.emit();
  }

  protected async generateCodigo(): Promise<void> {
    this.generatingCodigo.set(true);
    try {
      const codigo = await this.repository.nextCodigo();
      this.updateDraft('codigo', codigo);
    } finally {
      this.generatingCodigo.set(false);
    }
  }

  protected async save(): Promise<void> {
    const value = this.draft();
    // Grupo y tipo de resultado se marcan como obligatorios en el formulario, pero sus
    // catálogos (grupos.json/tipos-resultado.json) pueden estar todavía sin datos: no
    // bloqueamos el guardado por un campo que hoy puede no tener nada que seleccionar. Nº
    // decimales tampoco bloquea porque solo aplica a técnicas de tipo Numérico.
    if (!value.nombre.trim()) {
      return;
    }

    this.saving.set(true);
    try {
      const saved = await this.repository.save(value);
      this.saved.emit(saved);
      this.closed.emit();
    } finally {
      this.saving.set(false);
    }
  }

  protected updateDraft<K extends keyof Tecnica>(key: K, value: Tecnica[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadCatalogs(): Promise<void> {
    const [grupos, subgrupos, tiposResultado, laboratoriosExternos, contenedores, sexosEspecies] = await Promise.all([
      this.grupoRepository.list(),
      this.subgrupoRepository.list(),
      this.catalogService.load('tipos-resultado'),
      this.laboratorioReferenciaRepository.list(),
      this.contenedorRepository.list(),
      this.sexoEspecieRepository.list(),
    ]);
    this.grupos.set(grupos.map((grupo) => ({ id: grupo.id, nombre: grupo.codigo ? `${grupo.codigo} — ${grupo.nombre}` : grupo.nombre })));
    this.subgrupos.set(
      subgrupos.map((subgrupo) => ({
        id: subgrupo.id,
        nombre: subgrupo.codigo ? `${subgrupo.codigo} — ${subgrupo.nombre}` : subgrupo.nombre,
      })),
    );
    this.tiposResultado.set(tiposResultado);
    this.laboratoriosExternos.set(
      laboratoriosExternos.map((laboratorio) => ({
        id: laboratorio.id,
        nombre: laboratorio.codigo ? `${laboratorio.codigo} — ${laboratorio.nombre}` : laboratorio.nombre,
      })),
    );
    this.contenedores.set(contenedores.map((contenedor) => ({ id: contenedor.id, nombre: contenedor.nombre })));
    this.sexosEspecies.set(
      sexosEspecies.map((item) => ({
        id: item.id,
        nombre: item.codigo ? `${item.codigo} — ${item.sexoEspecie}` : item.sexoEspecie,
      })),
    );
  }
}
