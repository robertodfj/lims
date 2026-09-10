import { InjectionToken, inject } from '@angular/core';
import { LocalStoragePeticionRepository } from './local-storage-peticion.repository';
import { PeticionRepository } from './peticion.repository';

export const PETICION_REPOSITORY = new InjectionToken<PeticionRepository>('PETICION_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStoragePeticionRepository),
});
