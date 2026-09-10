import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-tecnicas-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Técnicas" description="Gestión de técnicas." />`,
})
export class TecnicasPage {}
