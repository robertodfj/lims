import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type TipoFactura = 'peticion' | 'prueba';

/**
 * Contenido de "Configuración avanzada" de una Sociedad: parámetros de facturación que
 * aparecen seleccionados por defecto al facturar, modificables antes de generar la factura.
 * Por ahora es solo visual — igual que el resto de pestañas "Avanzado" de la app — salvo el
 * propio selector de Tipo de Factura, que sí cambia qué campos se muestran debajo (no se
 * guarda nada, es solo para poder ver las dos variantes).
 */
@Component({
  selector: 'app-sociedad-advanced-config',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sociedad-advanced-config.html',
  styleUrl: './sociedad-advanced-config.css',
})
export class SociedadAdvancedConfig {
  protected readonly tipoFactura = signal<TipoFactura>('peticion');

  protected setTipoFactura(tipo: TipoFactura): void {
    this.tipoFactura.set(tipo);
  }
}
