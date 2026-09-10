import { InjectionToken, inject } from '@angular/core';
import { LocalStorageSubgrupoRepository } from './local-storage-subgrupo.repository';
import { SubgrupoRepository } from './subgrupo.repository';

export const SUBGRUPO_REPOSITORY = new InjectionToken<SubgrupoRepository>('SUBGRUPO_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageSubgrupoRepository),
});
