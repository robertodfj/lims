import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Peticion } from './peticion.model';
import { PeticionRepository } from './peticion.repository';

export const PETICIONES_STORAGE_KEY = 'lims.proceso-diario.peticiones';

@Injectable({ providedIn: 'root' })
export class LocalStoragePeticionRepository implements PeticionRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Peticion[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => b.numRegistro - a.numRegistro);
  }

  async get(id: string): Promise<Peticion | null> {
    await this.ensureSeeded();
    return this.readAll().find((peticion) => peticion.id === id) ?? null;
  }

  async save(peticion: Peticion): Promise<Peticion> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !peticion.id;
    const saved: Peticion = {
      ...peticion,
      id: peticion.id || createId('peti'),
      createdAt: peticion.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((peticion) => peticion.id !== id));
  }

  async nextNumRegistro(): Promise<number> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((maxSoFar, peticion) => Math.max(maxSoFar, peticion.numRegistro), 0);
    return max + 1;
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(PETICIONES_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Peticion[]>('/mock/peticiones.json'));
    this.writeAll(initial);
  }

  private readAll(): Peticion[] {
    const raw = this.storage.getItem(PETICIONES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Peticion[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(peticiones: Peticion[]): void {
    this.storage.setItem(PETICIONES_STORAGE_KEY, JSON.stringify(peticiones));
  }
}
