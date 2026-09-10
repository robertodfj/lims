import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../icon/icon';

export interface CatalogItem {
  readonly id: string;
  readonly nombre: string;
}

/**
 * Combobox con búsqueda: el patrón "Seleccione un elemento de la lista o realice
 * una búsqueda" usado en los formularios de mantenimiento para elegir de un catálogo.
 */
@Component({
  selector: 'app-searchable-select',
  imports: [FormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './searchable-select.html',
  styleUrl: './searchable-select.css',
})
export class SearchableSelect {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly items = input<readonly CatalogItem[]>([]);
  readonly value = input<string | null>(null);
  readonly placeholder = input('Seleccione un elemento de la lista o realice una búsqueda');
  /** Sustituye el mensaje por defecto de catálogo vacío (p. ej. "Selecciona primero un país."). */
  readonly emptyMessage = input<string | null>(null);
  readonly valueChange = output<string | null>();

  protected readonly open = signal(false);
  protected readonly query = signal('');

  protected readonly selectedLabel = () => this.items().find((item) => item.id === this.value())?.nombre ?? null;

  protected readonly filteredItems = () => {
    const term = this.query().trim().toLowerCase();
    const items = this.items();
    return term ? items.filter((item) => item.nombre.toLowerCase().includes(term)) : items;
  };

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  /**
   * Enlazado en el propio host (no en `document`): así el evento nunca llega a un
   * Drawer/Modal contenedor con su propio listener de Escape, que si no también se
   * cerraría (perdiendo el formulario) solo por cerrar este desplegable.
   */
  protected onEscape(event: Event): void {
    if (this.open()) {
      event.stopPropagation();
      this.close();
    }
  }

  protected toggle(): void {
    this.open() ? this.close() : this.openPanel();
  }

  protected openPanel(): void {
    this.query.set('');
    this.open.set(true);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected select(id: string | null): void {
    this.valueChange.emit(id);
    this.close();
  }
}
