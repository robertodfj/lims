import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-facturacion-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Facturación" description="Gestión de facturación." />`,
})
export class FacturacionPage {}
