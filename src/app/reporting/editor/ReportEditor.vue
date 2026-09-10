<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { createNewReport } from '../models/report-factory';
import type { ReportDataContext } from '../models/report-data-context.model';
import type { ReportDocument } from '../models/report.model';
import type { ReportRepository } from '../services/report-repository';

type LoadState = 'loading' | 'ready' | 'not-found' | 'error';

const props = defineProps<{
  /** null = informe nuevo. */
  reportId: string | null;
  repository: ReportRepository;
  data: ReportDataContext;
}>();

const emit = defineEmits<{ saved: [reportId: string] }>();

const report = ref<ReportDocument>(createNewReport());
const loadState = ref<LoadState>(props.reportId ? 'loading' : 'ready');
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
      report.value = stored;
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
    report.value = saved;
    statusMessage.value = 'Informe guardado.';
    emit('saved', saved.id);
  } catch {
    statusMessage.value = 'No se pudo guardar el informe. Comprueba el espacio disponible del navegador.';
  } finally {
    saving.value = false;
  }
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
          <input v-model="report.name" type="text" />
        </label>
      </p>

      <div role="toolbar" aria-label="Acciones del informe">
        <button type="button" :disabled="saving" @click="saveReport">Guardar</button>
      </div>

      <p>{{ lastSavedLabel ? `Guardado por última vez: ${lastSavedLabel}.` : 'Sin guardar.' }}</p>
      <p role="status">{{ statusMessage }}</p>
    </template>
  </section>
</template>
