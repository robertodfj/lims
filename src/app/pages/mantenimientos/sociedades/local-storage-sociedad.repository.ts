import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Sociedad } from './sociedad.model';
import { SociedadRepository } from './sociedad.repository';

export const SOCIEDADES_STORAGE_KEY = 'lims.mantenimientos.sociedades';

@Injectable({ providedIn: 'root' })
export class LocalStorageSociedadRepository implements SociedadRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Sociedad[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  async get(id: string): Promise<Sociedad | null> {
    await this.ensureSeeded();
    return this.readAll().find((sociedad) => sociedad.id === id) ?? null;
  }

  async save(sociedad: Sociedad): Promise<Sociedad> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !sociedad.id;
    const saved: Sociedad = {
      ...sociedad,
      id: sociedad.id || createId('soc'),
      createdAt: sociedad.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((sociedad) => sociedad.id !== id));
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(SOCIEDADES_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Sociedad[]>('/mock/sociedades.json'));
    this.writeAll(initial);
  }

  private readAll(): Sociedad[] {
    const raw = this.storage.getItem(SOCIEDADES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Sociedad[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(sociedades: Sociedad[]): void {
    this.storage.setItem(SOCIEDADES_STORAGE_KEY, JSON.stringify(sociedades));
  }
}
