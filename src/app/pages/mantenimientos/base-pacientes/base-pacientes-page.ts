import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-base-pacientes-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Base de pacientes" description="Gestión de base de pacientes." />`,
})
export class BasePacientesPage {}
