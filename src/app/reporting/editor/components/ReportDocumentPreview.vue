<script setup lang="ts">
import type { ReportDataContext } from '../../models/report-data-context.model';
import type { ReportDocument } from '../../models/report.model';
import ReportElementView from './ReportElementView.vue';

defineProps<{
  report: ReportDocument;
  data: ReportDataContext;
}>();
</script>

<template>
  <section aria-labelledby="report-preview-title">
    <h2 id="report-preview-title">Vista previa: {{ report.name }}</h2>
    <p>Renderizado con datos de ejemplo.</p>

    <article v-for="(page, index) in report.pages" :key="page.id" :aria-labelledby="`preview-page-${page.id}`">
      <h3 :id="`preview-page-${page.id}`">Página {{ index + 1 }} de {{ report.pages.length }}</h3>
      <p v-if="page.elements.length === 0">Página vacía.</p>
      <ReportElementView
        v-for="element in page.elements"
        :key="element.id"
        :element="element"
        :data="data"
        :page-number="index + 1"
        :page-count="report.pages.length"
      />
    </article>
  </section>
</template>
