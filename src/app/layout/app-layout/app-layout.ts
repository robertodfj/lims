import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterOutlet, Sidebar],
  templateUrl: './app-layout.html',
})
export class AppLayout {}
