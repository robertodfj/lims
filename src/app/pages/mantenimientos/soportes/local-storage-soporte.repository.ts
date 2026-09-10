import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Soporte } from './soporte.model';
import { SoporteRepository } from './soporte.repository';

export const SOPORTES_STORAGE_KEY = 'lims.mantenimientos.soportes';

@Injectable({ providedIn: 'root' })
export class LocalStorageSoporteRepository implements SoporteRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Soporte[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.codigo.localeCompare(b.codigo, undefined, { numeric: true }));
  }

  async get(id: string): Promise<Soporte | null> {
    await this.ensureSeeded();
    return this.readAll().find((soporte) => soporte.id === id) ?? null;
  }

  async save(soporte: Soporte): Promise<Soporte> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !soporte.id;
    const saved: Soporte = {
      ...soporte,
      id: soporte.id || createId('sop'),
      createdAt: soporte.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((soporte) => soporte.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((acc, soporte) => {
      const parsed = Number.parseInt(soporte.codigo, 10);
      return Number.isFinite(parsed) && parsed > acc ? parsed : acc;
    }, 0);
    return String(max + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(SOPORTES_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Soporte[]>('/mock/soportes.json'));
    this.writeAll(initial);
  }

  private readAll(): Soporte[] {
    const raw = this.storage.getItem(SOPORTES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Soporte[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(soportes: Soporte[]): void {
    this.storage.setItem(SOPORTES_STORAGE_KEY, JSON.stringify(soportes));
  }
}
