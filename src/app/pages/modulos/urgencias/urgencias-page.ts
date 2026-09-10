import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-urgencias-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Urgencias" description="Gestión de urgencias." />`,
})
export class UrgenciasPage {}
