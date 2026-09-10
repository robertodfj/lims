import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-comunicaciones-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Comunicaciones" description="Gestión de comunicaciones." />`,
})
export class ComunicacionesPage {}
