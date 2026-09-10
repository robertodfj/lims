import { InjectionToken, inject } from '@angular/core';
import { LocalStorageTecnicaRepository } from './local-storage-tecnica.repository';
import { TecnicaRepository } from './tecnica.repository';

export const TECNICA_REPOSITORY = new InjectionToken<TecnicaRepository>('TECNICA_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageTecnicaRepository),
});
