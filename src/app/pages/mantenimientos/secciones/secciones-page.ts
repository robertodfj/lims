import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-secciones-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Secciones" description="Gestión de secciones." />`,
})
export class SeccionesPage {}
