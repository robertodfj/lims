import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tecnica } from '../tecnicas/tecnica.model';
import { TECNICA_REPOSITORY } from '../tecnicas/tecnicas.tokens';

interface ValoresDraft {
  codigoLaboratorio: string;
  precio: string;
  incidencias: string;
}

/** Paleta fija de colores para identificar visualmente un laboratorio de referencia. */
export const COLORES_LABORATORIO: readonly string[] = [
  '#e64980',
  '#f76707',
  '#f2c94c',
  '#2f9e44',
  '#1c7ed6',
  '#7048e8',
  '#495057',
];

/**
 * Contenido de "Configuración avanzada" de un Laboratorio de referencia: color e integración
 * asociados, y las técnicas que realiza. A diferencia de otras pestañas Avanzado, la relación
 * de técnicas NO se guarda como un array propio del laboratorio: `tecnica.laboratorioExternoId`
 * ya es el campo de esta relación (también editable desde la propia ficha de la técnica, en su
 * desplegable "Laboratorio Externo"), así que asociar/desasociar aquí escribe directamente en
 * la técnica para que las dos pantallas queden siempre sincronizadas.
 */
@Component({
  selector: 'app-laboratorio-advanced-config',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './laboratorio-advanced-config.html',
  styleUrl: './laboratorio-advanced-config.css',
})
export class LaboratorioAdvancedConfig {
  private readonly tecnicaRepository = inject(TECNICA_REPOSITORY);

  /** Id del laboratorio que se está editando; null/'' = todavía no guardado. */
  readonly laboratorioId = input<string | null>(null);
  readonly colorAsociado = input<string | null>(null);
  readonly colorAsociadoChange = output<string | null>();
  readonly programaAsociado = input('');
  readonly programaAsociadoChange = output<string>();

  protected readonly colores = COLORES_LABORATORIO;

  protected readonly tecnicas = signal<Tecnica[]>([]);
  protected readonly guardandoId = signal<string | null>(null);

  protected readonly tecnicasAsociadas = computed(() => {
    const labId = this.laboratorioId();
    return labId ? this.tecnicas().filter((tecnica) => tecnica.laboratorioExternoId === labId) : [];
  });

  protected readonly tecnicasDisponibles = computed(() => {
    const labId = this.laboratorioId();
    return this.tecnicas().filter((tecnica) => tecnica.laboratorioExternoId !== labId);
  });

  /** Id de la técnica cuyos "Valores" (código/precio/incidencias) se están editando. */
  protected readonly editandoValoresId = signal<string | null>(null);
  protected readonly valoresDraft = signal<ValoresDraft>({ codigoLaboratorio: '', precio: '', incidencias: '' });

  constructor() {
    void this.loadTecnicas();
  }

  protected async agregar(tecnicaId: string): Promise<void> {
    const labId = this.laboratorioId();
    const tecnica = this.tecnicas().find((item) => item.id === tecnicaId);
    if (!labId || !tecnica) {
      return;
    }
    await this.persistir({ ...tecnica, laboratorioExternoId: labId });
  }

  protected async quitar(tecnicaId: string): Promise<void> {
    const tecnica = this.tecnicas().find((item) => item.id === tecnicaId);
    if (!tecnica) {
      return;
    }
    if (this.editandoValoresId() === tecnicaId) {
      this.editandoValoresId.set(null);
    }
    await this.persistir({
      ...tecnica,
      laboratorioExternoId: null,
      laboratorioExternoCodigo: null,
      laboratorioExternoPrecio: null,
      laboratorioExternoIncidencias: null,
    });
  }

  protected editarValores(tecnica: Tecnica): void {
    this.editandoValoresId.set(tecnica.id);
    this.valoresDraft.set({
      codigoLaboratorio: tecnica.laboratorioExternoCodigo ?? '',
      precio: tecnica.laboratorioExternoPrecio != null ? String(tecnica.laboratorioExternoPrecio) : '',
      incidencias: tecnica.laboratorioExternoIncidencias ?? '',
    });
  }

  protected cancelarValores(): void {
    this.editandoValoresId.set(null);
  }

  protected updateValoresDraft<K extends keyof ValoresDraft>(key: K, value: ValoresDraft[K]): void {
    this.valoresDraft.update((current) => ({ ...current, [key]: value }));
  }

  protected async guardarValores(tecnica: Tecnica): Promise<void> {
    const draft = this.valoresDraft();
    const precio = draft.precio.trim() ? Number(draft.precio) : null;
    await this.persistir({
      ...tecnica,
      laboratorioExternoCodigo: draft.codigoLaboratorio.trim() || null,
      laboratorioExternoPrecio: precio != null && Number.isFinite(precio) ? precio : null,
      laboratorioExternoIncidencias: draft.incidencias.trim() || null,
    });
    this.editandoValoresId.set(null);
  }

  private async persistir(tecnica: Tecnica): Promise<void> {
    this.guardandoId.set(tecnica.id);
    try {
      const guardada = await this.tecnicaRepository.save(tecnica);
      this.tecnicas.update((current) => current.map((item) => (item.id === guardada.id ? guardada : item)));
    } finally {
      this.guardandoId.set(null);
    }
  }

  private async loadTecnicas(): Promise<void> {
    this.tecnicas.set(await this.tecnicaRepository.list());
  }
}
