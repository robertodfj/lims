import { InjectionToken, inject } from '@angular/core';
import { LocalStorageSociedadRepository } from './local-storage-sociedad.repository';
import { SociedadRepository } from './sociedad.repository';

export const SOCIEDAD_REPOSITORY = new InjectionToken<SociedadRepository>('SOCIEDAD_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageSociedadRepository),
});
