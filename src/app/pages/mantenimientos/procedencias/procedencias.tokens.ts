import { InjectionToken, inject } from '@angular/core';
import { LocalStorageProcedenciaRepository } from './local-storage-procedencia.repository';
import { ProcedenciaRepository } from './procedencia.repository';

export const PROCEDENCIA_REPOSITORY = new InjectionToken<ProcedenciaRepository>('PROCEDENCIA_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageProcedenciaRepository),
});
