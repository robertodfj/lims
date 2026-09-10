import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Comentario } from './comentario.model';
import { ComentarioRepository } from './comentario.repository';

export const COMENTARIOS_STORAGE_KEY = 'lims.mantenimientos.comentarios';

@Injectable({ providedIn: 'root' })
export class LocalStorageComentarioRepository implements ComentarioRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Comentario[]> {
    await this.ensureSeeded();
    return this.readAll().sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  async get(id: string): Promise<Comentario | null> {
    await this.ensureSeeded();
    return this.readAll().find((comentario) => comentario.id === id) ?? null;
  }

  async save(comentario: Comentario): Promise<Comentario> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !comentario.id;
    const saved: Comentario = {
      ...comentario,
      id: comentario.id || createId('com'),
      createdAt: comentario.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((comentario) => comentario.id !== id));
  }

  async nextCodigo(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((maxSoFar, comentario) => {
      const parsed = Number.parseInt(comentario.codigo, 10);
      return Number.isFinite(parsed) && parsed > maxSoFar ? parsed : maxSoFar;
    }, 0);
    return String(max + 1);
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(COMENTARIOS_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Comentario[]>('/mock/comentarios.json'));
    this.writeAll(initial);
  }

  private readAll(): Comentario[] {
    const raw = this.storage.getItem(COMENTARIOS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Comentario[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(comentarios: Comentario[]): void {
    this.storage.setItem(COMENTARIOS_STORAGE_KEY, JSON.stringify(comentarios));
  }
}
