import { InjectionToken, inject } from '@angular/core';
import { LocalStorageLaboratorioReferenciaRepository } from './local-storage-laboratorio-referencia.repository';
import { LaboratorioReferenciaRepository } from './laboratorio-referencia.repository';

export const LABORATORIO_REFERENCIA_REPOSITORY = new InjectionToken<LaboratorioReferenciaRepository>(
  'LABORATORIO_REFERENCIA_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => inject(LocalStorageLaboratorioReferenciaRepository),
  },
);
