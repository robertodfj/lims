import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-informes-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Informes" description="Gestión de informes." />`,
})
export class InformesPage {}
