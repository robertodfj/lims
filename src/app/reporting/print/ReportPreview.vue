<script setup lang="ts">
import { mergeImportMap, Sandbox, useStore, useVueImportMap } from '@vue/repl';
import { computed } from 'vue';

const MAIN_FILE = 'src/App.vue';

const props = defineProps<{
  code: string;
  /** URL (típicamente un blob: de la propia petición) que resuelve `lims:report-data`. */
  reportDataUrl: string;
}>();

const { importMap: vueImportMap } = useVueImportMap({
  runtimeDev: () => '/vendor/vue.runtime.esm-browser.js',
  runtimeProd: () => '/vendor/vue.runtime.esm-browser.prod.js',
});
const builtinImportMap = computed(() =>
  mergeImportMap(vueImportMap.value, { imports: { 'lims:report-data': props.reportDataUrl } }),
);

const store = useStore({ builtinImportMap });
void store.setFiles({ [MAIN_FILE]: props.code }, MAIN_FILE);
</script>

<template>
  <Sandbox :store="store" :show="true" :ssr="false" />
</template>
