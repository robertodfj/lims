<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { createNewReport } from '../models/report-factory';
import type { ReportDataContext } from '../models/report-data-context.model';
import type { ReportRepository } from '../services/report-repository';
import ReportDocumentPreview from './components/ReportDocumentPreview.vue';
import ReportElementToolbox from './components/ReportElementToolbox.vue';
import ReportPageEditor from './components/ReportPageEditor.vue';
import ReportPageList from './components/ReportPageList.vue';
import { useReportEditor } from './composables/use-report-editor';

type EditorMode = 'edit' | 'preview';
type LoadState = 'loading' | 'ready' | 'not-found' | 'error';

const props = defineProps<{
  /** null = informe nuevo. */
  reportId: string | null;
  repository: ReportRepository;
  data: ReportDataContext;
}>();

const emit = defineEmits<{ saved: [reportId: string] }>();

const {
  report,
  activePageId,
  activePage,
  activePageIndex,
  pageCount,
  canRemovePage,
  loadReport,
  applySaved,
  selectPage,
  addPage,
  removePage,
  addElement,
  removeElement,
} = useReportEditor(createNewReport());

const loadState = ref<LoadState>(props.reportId ? 'loading' : 'ready');
const mode = ref<EditorMode>('edit');
const saving = ref(false);
const statusMessage = ref('');

const lastSavedLabel = computed(() =>
  report.value.updatedAt ? new Date(report.value.updatedAt).toLocaleString('es-ES') : null,
);

onMounted(async () => {
  if (!props.reportId) {
    return;
  }
  try {
    const stored = await props.repository.get(props.reportId);
    if (stored) {
      loadReport(stored);
      loadState.value = 'ready';
    } else {
      loadState.value = 'not-found';
    }
  } catch {
    loadState.value = 'error';
  }
});

async function saveReport(): Promise<void> {
  saving.value = true;
  try {
    const saved = await props.repository.save(report.value);
    applySaved(saved);
    statusMessage.value = 'Informe guardado.';
    emit('saved', saved.id);
  } catch {
    statusMessage.value = 'No se pudo guardar el informe. Comprueba el espacio disponible del navegador.';
  } finally {
    saving.value = false;
  }
}

function togglePreview(): void {
  mode.value = mode.value === 'edit' ? 'preview' : 'edit';
}

/**
 * Punto de extensión para la siguiente fase:
 * documento + datos reales -> HTML renderizado (ReportDocumentPreview) -> servicio de generación de PDF.
 */
function generatePdf(): void {
  statusMessage.value = 'Generación de PDF preparada para la siguiente fase.';
}
</script>

<template>
  <section aria-labelledby="report-editor-title">
    <h1 id="report-editor-title">Editor de informes</h1>

    <p v-if="loadState === 'loading'">Cargando informe…</p>
    <p v-else-if="loadState === 'not-found'">No existe ningún informe guardado con el identificador {{ reportId }}.</p>
    <p v-else-if="loadState === 'error'">No se pudo leer el informe guardado. Recarga la página para reintentarlo.</p>

    <template v-else>
      <p>
        <label>
          Nombre del informe
          <input v-model="report.name" type="text" :disabled="mode === 'preview'" />
        </label>
      </p>

      <div role="toolbar" aria-label="Acciones del informe">
        <button type="button" :disabled="saving" @click="saveReport">Guardar</button>
        <button type="button" @click="togglePreview">
          {{ mode === 'edit' ? 'Vista previa' : 'Volver a edición' }}
        </button>
        <button type="button" @click="generatePdf">Generar PDF</button>
      </div>

      <p>
        Modo: {{ mode === 'edit' ? 'edición' : 'vista previa' }}.
        {{ lastSavedLabel ? `Guardado por última vez: ${lastSavedLabel}.` : 'Sin guardar.' }}
      </p>
      <p role="status">{{ statusMessage }}</p>

      <template v-if="mode === 'edit'">
        <ReportPageList
          :pages="report.pages"
          :active-page-id="activePageId"
          :can-remove="canRemovePage"
          @select="selectPage"
          @add="addPage"
          @remove="removePage"
        />

        <section aria-labelledby="active-page-title">
          <h2 id="active-page-title">Documento activo: página {{ activePageIndex + 1 }} de {{ pageCount }}</h2>
          <ReportElementToolbox @add="addElement" />
          <ReportPageEditor
            :page="activePage"
            :page-number="activePageIndex + 1"
            :page-count="pageCount"
            :data="data"
            @remove-element="removeElement"
          />
        </section>
      </template>

      <ReportDocumentPreview v-else :report="report" :data="data" />
    </template>
  </section>
</template>
