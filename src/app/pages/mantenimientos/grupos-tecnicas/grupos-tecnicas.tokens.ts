import { InjectionToken, inject } from '@angular/core';
import { LocalStorageGrupoRepository } from './local-storage-grupo.repository';
import { GrupoRepository } from './grupo.repository';

export const GRUPO_REPOSITORY = new InjectionToken<GrupoRepository>('GRUPO_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageGrupoRepository),
});
