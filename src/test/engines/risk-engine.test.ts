import { describe, expect, it } from 'vitest';
import { RISK_MATRIX } from '../../domain/catalogs/definitions';
import { DamageLevelLabel, RapLevel, RiskLevelLabel } from '../../domain/enums';
import { computeAttackStepInstances } from '../../domain/engines/activation-engine';
import {
  buildRiskSummary,
  compareRiskLevels,
  computeRiskRow,
  computeRiskRows,
  lookupRiskLevel,
} from '../../domain/engines/risk-engine';
import type { DamageScenario } from '../../domain/types';
import { ATTACK_STEPS_CATALOG } from '../../domain/catalogs/attack-steps';

const scenario: DamageScenario = {
  id: 'DS-1',
  sourceQuestionId: 'QI2',
  category: 'C',
  damageLevel: { label: DamageLevelLabel.High, value: 4 },
  note: 'test',
};

describe('risk-engine', () => {
  it('lookupRiskLevel maps updated workbook matrix cells', () => {
    expect(lookupRiskLevel(RapLevel.Basic, 2, { riskMatrix: RISK_MATRIX }).riskLevel).toBe(RiskLevelLabel.High);
    expect(lookupRiskLevel(RapLevel.High, 3, { riskMatrix: RISK_MATRIX }).riskLevel).toBe(RiskLevelLabel.Moderate);
    expect(lookupRiskLevel(RapLevel.BeyondHigh, 2, { riskMatrix: RISK_MATRIX }).riskLevel).toBe(RiskLevelLabel.Low);
  });

  it('compareRiskLevels orders correctly', () => {
    expect(compareRiskLevels(RiskLevelLabel.NoRisk, RiskLevelLabel.Low)).toBeLessThan(0);
    expect(compareRiskLevels(RiskLevelLabel.VeryHigh, RiskLevelLabel.High)).toBeGreaterThan(0);
  });

  it('computeRiskRow forces No Risk when attack step inactive', () => {
    const inactiveStep = computeAttackStepInstances({ QA1: { questionId: 'QA1', answer1: 'no' } }, ATTACK_STEPS_CATALOG).find(
      (step) => step.id === 'AS2',
    )!;
    const row = computeRiskRow(inactiveStep, scenario, { riskMatrix: RISK_MATRIX });
    expect(row.riskLevel).toBe(RiskLevelLabel.NoRisk);
    expect(row.riskLevelValue).toBe(0);
  });

  it('computeRiskRows creates stable deterministic risk IDs', () => {
    const steps = computeAttackStepInstances({}, ATTACK_STEPS_CATALOG).slice(0, 2);
    const scenarios: DamageScenario[] = [
      scenario,
      { ...scenario, id: 'DS-2', damageLevel: { label: DamageLevelLabel.Low, value: 2 } },
    ];
    const resultA = computeRiskRows(steps, scenarios, { riskMatrix: RISK_MATRIX });
    const resultB = computeRiskRows(steps, scenarios, { riskMatrix: RISK_MATRIX });

    expect(resultA.rows.map((row) => row.riskId)).toEqual(['R1', 'R2', 'R3', 'R4']);
    expect(resultA.rows.map((row) => row.riskId)).toEqual(resultB.rows.map((row) => row.riskId));
  });

  it('buildRiskSummary counts levels and active/inactive rows', () => {
    const steps = computeAttackStepInstances({ QA1: { questionId: 'QA1', answer1: 'no' } }, ATTACK_STEPS_CATALOG).slice(0, 2);
    const rows = computeRiskRows(steps, [scenario], { riskMatrix: RISK_MATRIX }).rows;
    const summary = buildRiskSummary(rows);

    expect(summary.total).toBe(2);
    expect(summary.noRisk).toBeGreaterThanOrEqual(1);
    expect(summary.activeRiskRows + summary.inactiveRiskRows).toBe(2);
  });
});
