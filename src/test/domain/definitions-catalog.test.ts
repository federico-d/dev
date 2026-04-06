import { DAMAGE_LEVELS, RAP_THRESHOLDS, RISK_LEVELS, RISK_MATRIX } from '../../domain/catalogs/definitions';

describe('definitions catalog integrity', () => {
  it('contains required damage levels and RAP thresholds', () => {
    expect(DAMAGE_LEVELS.map((l) => l.label)).toEqual(['Immaterial', 'Low', 'Medium', 'High', 'Critical']);
    expect(RISK_LEVELS).toEqual(['No Risk', 'Low', 'Moderate', 'High', 'Very High']);
    expect(RAP_THRESHOLDS.map((t) => t.min)).toEqual([0, 10, 14, 20, 25]);
  });

  it('contains a 5x5 risk matrix', () => {
    expect(RISK_MATRIX).toHaveLength(25);
  });
});
