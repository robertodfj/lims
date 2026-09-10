import { createNewReport } from '../models/report-factory';
import { LocalStorageReportRepository, REPORTS_STORAGE_KEY } from './local-storage-report-repository';

describe('LocalStorageReportRepository', () => {
  let repository: LocalStorageReportRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageReportRepository();
  });

  it('asigna id y fechas al guardar un informe nuevo y lo recupera', async () => {
    const saved = await repository.save(createNewReport('Informe sin título'));

    expect(saved.id).toMatch(/^rpt-/);
    expect(saved.createdAt).toBe(saved.updatedAt);
    expect(await repository.get(saved.id)).toEqual(saved);
    expect(localStorage.getItem(REPORTS_STORAGE_KEY)).toContain(saved.id);
  });

  it('actualiza un informe existente sin duplicarlo', async () => {
    const saved = await repository.save(createNewReport('Informe sin título'));
    await repository.save({ ...saved, name: 'Hemograma' });

    const summaries = await repository.list();
    expect(summaries).toHaveLength(1);
    expect(summaries[0].name).toBe('Hemograma');
  });

  it('elimina un informe', async () => {
    const saved = await repository.save(createNewReport('Informe sin título'));
    await repository.delete(saved.id);

    expect(await repository.get(saved.id)).toBeNull();
  });

  it('ignora datos corruptos en localStorage', async () => {
    localStorage.setItem(REPORTS_STORAGE_KEY, '{no es json');

    expect(await repository.list()).toEqual([]);
  });
});
