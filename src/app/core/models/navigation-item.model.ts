export interface NavigationItem {
  readonly label: string;
  /** Segmento de ruta relativo a su padre (sin barra inicial). */
  readonly path: string;
  readonly children?: readonly NavigationItem[];
}
