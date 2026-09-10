import { InjectionToken, inject } from '@angular/core';
import { LocalStorageContenedorRepository } from './local-storage-contenedor.repository';
import { ContenedorRepository } from './contenedor.repository';

export const CONTENEDOR_REPOSITORY = new InjectionToken<ContenedorRepository>('CONTENEDOR_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageContenedorRepository),
});
