import { ASSUMPTIONS_CATALOG } from '../../domain/catalogs/assumptions';

const REQUIRED_IDS = [
  'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A21', 'A22', 'A25', 'A26', 'A27', 'A28',
  'A29', 'A30', 'A31', 'A34', 'A36', 'A37', 'A38', 'A39', 'A41', 'A43', 'A44', 'A45',
];

describe('assumptions catalog integrity', () => {
  it('contains required assumption IDs', () => {
    const ids = ASSUMPTIONS_CATALOG.map((item) => item.id);
    for (const id of REQUIRED_IDS) {
      expect(ids).toContain(id);
    }
  });

  it('contains required baseline fields on each assumption', () => {
    for (const item of ASSUMPTIONS_CATALOG) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.stakeholder).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.effectType).toBeTruthy();
    }
  });

  it('critical assumptions use meaningful effect types', () => {
    const lookup = Object.fromEntries(ASSUMPTIONS_CATALOG.map((item) => [item.id, item.effectType]));
    expect(lookup.A21).toBe('scopeReduction');
    expect(lookup.A30).toBe('scopeReduction');
    expect(lookup.A31).toBe('damageTransformation');
    expect(lookup.A34).toBe('damageTransformation');
    expect(lookup.A38).toBe('damageTransformation');
    expect(lookup.A43).toBe('damageTransformation');
  });
});
