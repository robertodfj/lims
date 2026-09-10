import { InjectionToken, inject } from '@angular/core';
import { LocalStorageSoporteRepository } from './local-storage-soporte.repository';
import { SoporteRepository } from './soporte.repository';

export const SOPORTE_REPOSITORY = new InjectionToken<SoporteRepository>('SOPORTE_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageSoporteRepository),
});
