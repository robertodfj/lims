import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-presupuestos-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Presupuestos" description="Gestión de presupuestos." />`,
})
export class PresupuestosPage {}
