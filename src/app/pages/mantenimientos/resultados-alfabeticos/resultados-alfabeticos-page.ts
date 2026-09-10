import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../shared/drawer/drawer';
import { Icon } from '../../../shared/icon/icon';
import { createEmptyResultadoAlfabetico, ResultadoAlfabetico } from './resultado-alfabetico.model';
import { RESULTADO_ALFABETICO_REPOSITORY } from './resultados-alfabeticos.tokens';

@Component({
  selector: 'app-resultados-alfabeticos-page',
  imports: [FormsModule, Icon, Drawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resultados-alfabeticos-page.html',
  styleUrl: './resultados-alfabeticos-page.css',
})
export class ResultadosAlfabeticosPage {
  private readonly repository = inject(RESULTADO_ALFABETICO_REPOSITORY);

  protected readonly resultados = signal<ResultadoAlfabetico[] | null>(null);

  protected readonly search = signal('');

  protected readonly drawerOpen = signal(false);
  protected readonly draft = signal<ResultadoAlfabetico>(createEmptyResultadoAlfabetico());
  protected readonly saving = signal(false);
  protected readonly generatingCodigo = signal(false);
  protected readonly confirmDeleteId = signal<string | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return (this.resultados() ?? []).filter(
      (resultado) => !term || resultado.texto.toLowerCase().includes(term) || resultado.codigo.toLowerCase().includes(term),
    );
  });

  constructor() {
    void this.loadResultados();
  }

  protected async openNew(): Promise<void> {
    this.draft.set(createEmptyResultadoAlfabetico());
    this.drawerOpen.set(true);
    await this.generateCodigo();
  }

  protected openEdit(resultado: ResultadoAlfabetico): void {
    this.draft.set({ ...resultado });
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
    if (!value.texto.trim()) {
      return;
    }

    this.saving.set(true);
    try {
      await this.repository.save(value);
      this.drawerOpen.set(false);
      await this.loadResultados();
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
    await this.loadResultados();
  }

  protected updateDraft<K extends keyof ResultadoAlfabetico>(key: K, value: ResultadoAlfabetico[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  private async loadResultados(): Promise<void> {
    this.resultados.set(await this.repository.list());
  }
}
