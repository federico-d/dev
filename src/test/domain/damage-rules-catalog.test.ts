import { DAMAGE_RULES } from '../../domain/catalogs/damage-rules';

describe('damage-rules integrity', () => {
  it('has required keys and domain cases', () => {
    expect(DAMAGE_RULES.length).toBeGreaterThanOrEqual(8);
    for (const rule of DAMAGE_RULES) {
      expect(rule.questionId).toBeTruthy();
      expect(rule.answerValue).toBeTruthy();
      expect(['C', 'I', 'A', 'F']).toContain(rule.category);
      expect(rule.damageLevelValue).toBeGreaterThanOrEqual(1);
      expect(rule.damageLevelValue).toBeLessThanOrEqual(5);
    }
  });
});
