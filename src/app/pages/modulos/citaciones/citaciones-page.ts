import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-citaciones-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Citaciones" description="Gestión de citaciones." />`,
})
export class CitacionesPage {}
