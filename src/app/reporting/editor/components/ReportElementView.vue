<script setup lang="ts">
import type { ReportDataContext } from '../../models/report-data-context.model';
import type { ReportElement } from '../../models/report.model';

defineProps<{
  element: ReportElement;
  data: ReportDataContext;
  pageNumber: number;
  pageCount: number;
}>();
</script>

<template>
  <header v-if="element.type === 'header'">
    <h4>{{ element.data.title }}</h4>
    <p>{{ data.laboratory.name }}</p>
    <p>{{ data.laboratory.address }}. Tel. {{ data.laboratory.phone }}</p>
  </header>

  <div v-else-if="element.type === 'patient'">
    <h4>{{ element.data.title }}</h4>
    <dl>
      <dt>Nombre</dt>
      <dd>{{ data.patient.name }}</dd>
      <dt>ID paciente</dt>
      <dd>{{ data.patient.id }}</dd>
      <dt>Fecha de nacimiento</dt>
      <dd>{{ data.patient.birthDate }}</dd>
    </dl>
  </div>

  <div v-else-if="element.type === 'sample'">
    <h4>{{ element.data.title }}</h4>
    <dl>
      <dt>ID muestra</dt>
      <dd>{{ data.sample.id }}</dd>
      <dt>Tipo</dt>
      <dd>{{ data.sample.type }}</dd>
      <dt>Fecha de recepción</dt>
      <dd>{{ data.sample.receivedAt }}</dd>
    </dl>
  </div>

  <div v-else-if="element.type === 'results'">
    <h4>{{ element.data.title }}</h4>
    <table>
      <thead>
        <tr>
          <th scope="col">Prueba</th>
          <th scope="col">Resultado</th>
          <th scope="col">Unidades</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data.results" :key="row.test">
          <th scope="row">{{ row.test }}</th>
          <td>{{ row.value }}</td>
          <td>{{ row.unit }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else-if="element.type === 'comments'">
    <h4>{{ element.data.title }}</h4>
    <ul v-if="data.comments.length">
      <li v-for="comment in data.comments" :key="comment">{{ comment }}</li>
    </ul>
    <p v-else>Sin comentarios.</p>
  </div>

  <div v-else-if="element.type === 'signature'">
    <h4>{{ element.data.title }}</h4>
    <p>Validado por: {{ data.validation.validatedBy }}</p>
    <p>Fecha de validación: {{ data.validation.validatedAt }}</p>
  </div>

  <footer v-else-if="element.type === 'footer'">
    <p>{{ element.data.text }}</p>
    <p>Página {{ pageNumber }} de {{ pageCount }}</p>
  </footer>

  <p v-else-if="element.type === 'text'">{{ element.data.content }}</p>
</template>
