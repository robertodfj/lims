import { InjectionToken, inject } from '@angular/core';
import { LocalStorageDestinoRepository } from './local-storage-destino.repository';
import { DestinoRepository } from './destino.repository';

export const DESTINO_REPOSITORY = new InjectionToken<DestinoRepository>('DESTINO_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageDestinoRepository),
});
