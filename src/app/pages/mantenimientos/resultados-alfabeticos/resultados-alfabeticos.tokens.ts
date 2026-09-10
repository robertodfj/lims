import { InjectionToken, inject } from '@angular/core';
import { LocalStorageResultadoAlfabeticoRepository } from './local-storage-resultado-alfabetico.repository';
import { ResultadoAlfabeticoRepository } from './resultado-alfabetico.repository';

export const RESULTADO_ALFABETICO_REPOSITORY = new InjectionToken<ResultadoAlfabeticoRepository>(
  'RESULTADO_ALFABETICO_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => inject(LocalStorageResultadoAlfabeticoRepository),
  },
);
