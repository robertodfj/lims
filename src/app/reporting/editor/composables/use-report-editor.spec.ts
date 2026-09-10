import { DEFAULT_FIRST_PAGE_LAYOUT, createNewReport } from '../../models/report-factory';
import { useReportEditor } from './use-report-editor';

describe('useReportEditor', () => {
  it('crea la primera página con la estructura predefinida', () => {
    const editor = useReportEditor(createNewReport());

    expect(editor.pageCount.value).toBe(1);
    expect(editor.activePage.value.elements.map((element) => element.type)).toEqual([
      ...DEFAULT_FIRST_PAGE_LAYOUT,
    ]);
  });

  it('añade una página y la deja activa', () => {
    const editor = useReportEditor(createNewReport());
    editor.addPage();

    expect(editor.pageCount.value).toBe(2);
    expect(editor.activePageIndex.value).toBe(1);
    expect(editor.activePage.value.elements).toEqual([]);
  });

  it('no permite eliminar la última página', () => {
    const editor = useReportEditor(createNewReport());
    editor.removePage(editor.activePageId.value);

    expect(editor.pageCount.value).toBe(1);
    expect(editor.canRemovePage.value).toBe(false);
  });

  it('al eliminar la página activa selecciona la contigua', () => {
    const editor = useReportEditor(createNewReport());
    const firstPageId = editor.activePageId.value;
    editor.addPage();
    editor.addPage();
    editor.selectPage(editor.report.value.pages[1].id);

    editor.removePage(editor.activePageId.value);

    expect(editor.pageCount.value).toBe(2);
    expect(editor.activePageIndex.value).toBe(1);
    expect(editor.report.value.pages[0].id).toBe(firstPageId);
  });

  it('añade y elimina elementos en la página activa', () => {
    const editor = useReportEditor(createNewReport());
    editor.addPage();
    editor.addElement('comments');
    editor.addElement('signature');

    const [comments] = editor.activePage.value.elements;
    editor.removeElement(comments.id);

    expect(editor.activePage.value.elements.map((element) => element.type)).toEqual(['signature']);
    expect(editor.report.value.pages[0].elements).toHaveLength(DEFAULT_FIRST_PAGE_LAYOUT.length);
  });
});
