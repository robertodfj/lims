import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Contenedor } from './contenedor.model';
import { ContenedorRepository } from './contenedor.repository';

export const CONTENEDORES_STORAGE_KEY = 'lims.mantenimientos.contenedores';

@Injectable({ providedIn: 'root' })
export class LocalStorageContenedorRepository implements ContenedorRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Contenedor[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  async get(id: string): Promise<Contenedor | null> {
    await this.ensureSeeded();
    return this.readAll().find((contenedor) => contenedor.id === id) ?? null;
  }

  async save(contenedor: Contenedor): Promise<Contenedor> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !contenedor.id;
    const saved: Contenedor = {
      ...contenedor,
      id: contenedor.id || createId('cont'),
      createdAt: contenedor.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((contenedor) => contenedor.id !== id));
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(CONTENEDORES_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Contenedor[]>('/mock/contenedores.json'));
    this.writeAll(initial);
  }

  private readAll(): Contenedor[] {
    const raw = this.storage.getItem(CONTENEDORES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Contenedor[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(contenedores: Contenedor[]): void {
    this.storage.setItem(CONTENEDORES_STORAGE_KEY, JSON.stringify(contenedores));
  }
}
