import { DAMAGE_LEVELS, RAP_THRESHOLDS, RISK_LEVELS, RISK_MATRIX } from '../../domain/catalogs/definitions';
import { RapLevel, RiskLevelLabel } from '../../domain/enums';

describe('definitions catalog integrity', () => {
  it('contains required damage levels and RAP thresholds', () => {
    expect(DAMAGE_LEVELS.map((l) => l.label)).toEqual(['Immaterial', 'Low', 'Medium', 'High', 'Critical']);
    expect(DAMAGE_LEVELS.map((l) => l.value)).toEqual([1, 2, 3, 4, 5]);
    expect(RISK_LEVELS).toEqual(['No Risk', 'Low', 'Moderate', 'High', 'Very High']);
    expect(RAP_THRESHOLDS.map((t) => t.min)).toEqual([0, 10, 14, 20, 25]);
    expect(RAP_THRESHOLDS.map((t) => t.level)).toEqual([
      RapLevel.Basic,
      RapLevel.EnhancedBasic,
      RapLevel.Moderate,
      RapLevel.High,
      RapLevel.BeyondHigh,
    ]);
  });

  it('contains exact 5x5 risk matrix cells', () => {
    expect(RISK_MATRIX).toHaveLength(25);

    const expected: Record<string, RiskLevelLabel> = {
      'Basic|1': RiskLevelLabel.Low,
      'Basic|2': RiskLevelLabel.High,
      'Basic|3': RiskLevelLabel.High,
      'Basic|4': RiskLevelLabel.VeryHigh,
      'Basic|5': RiskLevelLabel.VeryHigh,
      'Enhanced-Basic|1': RiskLevelLabel.Low,
      'Enhanced-Basic|2': RiskLevelLabel.Moderate,
      'Enhanced-Basic|3': RiskLevelLabel.High,
      'Enhanced-Basic|4': RiskLevelLabel.VeryHigh,
      'Enhanced-Basic|5': RiskLevelLabel.VeryHigh,
      'Moderate|1': RiskLevelLabel.Low,
      'Moderate|2': RiskLevelLabel.Moderate,
      'Moderate|3': RiskLevelLabel.High,
      'Moderate|4': RiskLevelLabel.High,
      'Moderate|5': RiskLevelLabel.VeryHigh,
      'High|1': RiskLevelLabel.Low,
      'High|2': RiskLevelLabel.Moderate,
      'High|3': RiskLevelLabel.Moderate,
      'High|4': RiskLevelLabel.High,
      'High|5': RiskLevelLabel.VeryHigh,
      'Beyond High|1': RiskLevelLabel.Low,
      'Beyond High|2': RiskLevelLabel.Low,
      'Beyond High|3': RiskLevelLabel.Moderate,
      'Beyond High|4': RiskLevelLabel.Moderate,
      'Beyond High|5': RiskLevelLabel.High,
    };

    for (const cell of RISK_MATRIX) {
      expect(cell.riskLevel).toBe(expected[`${cell.rap}|${cell.damageLevelValue}`]);
    }
  });

  it('does not include No Risk inside matrix cells', () => {
    expect(RISK_MATRIX.some((cell) => cell.riskLevel === RiskLevelLabel.NoRisk)).toBe(false);
  });
});
