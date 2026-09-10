import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createId } from '../../../core/utils/create-id';
import { Paciente } from './paciente.model';
import { PacienteRepository } from './paciente.repository';

export const PACIENTES_STORAGE_KEY = 'lims.mantenimientos.base-pacientes';

@Injectable({ providedIn: 'root' })
export class LocalStoragePacienteRepository implements PacienteRepository {
  private readonly http = inject(HttpClient);
  private readonly storage: Storage = localStorage;
  private seeded: Promise<void> | null = null;

  async list(): Promise<Paciente[]> {
    await this.ensureSeeded();
    return this.readAll().sort(
      (a, b) => a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre),
    );
  }

  async nextHistoriaClinica(): Promise<string> {
    await this.ensureSeeded();
    const max = this.readAll().reduce((maxSoFar, paciente) => {
      const parsed = Number.parseInt(paciente.historiaClinica, 10);
      return Number.isFinite(parsed) && parsed > maxSoFar ? parsed : maxSoFar;
    }, 0);
    return String(max + 1);
  }

  async get(id: string): Promise<Paciente | null> {
    await this.ensureSeeded();
    return this.readAll().find((paciente) => paciente.id === id) ?? null;
  }

  async save(paciente: Paciente): Promise<Paciente> {
    await this.ensureSeeded();
    const all = this.readAll();
    const now = new Date().toISOString();
    const isNew = !paciente.id;
    const saved: Paciente = {
      ...paciente,
      id: paciente.id || createId('pac'),
      createdAt: paciente.createdAt ?? now,
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
    this.writeAll(this.readAll().filter((paciente) => paciente.id !== id));
  }

  private ensureSeeded(): Promise<void> {
    this.seeded ??= this.seed();
    return this.seeded;
  }

  private async seed(): Promise<void> {
    if (this.storage.getItem(PACIENTES_STORAGE_KEY) !== null) {
      return;
    }
    const initial = await firstValueFrom(this.http.get<Paciente[]>('/mock/base-pacientes.json'));
    this.writeAll(initial);
  }

  private readAll(): Paciente[] {
    const raw = this.storage.getItem(PACIENTES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Paciente[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(pacientes: Paciente[]): void {
    this.storage.setItem(PACIENTES_STORAGE_KEY, JSON.stringify(pacientes));
  }
}
