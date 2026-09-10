import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../shared/icon/icon';

interface Kpi {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  /** Si la variación mostrada es una buena o mala noticia (independiente del signo). */
  readonly sentiment: 'good' | 'bad';
}

interface PeticionReciente {
  readonly id: string;
  readonly paciente: string;
  readonly procedencia: string;
  readonly tecnica: string;
  readonly estado: 'pendiente' | 'en-proceso' | 'validado' | 'urgente';
  readonly hora: string;
}

interface ActividadItem {
  readonly texto: string;
  readonly hora: string;
}

const ESTADO_LABEL: Record<PeticionReciente['estado'], string> = {
  pendiente: 'Pendiente',
  'en-proceso': 'En proceso',
  validado: 'Validado',
  urgente: 'Urgente',
};

const ESTADO_BADGE: Record<PeticionReciente['estado'], string> = {
  pendiente: 'badge--neutral',
  'en-proceso': 'badge--info',
  validado: 'badge--success',
  urgente: 'badge--danger',
};

@Component({
  selector: 'app-dashboard-page',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  protected readonly today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  protected readonly kpis: readonly Kpi[] = [
    { label: 'Peticiones hoy', value: '128', delta: '+12%', sentiment: 'good' },
    { label: 'Pendientes de validación', value: '34', delta: '-6%', sentiment: 'good' },
    { label: 'Resultados críticos', value: '3', delta: '+2', sentiment: 'bad' },
    { label: 'Tiempo medio de respuesta', value: '2h 14m', delta: '-9%', sentiment: 'good' },
    { label: 'Muestras en curso', value: '212', delta: '+4%', sentiment: 'good' },
  ];

  protected readonly recentRequests: readonly PeticionReciente[] = [
    { id: 'PET-10482', paciente: 'García Molina, Ana', procedencia: 'Urgencias', tecnica: 'Hemograma', estado: 'urgente', hora: '09:41' },
    { id: 'PET-10481', paciente: 'Ruiz Torres, David', procedencia: 'Consultas Ext.', tecnica: 'Bioquímica', estado: 'en-proceso', hora: '09:35' },
    { id: 'PET-10480', paciente: 'Fernández Vidal, Lucía', procedencia: 'Planta 3', tecnica: 'Coagulación', estado: 'pendiente', hora: '09:28' },
    { id: 'PET-10479', paciente: 'Santos Prieto, Marcos', procedencia: 'Urgencias', tecnica: 'Microbiología', estado: 'validado', hora: '09:12' },
    { id: 'PET-10478', paciente: 'López Reyes, Carmen', procedencia: 'Planta 1', tecnica: 'Hemograma', estado: 'validado', hora: '08:57' },
    { id: 'PET-10477', paciente: 'Navarro Cano, Iker', procedencia: 'Consultas Ext.', tecnica: 'Serología', estado: 'en-proceso', hora: '08:50' },
  ];

  protected readonly activity: readonly ActividadItem[] = [
    { texto: 'Resultado crítico notificado — PET-10482', hora: 'hace 3 min' },
    { texto: 'Marta S. validó 6 resultados de Bioquímica', hora: 'hace 11 min' },
    { texto: 'Nueva hoja de trabajo: Microbiología T2', hora: 'hace 24 min' },
    { texto: 'Informe enviado a Consultas Externas', hora: 'hace 38 min' },
    { texto: 'Laboratorio de referencia confirmó recepción', hora: 'hace 52 min' },
    { texto: 'Petición urgente registrada desde Urgencias', hora: 'hace 1 h' },
  ];

  protected estadoLabel(estado: PeticionReciente['estado']): string {
    return ESTADO_LABEL[estado];
  }

  protected estadoBadge(estado: PeticionReciente['estado']): string {
    return ESTADO_BADGE[estado];
  }
}
