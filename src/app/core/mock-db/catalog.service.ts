import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CatalogItem } from '../../shared/searchable-select/searchable-select';

/**
 * Lee los catálogos mockeados de /public/mock/*.json (futura sustitución por la API real).
 * Cachea cada catálogo en memoria durante la sesión para no repetir la petición.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Promise<CatalogItem[]>>();

  load(catalogName: string): Promise<CatalogItem[]> {
    let pending = this.cache.get(catalogName);
    if (!pending) {
      pending = firstValueFrom(this.http.get<CatalogItem[]>(`/mock/${catalogName}.json`));
      this.cache.set(catalogName, pending);
    }
    return pending;
  }
}
