import { InjectionToken, inject } from '@angular/core';
import { LocalStoragePacienteRepository } from './local-storage-paciente.repository';
import { PacienteRepository } from './paciente.repository';

export const PACIENTE_REPOSITORY = new InjectionToken<PacienteRepository>('PACIENTE_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStoragePacienteRepository),
});
