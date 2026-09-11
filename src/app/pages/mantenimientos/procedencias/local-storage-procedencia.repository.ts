import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Procedencia } from './procedencia.model';
import { ProcedenciaRepository } from './procedencia.repository';

export const PROCEDENCIAS_STORAGE_KEY = 'lims.mantenimientos.procedencias';

@Injectable({ providedIn: 'root' })
export class LocalStorageProcedenciaRepository implements ProcedenciaRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Procedencia[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  async get(id: string): Promise<Procedencia | null> {
    await this.ensureSeeded();
    return this.readAll().find((procedencia) => procedencia.id === id) ?? null;
  }

  async save(procedencia: Procedencia): Promise<Procedencia> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !procedencia.id;
    const saved: Procedencia = {
      ...procedencia,
      id: procedencia.id || createId('proc'),
      createdAt: procedencia.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((procedencia) => procedencia.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((max, procedencia) => {
      const parsed = Number.parseInt(procedencia.codigo, 10);
      return Number.isFinite(parsed) && parsed > max ? parsed : max;
    }, 0);
    return String(max + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(PROCEDENCIAS_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Procedencia[]>('/mock/procedencias.json'));
    this.writeAll(initial);
  }

  private readAll(): Procedencia[] {
    const raw = this.storage.getItem(PROCEDENCIAS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Procedencia[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(procedencias: Procedencia[]): void {
    this.storage.setItem(PROCEDENCIAS_STORAGE_KEY, JSON.stringify(procedencias));
  }
}
