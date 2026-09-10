// Copia del helper `_export_sfc` de unplugin-vue / @vitejs/plugin-vue.
// Ver esbuild/vue.plugin.ts (vueExportHelperFile).
export default (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, value] of props) {
    target[key] = value;
  }
  return target;
};
