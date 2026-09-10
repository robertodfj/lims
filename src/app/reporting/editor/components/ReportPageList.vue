<script setup lang="ts">
import type { ReportPage } from '../../models/report.model';

defineProps<{
  pages: ReportPage[];
  activePageId: string;
  canRemove: boolean;
}>();

const emit = defineEmits<{
  select: [pageId: string];
  add: [];
  remove: [pageId: string];
}>();
</script>

<template>
  <section aria-labelledby="report-pages-title">
    <h2 id="report-pages-title">Páginas</h2>
    <ol>
      <li v-for="(page, index) in pages" :key="page.id">
        <button
          type="button"
          :aria-current="page.id === activePageId ? 'true' : undefined"
          @click="emit('select', page.id)"
        >
          Página {{ index + 1 }}<template v-if="page.id === activePageId"> (activa)</template>
        </button>
        <button
          type="button"
          :disabled="!canRemove"
          :aria-label="`Eliminar página ${index + 1}`"
          @click="emit('remove', page.id)"
        >
          Eliminar
        </button>
      </li>
    </ol>
    <button type="button" @click="emit('add')">+ Nueva página</button>
  </section>
</template>
