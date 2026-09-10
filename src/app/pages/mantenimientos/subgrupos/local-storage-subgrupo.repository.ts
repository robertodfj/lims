import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Subgrupo } from './subgrupo.model';
import { SubgrupoRepository } from './subgrupo.repository';

export const SUBGRUPOS_STORAGE_KEY = 'lims.mantenimientos.subgrupos';

@Injectable({ providedIn: 'root' })
export class LocalStorageSubgrupoRepository implements SubgrupoRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Subgrupo[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || a.nombre.localeCompare(b.nombre));
  }

  async get(id: string): Promise<Subgrupo | null> {
    await this.ensureSeeded();
    return this.readAll().find((subgrupo) => subgrupo.id === id) ?? null;
  }

  async save(subgrupo: Subgrupo): Promise<Subgrupo> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !subgrupo.id;
    const saved: Subgrupo = {
      ...subgrupo,
      id: subgrupo.id || createId('subgrupo'),
      createdAt: subgrupo.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((subgrupo) => subgrupo.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((maxSoFar, subgrupo) => {
      const parsed = Number.parseInt(subgrupo.codigo, 10);
      return Number.isFinite(parsed) && parsed > maxSoFar ? parsed : maxSoFar;
    }, 0);
    return String(max + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(SUBGRUPOS_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Subgrupo[]>('/mock/subgrupos.json'));
    this.writeAll(initial);
  }

  private readAll(): Subgrupo[] {
    const raw = this.storage.getItem(SUBGRUPOS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Subgrupo[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(subgrupos: Subgrupo[]): void {
    this.storage.setItem(SUBGRUPOS_STORAGE_KEY, JSON.stringify(subgrupos));
  }
}
