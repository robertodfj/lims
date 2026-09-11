import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PACIENTE_REPOSITORY } from '../../../pages/mantenimientos/base-pacientes/base-pacientes.tokens';
import { PETICIONARIO_REPOSITORY } from '../../../pages/mantenimientos/peticionarios/peticionarios.tokens';
import { SOCIEDAD_REPOSITORY } from '../../../pages/mantenimientos/sociedades/sociedades.tokens';
import { TECNICA_REPOSITORY } from '../../../pages/mantenimientos/tecnicas/tecnicas.tokens';
import { PETICION_REPOSITORY } from '../../../pages/proceso-diario/peticiones-resultados/peticiones.tokens';
import { Icon } from '../../../shared/icon/icon';
import { buildReportData, buildReportDataModuleCode } from '../../print/report-data';
import { REPORT_REPOSITORY } from '../../services/reporting.tokens';

interface ReadyState {
  readonly code: string;
  readonly dataUrl: string;
}

/** Ancho del "folio" en la previsualización, en px — debe coincidir con report-print-page.css. */
const SHEET_WIDTH_PX = 830;
/** Alto de un folio A4 a ese mismo ancho (proporción 1:√2), para que cada página de la
 * previsualización tenga forma de hoja real en vez de un bloque que termina donde acaba el
 * contenido. */
const SHEET_HEIGHT_PX = Math.round(SHEET_WIDTH_PX * Math.SQRT2);

/**
 * Vista de impresión: se abre en una pestaña nueva desde el botón "Imprimir" de una
 * petición. Monta el informe elegido (código .vue guardado en Reporting) con los datos
 * reales de esa petición y ofrece un botón "Imprimir" que usa el diálogo nativo del
 * navegador (permite guardar como PDF). Es una ruta de nivel superior, fuera de AppLayout,
 * para que no aparezcan el menú lateral ni el resto del chrome de la aplicación.
 */
@Component({
  selector: 'app-report-print-page',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-print-page.html',
  styleUrl: './report-print-page.css',
})
export class ReportPrintPage implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly reportRepository = inject(REPORT_REPOSITORY);
  private readonly peticionRepository = inject(PETICION_REPOSITORY);
  private readonly pacienteRepository = inject(PACIENTE_REPOSITORY);
  private readonly sociedadRepository = inject(SOCIEDAD_REPOSITORY);
  private readonly peticionarioRepository = inject(PETICIONARIO_REPOSITORY);
  private readonly tecnicaRepository = inject(TECNICA_REPOSITORY);

  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly ready = signal<ReadyState | null>(null);

  /** Nº de folios que ocupa el informe, para dibujar los cortes de página en la previsualización. */
  protected readonly pageCount = signal(1);
  protected readonly pageBreaks = computed(() =>
    Array.from({ length: Math.max(0, this.pageCount() - 1) }, (_, index) => (index + 1) * SHEET_HEIGHT_PX),
  );
  /**
   * Alto mínimo (solo en pantalla) para que la hoja que envuelve al iframe llegue hasta el
   * siguiente folio completo aunque el informe sea más corto. Nunca se aplica al iframe en sí
   * — eso fue lo que causaba una página en blanco de más al imprimir/exportar a PDF: el
   * navegador paginaba ese alto extra "de mentira" como si fuera contenido real. En impresión
   * esta propiedad se ignora (ver @media print) y el iframe imprime solo su alto real.
   */
  protected readonly sheetMinHeight = computed(() => this.pageCount() * SHEET_HEIGHT_PX);

  private readonly previewMount = viewChild<ElementRef<HTMLElement>>('previewMount');
  private unmountPreview: (() => void) | null = null;
  private dataBlobUrl: string | null = null;
  private autoHeightTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    void this.init();

    // Import diferido: el motor de Vue (@vue/repl) solo se carga en esta ruta de impresión.
    afterRenderEffect(() => {
      const ready = this.ready();
      const target = this.previewMount()?.nativeElement;

      untracked(() => {
        if (ready && target && !this.unmountPreview) {
          void import('../../print/mount-report-preview').then(({ mountReportPreview }) => {
            if (this.ready() === ready) {
              this.unmountPreview = mountReportPreview(target, ready.code, ready.dataUrl);
              this.startAutoHeight(target);
            }
          });
        }
      });
    });
  }

  protected imprimir(): void {
    window.print();
  }

  ngOnDestroy(): void {
    if (this.autoHeightTimer !== null) {
      clearTimeout(this.autoHeightTimer);
    }
    this.unmountPreview?.();
    if (this.dataBlobUrl) {
      URL.revokeObjectURL(this.dataBlobUrl);
    }
  }

  /**
   * El sandbox de @vue/repl renderiza el informe dentro de un <iframe>: en pantalla se ve
   * bien porque el iframe tiene una altura mínima fija, pero al imprimir el navegador solo
   * captura lo que quepa dentro de esa caja (no pagina el contenido interno del iframe). Por
   * eso ajustamos la altura del iframe a la de su contenido real (nunca redondeada: forzar el
   * iframe a un múltiplo de folio metía altura "de mentira" que el navegador paginaba como si
   * fuera contenido, generando una página en blanco de más al imprimir/exportar a PDF).
   *
   * `pageCount` sí redondea hacia arriba, pero solo se usa para el alto mínimo *visual* del
   * envoltorio (sheetMinHeight, solo pantalla) y para las líneas de "fin de página": así en
   * pantalla se ve un folio entero aunque el informe sea más corto, sin tocar lo que se
   * imprime de verdad.
   */
  private startAutoHeight(target: HTMLElement): void {
    let lastRawHeight = 0;
    let unchangedTicks = 0;
    let totalTicks = 0;
    const maxTicks = 50; // ~10s de margen por si el informe tarda en compilar/montar

    const tick = (): void => {
      totalTicks += 1;
      const iframe = target.querySelector('iframe');
      const doc = iframe?.contentDocument;
      const rawHeight = doc
        ? Math.max(doc.documentElement.scrollHeight, doc.body?.scrollHeight ?? 0)
        : 0;

      if (iframe && rawHeight > 0) {
        if (rawHeight !== lastRawHeight) {
          iframe.style.height = `${rawHeight}px`;
          this.pageCount.set(Math.max(1, Math.ceil(rawHeight / SHEET_HEIGHT_PX)));
          lastRawHeight = rawHeight;
          unchangedTicks = 0;
        } else {
          unchangedTicks += 1;
        }
      }

      // Sigue comprobando hasta que la altura se estabilice (el informe puede tardar en
      // compilarse/montarse la primera vez), con un tope por si nunca llega a renderizar.
      if (unchangedTicks < 10 && totalTicks < maxTicks) {
        this.autoHeightTimer = setTimeout(tick, 200);
      }
    };

    tick();
  }

  private async init(): Promise<void> {
    const reportId = this.route.snapshot.paramMap.get('reportId');
    const peticionId = this.route.snapshot.paramMap.get('peticionId');
    if (!reportId || !peticionId) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }

    const [report, peticion] = await Promise.all([
      this.reportRepository.get(reportId),
      this.peticionRepository.get(peticionId),
    ]);
    if (!report || !peticion) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }

    const [paciente, sociedad, peticionario, tecnicas] = await Promise.all([
      peticion.pacienteId ? this.pacienteRepository.get(peticion.pacienteId) : Promise.resolve(null),
      peticion.sociedadId ? this.sociedadRepository.get(peticion.sociedadId) : Promise.resolve(null),
      peticion.peticionarioId ? this.peticionarioRepository.get(peticion.peticionarioId) : Promise.resolve(null),
      this.tecnicaRepository.list(),
    ]);

    const data = buildReportData(peticion, paciente, sociedad, peticionario, tecnicas);
    const moduleCode = buildReportDataModuleCode(data);
    this.dataBlobUrl = URL.createObjectURL(new Blob([moduleCode], { type: 'application/javascript' }));

    this.loading.set(false);
    this.ready.set({ code: report.code, dataUrl: this.dataBlobUrl });
  }
}
