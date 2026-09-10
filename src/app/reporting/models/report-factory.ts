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
    <header class="report__header">
      <img class="report__logo" :src="data.laboratorio.logoUrl" alt="" />
      <h1 class="report__lab-name">{{ data.laboratorio.nombre }}</h1>
    </header>

    <section class="report__section">
      <div class="report__section-title">
        <span>Datos del peticionario</span>
        <span class="report__badge">nº informe: {{ data.informe.numero }}</span>
      </div>
      <dl class="report__grid">
        <dt>Orden</dt>
        <dd>{{ data.informe.orden || '—' }}</dd>
        <dt>Fecha inicio análisis</dt>
        <dd>{{ data.informe.fechaInicioAnalisis || '—' }}</dd>
        <dt>Fecha fin análisis</dt>
        <dd>{{ data.informe.fechaFinAnalisis || '—' }}</dd>
        <dt>Fecha emisión informe</dt>
        <dd>{{ data.informe.fechaEmisionInforme || '—' }}</dd>
      </dl>
      <p class="report__peticionario">
        {{ data.peticionario.nombre }}<br />
        {{ data.peticionario.direccion }}<br />
        {{ data.peticionario.cif }}
      </p>
    </section>

    <section class="report__section">
      <div class="report__section-title">Datos de la muestra</div>
      <dl class="report__grid report__grid--2col">
        <dt>Código</dt>
        <dd>{{ data.muestra.codigo }}</dd>
        <dt>Fecha recepción muestra</dt>
        <dd>{{ data.muestra.fechaRecepcion }}</dd>
        <dt>Matriz</dt>
        <dd>{{ data.muestra.matriz }}</dd>
        <dt>Hora recepción muestra</dt>
        <dd>{{ data.muestra.horaRecepcion }}</dd>
      </dl>
    </section>

    <section class="report__section">
      <div class="report__section-title">Resultados</div>
      <table class="report__table">
        <thead>
          <tr>
            <th>Parámetro</th>
            <th>Valor</th>
            <th>Unidad</th>
            <th>Referencia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resultado in data.resultados" :key="resultado.parametro">
            <td>{{ resultado.parametro }}</td>
            <td>{{ resultado.valor }}</td>
            <td>{{ resultado.unidad }}</td>
            <td>{{ resultado.referencia }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <footer class="report__footer">
      <img class="report__signature" :src="data.firma.imagenUrl" alt="" />
      <p>
        Atentamente,<br />
        <strong>{{ data.firma.nombre }}</strong>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.report {
  font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: #1a1c22;
  max-width: 720px;
  margin: 0 auto;
  padding: 32px;
}

.report__header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #1a1c22;
  margin-bottom: 20px;
}

.report__logo {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.report__lab-name {
  font-size: 19px;
  margin: 0;
}

.report__section {
  margin-bottom: 22px;
}

.report__section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: #f4f5f7;
  padding: 6px 10px;
  margin-bottom: 10px;
}

.report__badge {
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
}

.report__grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 12px;
  row-gap: 4px;
  margin: 0 0 10px;
  font-size: 13px;
}

.report__grid--2col {
  grid-template-columns: max-content 1fr max-content 1fr;
}

.report__grid dt {
  color: #5c616e;
}

.report__grid dd {
  margin: 0;
  font-weight: 500;
}

.report__peticionario {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.report__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.report__table th {
  text-align: left;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #5c616e;
  border-bottom: 1px solid #1a1c22;
  padding: 6px 8px;
}

.report__table td {
  padding: 6px 8px;
  border-bottom: 1px solid #e3e5ea;
}

.report__footer {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-top: 40px;
  padding-top: 16px;
}

.report__signature {
  height: 56px;
}

.report__footer p {
  font-size: 13px;
  margin: 0;
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
