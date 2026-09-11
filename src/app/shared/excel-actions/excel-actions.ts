import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Modal } from '../modal/modal';

/**
 * Botones de "Importar de Excel" / "Exportar a Excel" reutilizables en Mantenimientos.
 * Por ahora sin funcionalidad real: Exportar no hace nada todavía, e Importar solo abre
 * el modal de arrastrar/seleccionar archivo a modo de marcador de posición.
 */
@Component({
  selector: 'app-excel-actions',
  imports: [Modal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './excel-actions.html',
  styleUrl: './excel-actions.css',
})
export class ExcelActions {
  protected readonly importOpen = signal(false);
  protected readonly dragOver = signal(false);
  protected readonly selectedFileName = signal<string | null>(null);

  protected exportar(): void {
    // Sin funcionalidad todavía.
  }

  protected cerrarImport(): void {
    this.importOpen.set(false);
    this.dragOver.set(false);
    this.selectedFileName.set(null);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.selectedFileName.set(file.name);
    }
  }

  protected onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFileName.set(file.name);
    }
  }
}
