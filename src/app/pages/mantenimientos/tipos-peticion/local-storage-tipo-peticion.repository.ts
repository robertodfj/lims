import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { TipoPeticion } from './tipo-peticion.model';
import { TipoPeticionRepository } from './tipo-peticion.repository';

export const TIPOS_PETICION_STORAGE_KEY = 'lims.mantenimientos.tipos-peticion';

@Injectable({ providedIn: 'root' })
export class LocalStorageTipoPeticionRepository implements TipoPeticionRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<TipoPeticion[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  async get(id: string): Promise<TipoPeticion | null> {
    await this.ensureSeeded();
    return this.readAll().find((tipo) => tipo.id === id) ?? null;
  }

  async save(tipo: TipoPeticion): Promise<TipoPeticion> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !tipo.id;
    const saved: TipoPeticion = {
      ...tipo,
      id: tipo.id || createId('tpet'),
      createdAt: tipo.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((tipo) => tipo.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((acc, tipo) => {
      const parsed = Number.parseInt(tipo.codigo, 10);
      return Number.isFinite(parsed) && parsed > acc ? parsed : acc;
    }, 0);
    return String(max + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(TIPOS_PETICION_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<TipoPeticion[]>('/mock/tipos-peticion.json'));
    this.writeAll(initial);
  }

  private readAll(): TipoPeticion[] {
    const raw = this.storage.getItem(TIPOS_PETICION_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as TipoPeticion[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(tipos: TipoPeticion[]): void {
    this.storage.setItem(TIPOS_PETICION_STORAGE_KEY, JSON.stringify(tipos));
  }
}
