import { QUESTIONS_CATALOG } from '../../domain/catalogs/questions';

describe('questions catalog parity baseline', () => {
  it('contains all expected question IDs including split QA10/QA11', () => {
    const ids = QUESTIONS_CATALOG.map((q) => q.id);
    const expected = [
      ...Array.from({ length: 16 }, (_, i) => `QI${i + 1}`),
      ...Array.from({ length: 9 }, (_, i) => `QA${i + 1}`),
      'QA10a',
      'QA10b',
      'QA11a',
      'QA11b',
      ...Array.from({ length: 10 }, (_, i) => `QA${i + 12}`),
    ];

    expect(ids).toEqual(expected);
  });

  it('does not contain placeholder titles', () => {
    const titles = QUESTIONS_CATALOG.map((q) => q.title);
    expect(titles.some((title) => title.includes('Impact assessment question'))).toBe(false);
    expect(titles.some((title) => title.includes('Architecture assessment question'))).toBe(false);
  });

  it('keeps QA10 and QA11 variants as distinct records', () => {
    expect(QUESTIONS_CATALOG.find((q) => q.id === 'QA10a')).toBeTruthy();
    expect(QUESTIONS_CATALOG.find((q) => q.id === 'QA10b')).toBeTruthy();
    expect(QUESTIONS_CATALOG.find((q) => q.id === 'QA11a')).toBeTruthy();
    expect(QUESTIONS_CATALOG.find((q) => q.id === 'QA11b')).toBeTruthy();

    expect(QUESTIONS_CATALOG.find((q) => q.id === 'QA10a')?.title).not.toEqual(
      QUESTIONS_CATALOG.find((q) => q.id === 'QA10b')?.title,
    );
    expect(QUESTIONS_CATALOG.find((q) => q.id === 'QA11a')?.title).not.toEqual(
      QUESTIONS_CATALOG.find((q) => q.id === 'QA11b')?.title,
    );
  });
});
