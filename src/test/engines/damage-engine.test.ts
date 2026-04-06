import { DamageLevelLabel } from '../../domain/enums';
import { ASSUMPTIONS_CATALOG } from '../../domain/catalogs/assumptions';
import { DAMAGE_RULES } from '../../domain/catalogs/damage-rules';
import {
  applyDamageTransformations,
  computeBaseDamageScenarios,
  computeDamageCategories,
  computeDamageScenarios,
  getMaxDamageLevel,
} from '../../domain/engines/damage-engine';

describe('damage-engine', () => {
  it('computeBaseDamageScenarios preserves source question and semantics', () => {
    const scenarios = computeBaseDamageScenarios({ QI2: { questionId: 'QI2', answer1: 'significant' } }, DAMAGE_RULES);
    expect(scenarios.length).toBe(1);
    expect(scenarios[0].sourceQuestionId).toBe('QI2');
    expect(scenarios[0].scenarioLabel).toContain('Personal data');
    expect(scenarios[0].scenarioKind).toBe('personal-data-exposure');
  });

  it('A21 applies scope reduction for customer-based attacks', () => {
    const assumption = ASSUMPTIONS_CATALOG.find((item) => item.id === 'A21');
    const scenarios = computeDamageScenarios(
      { QI15: { questionId: 'QI15', answer1: 'major-disturbance' } },
      DAMAGE_RULES,
      assumption ? [assumption] : [],
    );
    expect(scenarios[0].excludedFromScope).toBe(true);
    expect(scenarios[0].transformed).toBe(true);
  });

  it('A30 excludes physical-destruction scenarios', () => {
    const assumption = ASSUMPTIONS_CATALOG.find((item) => item.id === 'A30');
    const scenarios = computeDamageScenarios(
      { QI8: { questionId: 'QI8', answer1: 'critical-disturbance' } },
      DAMAGE_RULES,
      assumption ? [assumption] : [],
    );
    const physical = scenarios.find((item) => item.scenarioKind === 'physical-destruction');
    expect(physical?.excludedFromScope).toBe(true);
  });

  it('A31 reduces availability safety damage', () => {
    const assumption = ASSUMPTIONS_CATALOG.find((item) => item.id === 'A31');
    const scenarios = computeDamageScenarios(
      { QI6: { questionId: 'QI6', answer1: 'severe-injury' } },
      DAMAGE_RULES,
      assumption ? [assumption] : [],
    );
    expect(scenarios[0].damageLevel.value).toBe(4);
    expect(scenarios[0].transformed).toBe(true);
  });

  it('computeDamageCategories uses transformed final scenarios', () => {
    const assumption = ASSUMPTIONS_CATALOG.find((item) => item.id === 'A31');
    const categories = computeDamageCategories(
      { QI6: { questionId: 'QI6', answer1: 'severe-injury' } },
      DAMAGE_RULES,
      assumption ? [assumption] : [],
    );
    expect(categories.A.value).toBe(4);
  });

  it('applyDamageTransformations is pure and annotates flags', () => {
    const base = computeBaseDamageScenarios({ QI13: { questionId: 'QI13', answer1: 'high' } }, DAMAGE_RULES);
    const assumption = ASSUMPTIONS_CATALOG.find((item) => item.id === 'A38');
    const transformed = applyDamageTransformations(base, assumption ? [assumption] : []);
    expect(base[0].transformed).toBe(false);
    expect(transformed[0].transformed).toBe(true);
    expect(transformed[0].excludedFromScope).toBe(false);
    expect(transformed[0].transformationReasons.length).toBeGreaterThan(0);
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
