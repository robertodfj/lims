<script setup lang="ts">
import { Repl, useStore, useVueImportMap } from '@vue/repl';
import CodemirrorEditor from '@vue/repl/codemirror-editor';
import '@vue/repl/style.css';

const MAIN_FILE = 'src/App.vue';

const props = defineProps<{ initialCode: string }>();

const { importMap } = useVueImportMap({
  runtimeDev: () => '/vendor/vue.runtime.esm-browser.js',
  runtimeProd: () => '/vendor/vue.runtime.esm-browser.prod.js',
});

const store = useStore({ builtinImportMap: importMap });
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
