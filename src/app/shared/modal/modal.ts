import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

/** Modal centrado genérico: overlay + panel, con slots para cuerpo y pie. */
@Component({
  selector: 'app-modal',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  readonly open = input(false);
  readonly title = input('');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('sm');
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
