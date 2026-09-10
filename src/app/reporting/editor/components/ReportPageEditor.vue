<script setup lang="ts">
import { REPORT_ELEMENT_CATALOG } from '../../models/report-factory';
import type { ReportDataContext } from '../../models/report-data-context.model';
import type { ReportPage } from '../../models/report.model';
import ReportElementView from './ReportElementView.vue';

defineProps<{
  page: ReportPage;
  pageNumber: number;
  pageCount: number;
  data: ReportDataContext;
}>();

const emit = defineEmits<{ removeElement: [elementId: string] }>();
</script>

<template>
  <p v-if="page.elements.length === 0">Esta página no tiene elementos. Añade uno desde la lista anterior.</p>

  <section
    v-for="element in page.elements"
    :key="element.id"
    :aria-labelledby="`element-title-${element.id}`"
  >
    <h3 :id="`element-title-${element.id}`">{{ REPORT_ELEMENT_CATALOG[element.type].label }}</h3>
    <ReportElementView :element="element" :data="data" :page-number="pageNumber" :page-count="pageCount" />
    <button
      type="button"
      :aria-label="`Eliminar ${REPORT_ELEMENT_CATALOG[element.type].label.toLowerCase()}`"
      @click="emit('removeElement', element.id)"
    >
      Eliminar elemento
    </button>
  </section>
</template>
