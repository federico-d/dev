import { PARITY_DOC_LINKS } from '../../parity/doc-links';
import { PARITY_FIXTURES } from '../../parity/fixtures';

describe('parity fixtures and docs baseline', () => {
  it('contains required fixtures', () => {
    expect(PARITY_FIXTURES.map((item) => item.id)).toEqual([
      'empty-analysis',
      'no-connectivity',
      'internet-facing-gateway-inconsistent',
      'no-update-functionality',
      'profile-a-baseline',
    ]);
  });

  it('declares required parity docs', () => {
    expect(PARITY_DOC_LINKS.matrix).toBe('docs/parity-matrix.md');
    expect(PARITY_DOC_LINKS.inventory).toBe('docs/workbook-entity-inventory.md');
  });
});
