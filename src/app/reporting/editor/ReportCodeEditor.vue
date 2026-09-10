<script setup lang="ts">
import { Repl, mergeImportMap, useStore, useVueImportMap } from '@vue/repl';
import CodemirrorEditor from '@vue/repl/codemirror-editor';
import '@vue/repl/style.css';
import { computed } from 'vue';

const MAIN_FILE = 'src/App.vue';

/** Módulo con los datos del informe (mock hoy, API real mañana) disponible desde el código editado. */
const REPORT_DATA_IMPORT_MAP = { imports: { 'lims:report-data': '/vendor/lims-report-data.js' } };

const props = defineProps<{ initialCode: string }>();

const { importMap: vueImportMap } = useVueImportMap({
  runtimeDev: () => '/vendor/vue.runtime.esm-browser.js',
  runtimeProd: () => '/vendor/vue.runtime.esm-browser.prod.js',
});
const builtinImportMap = computed(() => mergeImportMap(vueImportMap.value, REPORT_DATA_IMPORT_MAP));

const store = useStore({ builtinImportMap });
void store.setFiles({ [MAIN_FILE]: props.initialCode }, MAIN_FILE);

defineExpose({
  getCode: () => store.files[MAIN_FILE].code,
});
</script>

<template>
  <Repl
    :store="store"
    :editor="CodemirrorEditor"
    :show-compile-output="false"
    :show-import-map="false"
    :show-tsconfig="false"
    :show-open-source-map="false"
    :show-ssr-output="false"
    :ssr="false"
    theme="light"
    layout="horizontal"
  />
</template>
