<script setup lang="ts">
import { REPORT_ELEMENT_CATALOG, REPORT_ELEMENT_TYPES } from '../../models/report-factory';
import type { ReportElementType } from '../../models/report.model';

const emit = defineEmits<{ add: [type: ReportElementType] }>();
</script>

<template>
  <fieldset>
    <legend>Añadir elemento a esta página</legend>
    <button v-for="type in REPORT_ELEMENT_TYPES" :key="type" type="button" @click="emit('add', type)">
      + Añadir {{ REPORT_ELEMENT_CATALOG[type].label.toLowerCase() }}
    </button>
  </fieldset>
</template>
