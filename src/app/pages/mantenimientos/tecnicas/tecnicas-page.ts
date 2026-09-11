import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExcelActions } from '../../../shared/excel-actions/excel-actions';
import { Icon } from '../../../shared/icon/icon';
import { CatalogItem } from '../../../shared/searchable-select/searchable-select';
import { GRUPO_REPOSITORY } from '../grupos-tecnicas/grupos-tecnicas.tokens';
import { Tecnica } from './tecnica.model';
import { TecnicaEditDrawer } from './tecnica-edit-drawer';
import { TECNICA_REPOSITORY } from './tecnicas.tokens';

type EstadoFilter = 'todos' | 'activa' | 'no-activa';

@Component({
  selector: 'app-tecnicas-page',
  imports: [FormsModule, Icon, TecnicaEditDrawer, ExcelActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tecnicas-page.html',
  styleUrl: './tecnicas-page.css',
})
export class TecnicasPage {
  private readonly repository = inject(TECNICA_REPOSITORY);
  private readonly grupoRepository = inject(GRUPO_REPOSITORY);

  protected readonly tecnicas = signal<Tecnica[] | null>(null);

  protected readonly search = signal('');
  protected readonly estadoFilter = signal<EstadoFilter>('todos');

  protected readonly drawerOpen = signal(false);
  protected readonly editingTecnica = signal<Tecnica | null>(null);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly grupos = signal<readonly CatalogItem[]>([]);

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

  protected openNew(): void {
    this.editingTecnica.set(null);
    this.drawerOpen.set(true);
  }

  protected openEdit(tecnica: Tecnica): void {
    this.editingTecnica.set(tecnica);
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  protected async onTecnicaGuardada(): Promise<void> {
    await this.loadTecnicas();
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

  private async loadTecnicas(): Promise<void> {
    this.tecnicas.set(await this.repository.list());
  }

  private async loadCatalogs(): Promise<void> {
    const grupos = await this.grupoRepository.list();
    this.grupos.set(grupos.map((grupo) => ({ id: grupo.id, nombre: grupo.codigo ? `${grupo.codigo} — ${grupo.nombre}` : grupo.nombre })));
  }
}
