import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Peticionario } from './peticionario.model';
import { PeticionarioRepository } from './peticionario.repository';

export const PETICIONARIOS_STORAGE_KEY = 'lims.mantenimientos.peticionarios';

@Injectable({ providedIn: 'root' })
export class LocalStoragePeticionarioRepository implements PeticionarioRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Peticionario[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  async get(id: string): Promise<Peticionario | null> {
    await this.ensureSeeded();
    return this.readAll().find((peticionario) => peticionario.id === id) ?? null;
  }

  async save(peticionario: Peticionario): Promise<Peticionario> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !peticionario.id;
    const saved: Peticionario = {
      ...peticionario,
      id: peticionario.id || createId('pet'),
      createdAt: peticionario.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((peticionario) => peticionario.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const maxActivo = this.readAll()
      .filter((peticionario) => peticionario.estado === 'activo')
      .reduce((max, peticionario) => {
        const parsed = Number.parseInt(peticionario.codigo, 10);
        return Number.isFinite(parsed) && parsed > max ? parsed : max;
      }, 0);
    return String(maxActivo + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(PETICIONARIOS_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Peticionario[]>('/mock/peticionarios.json'));
    this.writeAll(initial);
  }

  private readAll(): Peticionario[] {
    const raw = this.storage.getItem(PETICIONARIOS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Peticionario[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(peticionarios: Peticionario[]): void {
    this.storage.setItem(PETICIONARIOS_STORAGE_KEY, JSON.stringify(peticionarios));
  }
}
