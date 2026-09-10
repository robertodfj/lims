import { InjectionToken, inject } from '@angular/core';
import { LocalStorageComentarioRepository } from './local-storage-comentario.repository';
import { ComentarioRepository } from './comentario.repository';

export const COMENTARIO_REPOSITORY = new InjectionToken<ComentarioRepository>('COMENTARIO_REPOSITORY', {
  providedIn: 'root',
  factory: () => inject(LocalStorageComentarioRepository),
});
