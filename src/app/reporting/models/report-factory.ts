import { ReportDocument } from './report.model';

/** Contenido inicial de todo informe nuevo: un componente Vue de un único archivo. */
export const STARTER_REPORT_CODE = `<script setup lang="ts">
//
</script>

<template>
  <div class="report">
    <h1>Informe nuevo</h1>
  </div>
</template>

<style scoped>
.report {
  font-family: sans-serif;
  padding: 24px;
}
</style>
`;

export function createNewReport(name: string): ReportDocument {
  return {
    id: null,
    name,
    code: STARTER_REPORT_CODE,
  };
}
