import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/mock-db/catalog.service';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem, SearchableSelect } from '../../../shared/searchable-select/searchable-select';
import { CONTENEDOR_REPOSITORY } from '../contenedores/contenedores.tokens';
import { GRUPO_REPOSITORY } from '../grupos-tecnicas/grupos-tecnicas.tokens';
import { LABORATORIO_REFERENCIA_REPOSITORY } from '../laboratorios-referencia/laboratorios-referencia.tokens';
import { SUBGRUPO_REPOSITORY } from '../subgrupos/subgrupos.tokens';
import { createEmptyTecnica, Tecnica } from './tecnica.model';
import { TECNICA_REPOSITORY } from './tecnicas.tokens';

type EstadoFilter = 'todos' | 'activa' | 'no-activa';

@Component({
  selector: 'app-tecnicas-page',
  imports: [FormsModule, Icon, Drawer, SearchableSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tecnicas-page.html',
  styleUrl: './tecnicas-page.css',
})
export class TecnicasPage {
  private readonly repository = inject(TECNICA_REPOSITORY);
  private readonly catalogService = inject(CatalogService);
  private readonly contenedorRepository = inject(CONTENEDOR_REPOSITORY);
  private readonly laboratorioReferenciaRepository = inject(LABORATORIO_REFERENCIA_REPOSITORY);
  private readonly grupoRepository = inject(GRUPO_REPOSITORY);
  private readonly subgrupoRepository = inject(SUBGRUPO_REPOSITORY);

  protected readonly tecnicas = signal<Tecnica[] | null>(null);

  protected readonly search = signal('');
  protected readonly estadoFilter = signal<EstadoFilter>('todos');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<Tecnica>(createEmptyTecnica());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly grupos = signal<readonly CatalogItem[]>([]);
  protected readonly subgrupos = signal<readonly CatalogItem[]>([]);
  protected readonly tiposResultado = signal<readonly CatalogItem[]>([]);
  protected readonly laboratoriosExternos = signal<readonly CatalogItem[]>([]);
  protected readonly contenedores = signal<readonly CatalogItem[]>([]);
  protected readonly especies = signal<readonly CatalogItem[]>([]);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const estado = this.estadoFilter();
    const grupos = this.grupos();

    return (this.tecnicas() ?? [])
      .filter((tecnica) => {
        if (estado === 'activa') return !tecnica.noActiva;
        if (estado === 'no-activa') return tecnica.noActiva;
        return true;
      })
      .filter(
        (tecnica) =>
          !term || tecnica.nombre.toLowerCase().includes(term) || tecnica.codigo.toLowerCase().includes(term),
      )
      .map((tecnica) => ({
        tecnica,
        grupoNombre: grupos.find((grupo) => grupo.id === tecnica.grupoId)?.nombre ?? '—',
      }));
  });

  constructor() {
    void this.loadTecnicas();
    void this.loadCatalogs();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptyTecnica());
    this.drawerOpen.set(true);
    await this.generateCodigo();
  }

  protected openEdit(tecnica: Tecnica): void {
    this.draft.set({ ...tecnica });
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
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
    // bloqueamos el guardado por un campo que hoy puede no tener nada que seleccionar.
    if (!value.nombre.trim() || value.numDecimales == null) {
      return;
    }

    this.saving.set(true);
    try {
      await this.repository.save(value);
      this.drawerOpen.set(false);
      await this.loadTecnicas();
    } finally {
      this.saving.set(false);
    }
  }

  protected requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  protected cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  protected async confirmDelete(id: string): Promise<void> {
    await this.repository.delete(id);
    this.confirmDeleteId.set(null);
    await this.loadTecnicas();
  }

  protected updateDraft<K extends keyof Tecnica>(key: K, value: Tecnica[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadTecnicas(): Promise<void> {
    this.tecnicas.set(await this.repository.list());
  }

  private async loadCatalogs(): Promise<void> {
    const [grupos, subgrupos, tiposResultado, laboratoriosExternos, contenedores, especies] = await Promise.all([
      this.grupoRepository.list(),
      this.subgrupoRepository.list(),
      this.catalogService.load('tipos-resultado'),
      this.laboratorioReferenciaRepository.list(),
      this.contenedorRepository.list(),
      this.catalogService.load('especies'),
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
    this.especies.set(especies);
  }
}
