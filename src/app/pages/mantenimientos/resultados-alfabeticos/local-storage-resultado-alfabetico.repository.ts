import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { ResultadoAlfabetico } from './resultado-alfabetico.model';
import { ResultadoAlfabeticoRepository } from './resultado-alfabetico.repository';

export const RESULTADOS_ALFABETICOS_STORAGE_KEY = 'lims.mantenimientos.resultados-alfabeticos';

@Injectable({ providedIn: 'root' })
export class LocalStorageResultadoAlfabeticoRepository implements ResultadoAlfabeticoRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<ResultadoAlfabetico[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.texto.localeCompare(b.texto));
  }

  async get(id: string): Promise<ResultadoAlfabetico | null> {
    await this.ensureSeeded();
    return this.readAll().find((resultado) => resultado.id === id) ?? null;
  }

  async save(resultado: ResultadoAlfabetico): Promise<ResultadoAlfabetico> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !resultado.id;
    const saved: ResultadoAlfabetico = {
      ...resultado,
      id: resultado.id || createId('resalf'),
      createdAt: resultado.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((resultado) => resultado.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((maxSoFar, resultado) => {
      const parsed = Number.parseInt(resultado.codigo, 10);
      return Number.isFinite(parsed) && parsed > maxSoFar ? parsed : maxSoFar;
    }, 0);
    return String(max + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(RESULTADOS_ALFABETICOS_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<ResultadoAlfabetico[]>('/mock/resultados-alfabeticos.json'));
    this.writeAll(initial);
  }

  private readAll(): ResultadoAlfabetico[] {
    const raw = this.storage.getItem(RESULTADOS_ALFABETICOS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as ResultadoAlfabetico[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(resultados: ResultadoAlfabetico[]): void {
    this.storage.setItem(RESULTADOS_ALFABETICOS_STORAGE_KEY, JSON.stringify(resultados));
  }
}
