import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-seroteca-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Seroteca" description="Gestión de seroteca." />`,
})
export class SerotecaPage {}
