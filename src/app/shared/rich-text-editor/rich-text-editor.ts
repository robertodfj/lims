import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, viewChild } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 * Editor de texto enriquecido (contenteditable): da formato a texto libre —negrita,
 * cursiva, subrayado, alineación, color— como en un editor de texto convencional.
 * El valor se maneja como HTML; el DOM se escribe directamente (nativeElement.innerHTML),
 * no vía binding de plantilla, así que no pasa por el sanitizador de Angular.
 */
@Component({
  selector: 'app-rich-text-editor',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rich-text-editor.html',
  styleUrl: './rich-text-editor.css',
})
export class RichTextEditor {
  readonly value = input('');
  readonly placeholder = input('Escriba el contenido…');
  readonly valueChange = output<string>();

  protected readonly editor = viewChild<ElementRef<HTMLDivElement>>('editor');

  /** Último HTML conocido (propio o del padre): evita reescribir el DOM mientras el usuario escribe. */
  private lastValue = '';

  constructor() {
    effect(() => {
      const html = this.value();
      const element = this.editor()?.nativeElement;
      if (element && html !== this.lastValue) {
        this.lastValue = html;
        element.innerHTML = html;
      }
    });
  }

  protected exec(command: string, commandValue?: string): void {
    this.editor()?.nativeElement.focus();
    document.execCommand(command, false, commandValue);
    this.emitChange();
  }

  protected onColor(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    this.exec('foreColor', color);
  }

  protected emitChange(): void {
    const element = this.editor()?.nativeElement;
    if (!element) {
      return;
    }
    const html = element.innerHTML;
    this.lastValue = html;
    this.valueChange.emit(html);
  }
}
