import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { LaboratorioReferencia } from './laboratorio-referencia.model';
import { LaboratorioReferenciaRepository } from './laboratorio-referencia.repository';

export const LABORATORIOS_REFERENCIA_STORAGE_KEY = 'lims.mantenimientos.laboratorios-referencia';

@Injectable({ providedIn: 'root' })
export class LocalStorageLaboratorioReferenciaRepository implements LaboratorioReferenciaRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<LaboratorioReferencia[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  async get(id: string): Promise<LaboratorioReferencia | null> {
    await this.ensureSeeded();
    return this.readAll().find((laboratorio) => laboratorio.id === id) ?? null;
  }

  async save(laboratorio: LaboratorioReferencia): Promise<LaboratorioReferencia> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !laboratorio.id;
    const saved: LaboratorioReferencia = {
      ...laboratorio,
      id: laboratorio.id || createId('labref'),
      createdAt: laboratorio.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((laboratorio) => laboratorio.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((maxSoFar, laboratorio) => {
      const parsed = Number.parseInt(laboratorio.codigo, 10);
      return Number.isFinite(parsed) && parsed > maxSoFar ? parsed : maxSoFar;
    }, 0);
    return String(max + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(LABORATORIOS_REFERENCIA_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<LaboratorioReferencia[]>('/mock/laboratorios-referencia.json'));
    this.writeAll(initial);
  }

  private readAll(): LaboratorioReferencia[] {
    const raw = this.storage.getItem(LABORATORIOS_REFERENCIA_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as LaboratorioReferencia[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(laboratorios: LaboratorioReferencia[]): void {
    this.storage.setItem(LABORATORIOS_REFERENCIA_STORAGE_KEY, JSON.stringify(laboratorios));
  }
}
