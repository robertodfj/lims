import { createId } from '../../core/utils/create-id';
import { ReportDocument, ReportSummary, SavedReportDocument } from '../models/report.model';
import { ReportRepository } from './report-repository';

export const REPORTS_STORAGE_KEY = 'lims.reporting.documents';

export class LocalStorageReportRepository implements ReportRepository {
  constructor(private readonly storage: Storage = localStorage) {}

  async list(): Promise<ReportSummary[]> {
    return this.readAll()
      .map(({ id, name, pages, updatedAt }) => ({ id, name, pageCount: pages.length, updatedAt }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async get(id: string): Promise<SavedReportDocument | null> {
    return this.readAll().find((document) => document.id === id) ?? null;
  }

  async save(document: ReportDocument): Promise<SavedReportDocument> {
    const documents = this.readAll();
    const existing = document.id ? documents.find((stored) => stored.id === document.id) : undefined;
    const now = new Date().toISOString();

    const saved: SavedReportDocument = {
      ...cloneDocument(document),
      id: existing?.id ?? document.id ?? createId('rpt'),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.writeAll(
      existing ? documents.map((stored) => (stored.id === saved.id ? saved : stored)) : [...documents, saved],
    );
    return cloneDocument(saved);
  }

  async delete(id: string): Promise<void> {
    this.writeAll(this.readAll().filter((document) => document.id !== id));
  }

  private readAll(): SavedReportDocument[] {
    const raw = this.storage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as SavedReportDocument[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(documents: SavedReportDocument[]): void {
    this.storage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(documents));
  }
}

/** Clonado vía JSON: también funciona con los proxies reactivos de Vue (structuredClone no). */
function cloneDocument<T extends ReportDocument>(document: T): T {
  return JSON.parse(JSON.stringify(document)) as T;
}
