import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-contenedores-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Contenedores" description="Gestión de contenedores." />`,
})
export class ContenedoresPage {}
