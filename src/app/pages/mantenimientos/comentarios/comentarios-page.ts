import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-comentarios-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Comentarios" description="Gestión de comentarios." />`,
})
export class ComentariosPage {}
