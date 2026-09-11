import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type TipoTransferencia = 'email' | 'ftp' | 'sftp';

/**
 * Contenido de "Configuración avanzada" de un Destino de informes: mensaje de correo,
 * exportación del fichero, modelo de informe usado y condición de asignación automática.
 * Solo visual (como el resto de "Avanzado" de la app), salvo el selector de Tipo de
 * Transferencia y el checkbox de segunda copia, que cambian qué campos se ven debajo sin
 * guardar nada — es solo para poder ver las distintas variantes.
 */
@Component({
  selector: 'app-destino-advanced-config',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './destino-advanced-config.html',
  styleUrl: './destino-advanced-config.css',
})
export class DestinoAdvancedConfig {
  protected readonly tipoTransferencia = signal<TipoTransferencia>('email');
  protected readonly segundaCopia = signal(false);

  protected setTipoTransferencia(tipo: TipoTransferencia): void {
    this.tipoTransferencia.set(tipo);
  }

  protected toggleSegundaCopia(): void {
    this.segundaCopia.update((value) => !value);
  }
}
