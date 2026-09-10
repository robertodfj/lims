// Permite que el compilador de Angular resuelva los imports de archivos .vue.
// El tipado real de los componentes lo comprueba vue-tsc (npm run typecheck:reporting).
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
