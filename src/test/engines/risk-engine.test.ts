import { describe, expect, it } from 'vitest';
import { RISK_MATRIX } from '../../domain/catalogs/definitions';
import { DamageLevelLabel, RapLevel, RiskLevelLabel } from '../../domain/enums';
import { computeAttackStepInstances } from '../../domain/engines/activation-engine';
import {
  buildPreliminaryAttackPaths,
  buildRiskSummary,
  compareRiskLevels,
  computeRiskRow,
  computeRiskRows,
  lookupRiskLevel,
  resolveApplicableDamageScenariosForAttackStep,
} from '../../domain/engines/risk-engine';
import type { DamageScenario } from '../../domain/types';
import { ATTACK_STEPS_CATALOG } from '../../domain/catalogs/attack-steps';

const scenario: DamageScenario = {
  id: 'DS-1',
  sourceQuestionId: 'QI15',
  category: 'I',
  damageLevel: { label: DamageLevelLabel.High, value: 4 },
  scenarioLabel: 'Customer asset/network access (major disturbance)',
  scenarioKind: 'customer-network-attack',
  damageNarrative: 'test',
  note: 'test',
  transformed: false,
  transformationReasons: [],
  excludedFromScope: false,
};

describe('risk-engine', () => {
  it('lookupRiskLevel maps workbook matrix cells', () => {
    expect(lookupRiskLevel(RapLevel.Basic, 2, { riskMatrix: RISK_MATRIX }).riskLevel).toBe(RiskLevelLabel.High);
    expect(lookupRiskLevel(RapLevel.High, 3, { riskMatrix: RISK_MATRIX }).riskLevel).toBe(RiskLevelLabel.Moderate);
    expect(lookupRiskLevel(RapLevel.BeyondHigh, 2, { riskMatrix: RISK_MATRIX }).riskLevel).toBe(RiskLevelLabel.Low);
  });

  it('compareRiskLevels orders levels', () => {
    expect(compareRiskLevels(RiskLevelLabel.NoRisk, RiskLevelLabel.Low)).toBeLessThan(0);
    expect(compareRiskLevels(RiskLevelLabel.VeryHigh, RiskLevelLabel.High)).toBeGreaterThan(0);
  });

  it('link resolution uses typed strategies (not cartesian primary)', () => {
    const as31 = computeAttackStepInstances({}, ATTACK_STEPS_CATALOG).find((step) => step.id === 'AS31')!;
    const link = resolveApplicableDamageScenariosForAttackStep(as31, [scenario]);
    expect(link.strategy).toBe('questionSource');
    expect(link.fallbackUsed).toBe(false);
  });

  it('buildPreliminaryAttackPaths exposes sourceStrategy metadata', () => {
    const step = computeAttackStepInstances({}, ATTACK_STEPS_CATALOG).find((item) => item.id === 'AS31')!;
    const paths = buildPreliminaryAttackPaths(step, ['DS-1'], 'questionSource');
    expect(paths[0].sourceStrategy).toBe('inferredFromQuestionSource');
    expect(paths[0].attackStepIds).toEqual(['AS31']);
  });

  it('computeRiskRow forces No Risk when attack step inactive on applicable links', () => {
    const inactiveStep = computeAttackStepInstances({ QA2: { questionId: 'QA2', answer1: 'no' } }, ATTACK_STEPS_CATALOG).find(
      (step) => step.id === 'AS31',
    )!;
    const path = buildPreliminaryAttackPaths(inactiveStep, ['DS-1'], 'questionSource')[0];
    const row = computeRiskRow(inactiveStep, path, scenario, ['test'], { riskMatrix: RISK_MATRIX });
    expect(row.riskLevel).toBe(RiskLevelLabel.NoRisk);
    expect(row.riskId).toContain('P-AS31');
  });

  it('computeRiskRows is deterministic and not allAttackStepsXallDamageScenarios by default', () => {
    const steps = computeAttackStepInstances({}, ATTACK_STEPS_CATALOG).filter((step) => ['AS31', 'AS36'].includes(step.id));
    const scenarios: DamageScenario[] = [scenario, { ...scenario, id: 'DS-2', sourceQuestionId: 'QI2', category: 'C' }];

    const resultA = computeRiskRows(steps, scenarios, { riskMatrix: RISK_MATRIX });
    const resultB = computeRiskRows(steps, scenarios, { riskMatrix: RISK_MATRIX });

    expect(resultA.source.strategy).toBe('linkedDamageScenariosOnly');
    expect(resultA.rows.length).toBeLessThan(steps.length * scenarios.length);
    expect(resultA.rows.map((row) => row.riskId)).toEqual(resultB.rows.map((row) => row.riskId));
  });

  it('buildRiskSummary includes linking coverage and fallback count', () => {
    const steps = computeAttackStepInstances({}, ATTACK_STEPS_CATALOG).filter((step) => step.id === 'AS41');
    const rows = computeRiskRows(steps, [scenario], { riskMatrix: RISK_MATRIX }).rows;
    const summary = buildRiskSummary(rows);
    expect(summary.total).toBeGreaterThan(0);
    expect(summary.linkingCoverage).toBeGreaterThanOrEqual(0);
    expect(summary.fallbackCount).toBeGreaterThanOrEqual(0);
  });
});
