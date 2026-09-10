import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

/** Panel lateral genérico: overlay + contenido con slots para cuerpo y pie. */
@Component({
  selector: 'app-drawer',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drawer.html',
  styleUrl: './drawer.css',
})
export class Drawer {
  readonly open = input(false);
  readonly title = input('');
  readonly size = input<'md' | 'lg'>('md');
  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.closed.emit();
    }
  }

  protected requestClose(): void {
    this.closed.emit();
  }
}
