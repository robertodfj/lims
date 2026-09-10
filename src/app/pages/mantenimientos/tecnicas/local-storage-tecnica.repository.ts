import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Tecnica } from './tecnica.model';
import { TecnicaRepository } from './tecnica.repository';

export const TECNICAS_STORAGE_KEY = 'lims.mantenimientos.tecnicas';

@Injectable({ providedIn: 'root' })
export class LocalStorageTecnicaRepository implements TecnicaRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Tecnica[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  async get(id: string): Promise<Tecnica | null> {
    await this.ensureSeeded();
    return this.readAll().find((tecnica) => tecnica.id === id) ?? null;
  }

  async save(tecnica: Tecnica): Promise<Tecnica> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !tecnica.id;
    const saved: Tecnica = {
      ...tecnica,
      id: tecnica.id || createId('tec'),
      createdAt: tecnica.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((tecnica) => tecnica.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const maxActivo = this.readAll()
      .filter((tecnica) => !tecnica.noActiva)
      .reduce((max, tecnica) => {
        const parsed = Number.parseInt(tecnica.codigo, 10);
        return Number.isFinite(parsed) && parsed > max ? parsed : max;
      }, 0);
    return String(maxActivo + 1);
  }

  /** Primera vez que se usa el repositorio en la sesión: si localStorage está vacío, lo llena con el JSON mock. */
  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(TECNICAS_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Tecnica[]>('/mock/tecnicas.json'));
    this.writeAll(initial);
  }

  private readAll(): Tecnica[] {
    const raw = this.storage.getItem(TECNICAS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Tecnica[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(tecnicas: Tecnica[]): void {
    this.storage.setItem(TECNICAS_STORAGE_KEY, JSON.stringify(tecnicas));
  }
}
