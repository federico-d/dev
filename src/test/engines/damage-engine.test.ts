import { DamageLevelLabel } from '../../domain/enums';
import { DAMAGE_RULES } from '../../domain/catalogs/damage-rules';
import { computeDamageCategories, computeDamageScenarios, getMaxDamageLevel } from '../../domain/engines/damage-engine';

describe('damage-engine', () => {
  it('personal data significant => Confidentiality High', () => {
    const categories = computeDamageCategories({ QI2: { questionId: 'QI2', answer1: 'medium' } }, DAMAGE_RULES);
    expect(categories.C.label).toBe('High');
  });

  it('personal data ruinous => Confidentiality Critical', () => {
    const categories = computeDamageCategories({ QI2: { questionId: 'QI2', answer1: 'critical' } }, DAMAGE_RULES);
    expect(categories.C.label).toBe('Critical');
  });

  it('IP moderately innovative => Confidentiality Medium', () => {
    const categories = computeDamageCategories({ QI3: { questionId: 'QI3', answer1: 'medium' } }, DAMAGE_RULES);
    expect(categories.C.label).toBe('Medium');
  });

  it('high financial damage => Financial & Legal High', () => {
    const categories = computeDamageCategories({ QI4: { questionId: 'QI4', answer1: 'high' } }, DAMAGE_RULES);
    expect(categories.F.label).toBe('High');
  });

  it('life-threatening injury => Critical', () => {
    const categories = computeDamageCategories({ QI10: { questionId: 'QI10', answer1: 'critical' } }, DAMAGE_RULES);
    expect(categories.A.label).toBe('Critical');
  });

  it('major disturbance => High', () => {
    const categories = computeDamageCategories({ QI6: { questionId: 'QI6', answer1: 'high' } }, DAMAGE_RULES);
    expect(categories.A.label).toBe('High');
  });

  it('aggregates MAX when multiple answers map same category', () => {
    const categories = computeDamageCategories(
      {
        QI2: { questionId: 'QI2', answer1: 'critical' },
        QI3: { questionId: 'QI3', answer1: 'medium' },
      },
      DAMAGE_RULES,
    );
    expect(categories.C.label).toBe('Critical');
  });

  it('computeDamageScenarios returns derived scenarios', () => {
    const scenarios = computeDamageScenarios({ QI2: { questionId: 'QI2', answer1: 'medium' } }, DAMAGE_RULES);
    expect(scenarios.length).toBe(1);
    expect(scenarios[0].sourceQuestionId).toBe('QI2');
  });

  it('getMaxDamageLevel returns max and handles empty', () => {
    const max = getMaxDamageLevel([
      { label: DamageLevelLabel.Low, value: 2 },
      { label: DamageLevelLabel.Critical, value: 5 },
    ]);
    expect(max.label).toBe('Critical');

    const empty = getMaxDamageLevel([]);
    expect(empty.label).toBe('Immaterial');
  });
});
