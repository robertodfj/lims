import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-mantenimiento-hojas-trabajo-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder
    title="Hojas de trabajo"
    description="Agrupan técnicas (hojas personalizadas) o agrupaciones de hojas (hojas agrupadas) para introducir sus resultados juntos en vez de técnica a técnica."
  />`,
})
export class HojasTrabajoMantenimientoPage {}
