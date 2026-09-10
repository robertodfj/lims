import { InjectionToken, inject } from '@angular/core';
import { LocalStoragePeticionarioRepository } from './local-storage-peticionario.repository';
import { PeticionarioRepository } from './peticionario.repository';

export const PETICIONARIO_REPOSITORY = new InjectionToken<PeticionarioRepository>('PETICIONARIO_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStoragePeticionarioRepository),
});
