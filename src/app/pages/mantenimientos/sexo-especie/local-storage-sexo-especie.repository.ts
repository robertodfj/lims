import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { SexoEspecie } from './sexo-especie.model';
import { SexoEspecieRepository } from './sexo-especie.repository';

export const SEXO_ESPECIE_STORAGE_KEY = 'lims.mantenimientos.sexo-especie';

@Injectable({ providedIn: 'root' })
export class LocalStorageSexoEspecieRepository implements SexoEspecieRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<SexoEspecie[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.sexoEspecie.localeCompare(b.sexoEspecie));
  }

  async get(id: string): Promise<SexoEspecie | null> {
    await this.ensureSeeded();
    return this.readAll().find((item) => item.id === id) ?? null;
  }

  async save(sexoEspecie: SexoEspecie): Promise<SexoEspecie> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !sexoEspecie.id;
    const saved: SexoEspecie = {
      ...sexoEspecie,
      id: sexoEspecie.id || createId('sexoesp'),
      createdAt: sexoEspecie.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((item) => item.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((maxSoFar, item) => {
      const parsed = Number.parseInt(item.codigo, 10);
      return Number.isFinite(parsed) && parsed > maxSoFar ? parsed : maxSoFar;
    }, 0);
    return String(max + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(SEXO_ESPECIE_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<SexoEspecie[]>('/mock/sexo-especie.json'));
    this.writeAll(initial);
  }

  private readAll(): SexoEspecie[] {
    const raw = this.storage.getItem(SEXO_ESPECIE_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as SexoEspecie[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(items: SexoEspecie[]): void {
    this.storage.setItem(SEXO_ESPECIE_STORAGE_KEY, JSON.stringify(items));
  }
}
