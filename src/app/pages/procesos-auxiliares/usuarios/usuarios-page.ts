import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../shared/page-placeholder/page-placeholder';

@Component({
  selector: 'app-usuarios-page',
  imports: [PagePlaceholder],
  template: `<app-page-placeholder title="Usuarios" description="Gestión de usuarios." />`,
})
export class UsuariosPage {}
