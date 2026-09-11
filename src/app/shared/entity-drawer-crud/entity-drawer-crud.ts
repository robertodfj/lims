import { computed, signal, WritableSignal } from '@angular/core';

/** Posición (1-based) del registro abierto en el drawer dentro de la lista, y el total. */
export interface EntityDrawerPosition {
  readonly index: number;
  readonly total: number;
}

export interface EntityDrawerRepository<T> {
  list(): Promise<T[]>;
  save(value: T): Promise<T>;
  delete(id: string): Promise<void>;
}

/** Genera el valor inicial de un campo tipo código al dar de alta (p. ej. "codigo" o "historiaClinica"). */
export interface EntityDrawerAutoGenerate<T> {
  readonly field: keyof T;
  next(): Promise<string>;
}

/**
 * Estado y acciones de "lista + drawer de alta/edición" comunes a (casi) todos los
 * Mantenimientos: abrir/cerrar el drawer, mantener el borrador, generar un código al dar de
 * alta, guardar con validación y borrar con confirmación en la propia fila. Antes esta lógica
 * se repetía casi línea por línea en cada página; ahora cada página solo instancia esto con
 * su repositorio, su `createEmpty` y su regla de validación.
 */
export class EntityDrawerCrud<T extends { readonly id: string }> {
  readonly items: WritableSignal<T[] | null> = signal(null);
  readonly drawerOpen = signal(false);
  readonly draft: WritableSignal<T>;
  readonly saving = signal(false);
  readonly generating = signal(false);
  readonly confirmDeleteId = signal<string | null>(null);

  constructor(
    private readonly repository: EntityDrawerRepository<T>,
    private readonly createEmpty: () => T,
    private readonly isValid: (value: T) => boolean = () => true,
    private readonly autoGenerate?: EntityDrawerAutoGenerate<T>,
  ) {
    this.draft = signal(createEmpty());
  }

  async load(): Promise<void> {
    this.items.set(await this.repository.list());
  }

  async openNew(): Promise<void> {
    this.draft.set(this.createEmpty());
    this.drawerOpen.set(true);
    await this.regenerate();
  }

  openEdit(entity: T): void {
    this.draft.set({ ...entity });
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  /**
   * Posición del registro que se está editando dentro de `items` (para el paso de página del
   * drawer). `null` mientras se está dando de alta uno nuevo (no tiene id todavía) o si por lo
   * que sea ya no está en la lista.
   */
  readonly position = computed<EntityDrawerPosition | null>(() => {
    const items = this.items();
    const id = this.draft().id;
    if (!items || !id) {
      return null;
    }
    const index = items.findIndex((item) => item.id === id);
    return index === -1 ? null : { index: index + 1, total: items.length };
  });

  /** Abre en el drawer el registro anterior de `items`, si lo hay. */
  openPrevious(): void {
    const items = this.items();
    const pos = this.position();
    if (!items || !pos || pos.index <= 1) {
      return;
    }
    this.openEdit(items[pos.index - 2]);
  }

  /** Abre en el drawer el siguiente registro de `items`, si lo hay. */
  openNext(): void {
    const items = this.items();
    const pos = this.position();
    if (!items || !pos || pos.index >= pos.total) {
      return;
    }
    this.openEdit(items[pos.index]);
  }

  updateDraft<K extends keyof T>(key: K, value: T[K]): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  /** Vuelve a pedir el código/historia clínica autogenerado (botón manual junto al campo). */
  async regenerate(): Promise<void> {
    if (!this.autoGenerate) {
      return;
    }
    this.generating.set(true);
    try {
      const value = await this.autoGenerate.next();
      this.updateDraft(this.autoGenerate.field, value as T[keyof T]);
    } finally {
      this.generating.set(false);
    }
  }

  async save(): Promise<void> {
    const value = this.draft();
    if (!this.isValid(value)) {
      return;
    }

    this.saving.set(true);
    try {
      await this.repository.save(value);
      this.drawerOpen.set(false);
      await this.load();
    } finally {
      this.saving.set(false);
    }
  }

  requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  async confirmDelete(id: string): Promise<void> {
    await this.repository.delete(id);
    this.confirmDeleteId.set(null);
    await this.load();
  }
}
