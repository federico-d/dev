import { DAMAGE_RULES } from '../../domain/catalogs/damage-rules';

describe('damage-rules integrity', () => {
  it('has significant coverage and required fields', () => {
    expect(DAMAGE_RULES.length).toBeGreaterThanOrEqual(60);
    for (const rule of DAMAGE_RULES) {
      expect(rule.id).toBeTruthy();
      expect(rule.questionId).toBeTruthy();
      expect(rule.answerValue).toBeTruthy();
      expect(rule.scenarioLabel).toBeTruthy();
      expect(rule.scenarioKind).toBeTruthy();
      expect(['C', 'I', 'A', 'F']).toContain(rule.category);
      expect(rule.damageLevelValue).toBeGreaterThanOrEqual(1);
      expect(rule.damageLevelValue).toBeLessThanOrEqual(5);
    }
  });

  it('covers requested impact families', () => {
    const kinds = new Set(DAMAGE_RULES.map((item) => item.scenarioKind));
    expect(kinds.has('personal-data-exposure')).toBe(true);
    expect(kinds.has('ip-disclosure')).toBe(true);
    expect(kinds.has('contractual-penalty')).toBe(true);
    expect(kinds.has('availability-safety')).toBe(true);
    expect(kinds.has('operational-disturbance')).toBe(true);
    expect(kinds.has('credential-misuse')).toBe(true);
    expect(kinds.has('environmental-damage')).toBe(true);
  });
});
