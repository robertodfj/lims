import type { Plugin } from 'esbuild';
import { resolve } from 'node:path';
import vue from 'unplugin-vue/esbuild';

/**
 * En desarrollo unplugin-vue importa un módulo virtual ("\0/plugin-vue/export-helper").
 * El watcher de `ng serve` no admite rutas con byte nulo, así que se resuelve a un archivo real.
 */
const vueExportHelperFile: Plugin = {
  name: 'vue-export-helper-file',
  setup(build) {
    build.onResolve({ filter: /\/plugin-vue\/export-helper$/ }, () => ({
      path: resolve(build.initialOptions.absWorkingDir ?? process.cwd(), 'esbuild/vue-export-helper.js'),
    }));
  },
};

/**
 * Añade al build de Angular la compilación de Single File Components (.vue).
 * Los flags de compilación de Vue (__VUE_OPTIONS_API__, etc.) están en angular.json > define.
 */
export default [vueExportHelperFile, vue()];
