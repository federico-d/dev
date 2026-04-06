import { SHEET_METADATA, getVisibleSheets } from '../../domain/catalogs/sheet-metadata';

describe('sheet metadata registry', () => {
  it('contains all 24 workbook-equivalent routes', () => {
    expect(SHEET_METADATA).toHaveLength(24);
    expect(new Set(SHEET_METADATA.map((sheet) => sheet.route)).size).toBe(24);
  });

  it('hides advanced sheets by default and shows them when enabled', () => {
    const visibleDefault = getVisibleSheets(false);
    const visibleAdvanced = getVisibleSheets(true);

    expect(visibleDefault.some((sheet) => sheet.route === '/user-information')).toBe(false);
    expect(visibleDefault.some((sheet) => sheet.route === '/profile-definitions')).toBe(false);
    expect(visibleDefault.some((sheet) => sheet.route === '/helper')).toBe(false);

    expect(visibleAdvanced.some((sheet) => sheet.route === '/user-information')).toBe(true);
    expect(visibleAdvanced.some((sheet) => sheet.route === '/profile-definitions')).toBe(true);
    expect(visibleAdvanced.some((sheet) => sheet.route === '/helper')).toBe(true);
  });
});
