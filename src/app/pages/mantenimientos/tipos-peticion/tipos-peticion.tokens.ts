import { InjectionToken, inject } from '@angular/core';
import { LocalStorageTipoPeticionRepository } from './local-storage-tipo-peticion.repository';
import { TipoPeticionRepository } from './tipo-peticion.repository';

export const TIPO_PETICION_REPOSITORY = new InjectionToken<TipoPeticionRepository>('TIPO_PETICION_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageTipoPeticionRepository),
});
