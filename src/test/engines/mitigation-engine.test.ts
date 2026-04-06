import { describe, expect, it } from 'vitest';
import { ASSUMPTIONS_CATALOG } from '../../domain/catalogs/assumptions';
import { COUNTERMEASURES_CATALOG } from '../../domain/catalogs/countermeasures';
import { ATTACK_STEPS_CATALOG } from '../../domain/catalogs/attack-steps';
import { computeAttackStepInstances } from '../../domain/engines/activation-engine';
import {
  applyForcedMinimumRap,
  collectSelectedItems,
  computeForcedMinimumRap,
  computeHighestRemainingRisk,
  computeMitigationRows,
  computeNetRap,
  parseMitigationInput,
} from '../../domain/engines/mitigation-engine';
import { computeRiskRows } from '../../domain/engines/risk-engine';
import { RISK_MATRIX } from '../../domain/catalogs/definitions';
import { DamageLevelLabel, RapLevel, RiskLevelLabel } from '../../domain/enums';
import type { DamageScenario } from '../../domain/types';

const scenario: DamageScenario = {
  id: 'DS-1',
  sourceQuestionId: 'QI2',
  category: 'C',
  damageLevel: { label: DamageLevelLabel.High, value: 4 },
  note: 'test',
};

describe('mitigation-engine', () => {
  it('computeForcedMinimumRap returns max among items', () => {
    const parsed = parseMitigationInput('{CM1: Moderate}, {CM2: High}');
    expect(computeForcedMinimumRap(parsed.parsedItems)).toBe(RapLevel.High);
  });

  it('multiple forced minima take the maximum', () => {
    const parsed = parseMitigationInput('{CM1: Enhanced-Basic}, {CM2: Beyond High}, {CM3: High}');
    expect(computeForcedMinimumRap(parsed.parsedItems)).toBe(RapLevel.BeyondHigh);
  });

  it('computeNetRap reacts to EASE deltas', () => {
    const base = computeAttackStepInstances({}, ATTACK_STEPS_CATALOG)[0];
    const net = computeNetRap(base.baseEase, [COUNTERMEASURES_CATALOG[0]]);
    expect(net.netRapSum).toBeGreaterThan(base.rap.sum);
  });

  it('base RAP Basic can move to Enhanced-Basic with enough delta', () => {
    const net = computeNetRap(
      { elapsedTime: 0, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 0, equipment: 0 },
      [
        {
          ...COUNTERMEASURES_CATALOG[0],
          easeDelta: { elapsedTime: 4, expertise: 3, knowledgeOfToe: 0, windowOfOpportunity: 3, equipment: 0 },
        },
      ],
    );
    expect(net.netRapLevel).toBe(RapLevel.EnhancedBasic);
  });

  it('applyForcedMinimumRap elevates RAP', () => {
    const applied = applyForcedMinimumRap(
      {
        netRapLevel: RapLevel.Basic,
        netRapNumericRank: 0,
        netRapSum: 0,
        factors: { elapsedTime: 0, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 0, equipment: 0 },
      },
      RapLevel.High,
    );
    expect(applied.netRapLevel).toBe(RapLevel.High);
  });

  it('base RAP Moderate + forced minimum High => net RAP High', () => {
    const baseNet = computeNetRap(
      { elapsedTime: 4, expertise: 3, knowledgeOfToe: 4, windowOfOpportunity: 3, equipment: 0 },
      [],
    );
    expect(baseNet.netRapLevel).toBe(RapLevel.Moderate);
    const applied = applyForcedMinimumRap(baseNet, RapLevel.High);
    expect(applied.netRapLevel).toBe(RapLevel.High);
  });

  it('assumptions do not modify net RAP', () => {
    const base = computeAttackStepInstances({}, ATTACK_STEPS_CATALOG)[0];
    const parsed = parseMitigationInput('{A21}');
    const selected = collectSelectedItems(parsed.parsedItems, { countermeasures: COUNTERMEASURES_CATALOG });
    const net = computeNetRap(base.baseEase, selected);
    expect(net.netRapSum).toBe(base.rap.sum);
  });

  it('inactive attack step remains No Risk in net rows', () => {
    const steps = computeAttackStepInstances({ QA1: { questionId: 'QA1', answer1: 'no' } }, ATTACK_STEPS_CATALOG).filter(
      (step) => step.id === 'AS2',
    );
    const risks = computeRiskRows(steps, [scenario], { riskMatrix: RISK_MATRIX }).rows;
    const result = computeMitigationRows(
      steps,
      risks,
      { [steps[0].id]: { attackStepId: steps[0].id, rawInput: '{CM1}' } },
      { countermeasures: COUNTERMEASURES_CATALOG, assumptions: ASSUMPTIONS_CATALOG },
    );
    expect(result.rows[0].netRiskRows[0].netRiskLevel).toBe(RiskLevelLabel.NoRisk);
  });

  it('computeHighestRemainingRisk returns maximum', () => {
    const value = computeHighestRemainingRisk([
      {
        riskId: 'R1',
        damageScenarioId: 'DS1',
        baseRiskLevel: RiskLevelLabel.Low,
        netRiskLevel: RiskLevelLabel.Moderate,
        netRiskLevelValue: 2,
        rapLevel: RapLevel.Basic,
        netRapLevel: RapLevel.Basic,
        netRapSum: 1,
      },
      {
        riskId: 'R2',
        damageScenarioId: 'DS2',
        baseRiskLevel: RiskLevelLabel.High,
        netRiskLevel: RiskLevelLabel.High,
        netRiskLevelValue: 3,
        rapLevel: RapLevel.Basic,
        netRapLevel: RapLevel.Basic,
        netRapSum: 1,
      },
    ]);
    expect(value).toBe(RiskLevelLabel.High);
  });

  it('validation issues include unknown/not proposed/inactive cases', () => {
    const steps = computeAttackStepInstances({ QA1: { questionId: 'QA1', answer1: 'no' } }, ATTACK_STEPS_CATALOG).filter(
      (step) => step.id === 'AS2',
    );
    const risks = computeRiskRows(steps, [scenario], { riskMatrix: RISK_MATRIX }).rows;
    const result = computeMitigationRows(
      steps,
      risks,
      { [steps[0].id]: { attackStepId: steps[0].id, rawInput: '{CM999}, {A999}' } },
      { countermeasures: COUNTERMEASURES_CATALOG, assumptions: ASSUMPTIONS_CATALOG },
    );
    expect(result.validationIssues[0].issues.some((msg) => msg.includes('not in catalog'))).toBe(true);
    expect(result.validationIssues[0].issues.some((msg) => msg.includes('not proposed'))).toBe(true);
    expect(result.validationIssues[0].issues.some((msg) => msg.includes('inactive'))).toBe(true);
  });

  it('net risk level changes consistently when net RAP changes', () => {
    const steps = computeAttackStepInstances({}, ATTACK_STEPS_CATALOG).filter((step) => step.id === 'AS1');
    const risks = computeRiskRows(steps, [scenario], { riskMatrix: RISK_MATRIX }).rows;
    const noMitigation = computeMitigationRows(steps, risks, {}, { countermeasures: COUNTERMEASURES_CATALOG, assumptions: ASSUMPTIONS_CATALOG });
    const forcedHigh = computeMitigationRows(
      steps,
      risks,
      { AS1: { attackStepId: 'AS1', rawInput: '{CM1: High}' } },
      { countermeasures: COUNTERMEASURES_CATALOG, assumptions: ASSUMPTIONS_CATALOG },
    );

    expect(forcedHigh.rows[0].netRiskRows[0].netRiskLevelValue).toBeLessThanOrEqual(
      noMitigation.rows[0].netRiskRows[0].netRiskLevelValue,
    );
  });
});
