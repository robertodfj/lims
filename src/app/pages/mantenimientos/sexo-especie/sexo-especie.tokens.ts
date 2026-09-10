import { InjectionToken, inject } from '@angular/core';
import { LocalStorageSexoEspecieRepository } from './local-storage-sexo-especie.repository';
import { SexoEspecieRepository } from './sexo-especie.repository';

export const SEXO_ESPECIE_REPOSITORY = new InjectionToken<SexoEspecieRepository>('SEXO_ESPECIE_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageSexoEspecieRepository),
});
