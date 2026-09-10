import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../icon/icon';
import { AiAssistantStore } from './ai-assistant.store';

@Component({
  selector: 'app-ai-assistant-panel',
  imports: [FormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ai-assistant-panel.html',
  styleUrl: './ai-assistant-panel.css',
})
export class AiAssistantPanel {
  protected readonly store = inject(AiAssistantStore);

  /** Cuando está fijado (p. ej. en el dashboard), el panel no se puede cerrar. */
  readonly pinned = input(false);
  readonly isOpen = input.required<boolean>();

  protected readonly draft = signal('');

  private readonly messagesEl = viewChild<ElementRef<HTMLElement>>('messagesEl');
  private readonly composerEl = viewChild<ElementRef<HTMLInputElement>>('composerEl');

  constructor() {
    effect(() => {
      this.store.messages();
      this.store.thinking();
      const el = this.messagesEl()?.nativeElement;
      if (el) {
        queueMicrotask(() => (el.scrollTop = el.scrollHeight));
      }
    });

    effect(() => {
      if (this.isOpen()) {
        const el = this.composerEl()?.nativeElement;
        queueMicrotask(() => el?.focus());
      }
    });
  }

  protected submit(): void {
    this.store.send(this.draft());
    this.draft.set('');
  }
}
