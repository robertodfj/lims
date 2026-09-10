import { computed, ref } from 'vue';
import { createReportElement, createReportPage } from '../../models/report-factory';
import { ReportDocument, ReportElementType, SavedReportDocument } from '../../models/report.model';

/** Estado y operaciones del documento en edición, independientes del template. */
export function useReportEditor(initialReport: ReportDocument) {
  const report = ref<ReportDocument>(initialReport);
  const activePageId = ref(initialReport.pages[0].id);

  const pageCount = computed(() => report.value.pages.length);
  const activePageIndex = computed(() =>
    Math.max(
      0,
      report.value.pages.findIndex((page) => page.id === activePageId.value),
    ),
  );
  const activePage = computed(() => report.value.pages[activePageIndex.value]);
  const canRemovePage = computed(() => pageCount.value > 1);

  function loadReport(document: ReportDocument): void {
    report.value = document;
    activePageId.value = document.pages[0].id;
  }

  /** Incorpora id y fechas devueltos por el repositorio sin perder la página activa. */
  function applySaved(saved: SavedReportDocument): void {
    report.value.id = saved.id;
    report.value.createdAt = saved.createdAt;
    report.value.updatedAt = saved.updatedAt;
  }

  function selectPage(pageId: string): void {
    if (report.value.pages.some((page) => page.id === pageId)) {
      activePageId.value = pageId;
    }
  }

  function addPage(): void {
    const page = createReportPage();
    report.value.pages.push(page);
    activePageId.value = page.id;
  }

  function removePage(pageId: string): void {
    const pages = report.value.pages;
    const index = pages.findIndex((page) => page.id === pageId);
    if (!canRemovePage.value || index === -1) {
      return;
    }
    pages.splice(index, 1);
    if (activePageId.value === pageId) {
      activePageId.value = pages[Math.min(index, pages.length - 1)].id;
    }
  }

  function addElement(type: ReportElementType): void {
    activePage.value.elements.push(createReportElement(type));
  }

  function removeElement(elementId: string): void {
    const elements = activePage.value.elements;
    const index = elements.findIndex((element) => element.id === elementId);
    if (index !== -1) {
      elements.splice(index, 1);
    }
  }

  return {
    report,
    activePageId,
    activePage,
    activePageIndex,
    pageCount,
    canRemovePage,
    loadReport,
    applySaved,
    selectPage,
    addPage,
    removePage,
    addElement,
    removeElement,
  };
}
