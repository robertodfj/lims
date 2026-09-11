import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Destino } from './destino.model';
import { DestinoRepository } from './destino.repository';

export const DESTINOS_STORAGE_KEY = 'lims.mantenimientos.destinos';

@Injectable({ providedIn: 'root' })
export class LocalStorageDestinoRepository implements DestinoRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Destino[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || a.descripcion.localeCompare(b.descripcion));
  }

  async get(id: string): Promise<Destino | null> {
    await this.ensureSeeded();
    return this.readAll().find((destino) => destino.id === id) ?? null;
  }

  async save(destino: Destino): Promise<Destino> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !destino.id;
    const saved: Destino = {
      ...destino,
      id: destino.id || createId('dest'),
      createdAt: destino.createdAt ?? now,
      updatedAt: now,
    };

    if (isNew) {
      all.push(saved);
    } else {
      const index = all.findIndex((existing) => existing.id === saved.id);
      if (index === -1) {
        all.push(saved);
      } else {
        all[index] = saved;
      }
    }

    this.writeAll(all);
    return saved;
  }

  async delete(id: string): Promise<void> {
    await this.ensureSeeded();
    this.writeAll(
      this.readAll()
        .filter((destino) => destino.id !== id)
        // Un destino eliminado no puede seguir siendo el "asociado" de otro.
        .map((destino) => (destino.destinoAsociadoId === id ? { ...destino, destinoAsociadoId: null } : destino)),
    );
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((max, destino) => {
      const parsed = Number.parseInt(destino.codigo, 10);
      return Number.isFinite(parsed) && parsed > max ? parsed : max;
    }, 0);
    return String(max + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(DESTINOS_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Destino[]>('/mock/destinos.json'));
    this.writeAll(initial);
  }

  private readAll(): Destino[] {
    const raw = this.storage.getItem(DESTINOS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Destino[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(destinos: Destino[]): void {
    this.storage.setItem(DESTINOS_STORAGE_KEY, JSON.stringify(destinos));
  }
}
