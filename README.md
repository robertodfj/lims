# LIMS — Fase 1 (base estructural)

Angular 22 como aplicación principal y editor de Reporting en Vue 3, compilado por el mismo build de Angular.

## Requisitos
- Node.js >= 22.22.3 (o >= 24.15.0) — exigido por Angular 22.
- npm 11 recomendado (npm 10 puede fallar con `Cannot read properties of null (reading 'edgesOut')`).

## Comandos
- `npm install`
- `npm start` — servidor de desarrollo en http://localhost:4200
- `npm run build` — build de producción
- `npm test -- --watch=false` — tests unitarios (Vitest)
- `npm run typecheck:reporting` — comprobación de tipos de los `.vue` (vue-tsc)
- `npm run check` — typecheck + build + tests

## Integración Vue
- `angular.json` usa `@angular-builders/custom-esbuild` y carga `esbuild/vue.plugin.ts` (unplugin-vue).
- Flags de Vue en `angular.json > build > options > define`.
- `src/app/reporting/pages/report-editor-host` monta `ReportEditor.vue` mediante `mountReportEditor()`.
- Persistencia: token `REPORT_REPOSITORY` (hoy localStorage, clave `lims.reporting.documents`).
