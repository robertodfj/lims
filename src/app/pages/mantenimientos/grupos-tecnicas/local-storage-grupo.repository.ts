import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Grupo } from './grupo.model';
import { GrupoRepository } from './grupo.repository';

export const GRUPOS_STORAGE_KEY = 'lims.mantenimientos.grupos';

@Injectable({ providedIn: 'root' })
export class LocalStorageGrupoRepository implements GrupoRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Grupo[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || a.nombre.localeCompare(b.nombre));
  }

  async get(id: string): Promise<Grupo | null> {
    await this.ensureSeeded();
    return this.readAll().find((grupo) => grupo.id === id) ?? null;
  }

  async save(grupo: Grupo): Promise<Grupo> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !grupo.id;
    const saved: Grupo = {
      ...grupo,
      id: grupo.id || createId('grupo'),
      createdAt: grupo.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((grupo) => grupo.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((maxSoFar, grupo) => {
      const parsed = Number.parseInt(grupo.codigo, 10);
      return Number.isFinite(parsed) && parsed > maxSoFar ? parsed : maxSoFar;
    }, 0);
    return String(max + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(GRUPOS_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Grupo[]>('/mock/grupos.json'));
    this.writeAll(initial);
  }

  private readAll(): Grupo[] {
    const raw = this.storage.getItem(GRUPOS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Grupo[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(grupos: Grupo[]): void {
    this.storage.setItem(GRUPOS_STORAGE_KEY, JSON.stringify(grupos));
  }
}
