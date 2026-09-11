import { ReportDocument } from './report.model';

/**
 * Contenido inicial de todo informe nuevo: un componente Vue de un único archivo.
 * `lims:report-data` expone los datos del informe (peticionario, muestra, resultados,
 * firma...) con la misma forma que tendrán cuando vengan de la API real: hoy son mock,
 * pero el código del informe ya se escribe como si la conexión existiera.
 */
export const STARTER_REPORT_CODE = `<script setup lang="ts">
import { useReportData } from 'lims:report-data'

const data = useReportData()
</script>

<template>
  <div class="report">
    <div class="report__accent-bar" />

    <header class="report__header">
      <div class="report__brand">
        <img class="report__logo" :src="data.laboratorio.logoUrl" alt="" />
        <div>
          <h1 class="report__lab-name">{{ data.laboratorio.nombre }}</h1>
          <p class="report__lab-tagline">Informe de resultados de laboratorio</p>
        </div>
      </div>
      <div class="report__informe-badge">
        <span class="report__informe-badge-label">Nº informe</span>
        <span class="report__informe-badge-value">{{ data.informe.numero }}</span>
      </div>
    </header>

    <section class="report__cards">
      <div class="report__card">
        <div class="report__card-title">Peticionario</div>
        <p class="report__card-main">{{ data.peticionario.nombre }}</p>
        <p class="report__card-sub">{{ data.peticionario.direccion || '—' }}</p>
        <p class="report__card-sub">CIF: {{ data.peticionario.cif || '—' }}</p>
      </div>

      <div class="report__card">
        <div class="report__card-title">Muestra</div>
        <dl class="report__card-grid">
          <dt>Código</dt>
          <dd>{{ data.muestra.codigo }}</dd>
          <dt>Matriz</dt>
          <dd>{{ data.muestra.matriz || '—' }}</dd>
          <dt>Recepción</dt>
          <dd>{{ data.muestra.fechaRecepcion }} {{ data.muestra.horaRecepcion }}</dd>
        </dl>
      </div>
    </section>

    <section class="report__dates">
      <span>Orden: <strong>{{ data.informe.orden || '—' }}</strong></span>
      <span>Inicio análisis: <strong>{{ data.informe.fechaInicioAnalisis || '—' }}</strong></span>
      <span>Fin análisis: <strong>{{ data.informe.fechaFinAnalisis || '—' }}</strong></span>
      <span>Emisión informe: <strong>{{ data.informe.fechaEmisionInforme || '—' }}</strong></span>
    </section>

    <section class="report__section">
      <div class="report__section-title">Resultados</div>
      <table class="report__table">
        <thead>
          <tr>
            <th>Parámetro</th>
            <th class="is-num">Valor</th>
            <th>Unidad</th>
            <th>Referencia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resultado in data.resultados" :key="resultado.parametro">
            <td class="report__table-parametro">{{ resultado.parametro }}</td>
            <td class="is-num report__table-valor">{{ resultado.valor }}</td>
            <td class="report__table-muted">{{ resultado.unidad || '—' }}</td>
            <td class="report__table-muted">{{ resultado.referencia || '—' }}</td>
          </tr>
          <tr v-if="data.resultados.length === 0">
            <td colspan="4" class="report__table-empty">Sin resultados todavía.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <footer class="report__footer">
      <div class="report__signature-block">
        <img class="report__signature" :src="data.firma.imagenUrl" alt="" />
        <div class="report__signature-line" />
        <p class="report__signature-name">{{ data.firma.nombre }}</p>
        <p class="report__signature-role">Responsable del laboratorio</p>
      </div>
      <p class="report__disclaimer">
        Este informe ha sido generado por {{ data.laboratorio.nombre }} y solo es válido en su
        totalidad. Los resultados marcados fuera de los valores de referencia deben interpretarse
        junto con la clínica del paciente.
      </p>
    </footer>
  </div>
</template>

<style scoped>
.report {
  --accent: #3b57d9;
  --ink: #1a1c22;
  --muted: #5c616e;
  --border: #e3e5ea;
  --surface-sunken: #f4f5f8;

  font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: var(--ink);
  max-width: 740px;
  margin: 0 auto;
  background: #fff;
}

.report__accent-bar {
  height: 6px;
  background: linear-gradient(90deg, var(--accent), #6c7ff2);
}

.report {
  padding: 0 44px 44px;
}

.report__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 0 18px;
  border-bottom: 2px solid var(--ink);
  margin-bottom: 24px;
}

.report__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.report__logo {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.report__lab-name {
  font-size: 19px;
  margin: 0;
  letter-spacing: -0.01em;
}

.report__lab-tagline {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--muted);
}

.report__informe-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.report__informe-badge-label {
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.report__informe-badge-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.2;
}

.report__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 16px;
}

.report__card {
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px 16px;
}

.report__card-title {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
  margin-bottom: 8px;
}

.report__card-main {
  margin: 0 0 3px;
  font-size: 14px;
  font-weight: 600;
}

.report__card-sub {
  margin: 0;
  font-size: 12.5px;
  color: var(--muted);
  line-height: 1.5;
}

.report__card-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 10px;
  row-gap: 3px;
  margin: 0;
  font-size: 12.5px;
}

.report__card-grid dt {
  color: var(--muted);
}

.report__card-grid dd {
  margin: 0;
  font-weight: 500;
}

.report__dates {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  font-size: 11.5px;
  color: var(--muted);
  padding: 10px 14px;
  border: 1px dashed var(--border);
  border-radius: 6px;
  margin-bottom: 26px;
}

.report__dates strong {
  color: var(--ink);
  font-weight: 600;
}

.report__section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ink);
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.report__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.report__table th {
  text-align: left;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #fff;
  background: var(--accent);
  padding: 8px 10px;
}

.report__table th:first-child {
  border-radius: 5px 0 0 5px;
}

.report__table th:last-child {
  border-radius: 0 5px 5px 0;
}

.report__table th.is-num {
  text-align: right;
}

.report__table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
}

.report__table tbody tr:nth-child(even) {
  background: var(--surface-sunken);
}

.report__table-parametro {
  font-weight: 600;
}

.report__table-valor {
  font-weight: 700;
  color: var(--accent);
}

.report__table-muted {
  color: var(--muted);
}

.report__table td.is-num {
  text-align: right;
}

.report__table-empty {
  text-align: center;
  color: var(--muted);
  font-style: italic;
  padding: 18px 10px;
}

.report__footer {
  margin-top: 44px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report__signature-block {
  align-self: flex-end;
  text-align: center;
}

.report__signature {
  height: 50px;
  display: block;
  margin: 0 auto 4px;
}

.report__signature-line {
  width: 180px;
  border-top: 1px solid var(--ink);
  margin-bottom: 4px;
}

.report__signature-name {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.report__signature-role {
  margin: 1px 0 0;
  font-size: 11px;
  color: var(--muted);
}

.report__disclaimer {
  margin: 0;
  font-size: 10.5px;
  line-height: 1.5;
  color: var(--muted);
}

@media print {
  .report__accent-bar {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .report__table th {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
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
