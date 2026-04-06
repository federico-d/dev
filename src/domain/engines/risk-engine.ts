import { RISK_MATRIX } from '../catalogs/definitions';
import { RiskLevelLabel } from '../enums';
import type {
  AttackStepInstance,
  DamageScenario,
  PreliminaryAttackPath,
  RiskComputationResult,
  RiskId,
  RiskLevel,
  RiskLevelValue,
  RiskMatrixCell,
  RiskRow,
  RiskSummaryStats,
} from '../types';

const RISK_LEVEL_VALUE: Record<RiskLevel, RiskLevelValue> = {
  [RiskLevelLabel.NoRisk]: 0,
  [RiskLevelLabel.Low]: 1,
  [RiskLevelLabel.Moderate]: 2,
  [RiskLevelLabel.High]: 3,
  [RiskLevelLabel.VeryHigh]: 4,
};

function buildRiskId(index: number): RiskId {
  return `R${index + 1}`;
}

export function lookupRiskLevel(
  rapLevel: AttackStepInstance['rap']['rapLevel'],
  damageLevelValue: 1 | 2 | 3 | 4 | 5,
  definitions: { riskMatrix: RiskMatrixCell[] } = { riskMatrix: RISK_MATRIX },
): { riskLevel: RiskLevel; riskLevelValue: RiskLevelValue } {
  const found = definitions.riskMatrix.find((cell) => cell.rap === rapLevel && cell.damageLevelValue === damageLevelValue);
  if (!found) {
    return { riskLevel: RiskLevelLabel.Low, riskLevelValue: 1 };
  }

  return { riskLevel: found.riskLevel, riskLevelValue: found.riskLevelValue };
}

export function compareRiskLevels(a: RiskLevel, b: RiskLevel): number {
  return RISK_LEVEL_VALUE[a] - RISK_LEVEL_VALUE[b];
}

export function computeRiskRow(
  attackStepInstance: AttackStepInstance,
  damageScenario: DamageScenario,
  definitions: { riskMatrix: RiskMatrixCell[] } = { riskMatrix: RISK_MATRIX },
): Omit<RiskRow, 'riskId'> {
  const attackPath: PreliminaryAttackPath = [attackStepInstance.id];

  if (!attackStepInstance.active) {
    return {
      attackPath,
      attackStepId: attackStepInstance.id,
      attackStepTitle: attackStepInstance.title,
      active: false,
      damageScenarioId: damageScenario.id,
      damageCategory: damageScenario.category,
      damageLevelLabel: damageScenario.damageLevel.label,
      damageLevelValue: damageScenario.damageLevel.value,
      rapLevel: attackStepInstance.rap.rapLevel,
      rapSum: attackStepInstance.rap.sum,
      riskLevel: RiskLevelLabel.NoRisk,
      riskLevelValue: 0,
      factorExplanation: attackStepInstance.factorExplanation,
      notes: 'Attack step inactive: forced to No Risk in Sprint 3A.',
    };
  }

  const mapped = lookupRiskLevel(attackStepInstance.rap.rapLevel, damageScenario.damageLevel.value, definitions);
  return {
    attackPath,
    attackStepId: attackStepInstance.id,
    attackStepTitle: attackStepInstance.title,
    active: true,
    damageScenarioId: damageScenario.id,
    damageCategory: damageScenario.category,
    damageLevelLabel: damageScenario.damageLevel.label,
    damageLevelValue: damageScenario.damageLevel.value,
    rapLevel: attackStepInstance.rap.rapLevel,
    rapSum: attackStepInstance.rap.sum,
    riskLevel: mapped.riskLevel,
    riskLevelValue: mapped.riskLevelValue,
    factorExplanation: attackStepInstance.factorExplanation,
    notes: 'Initial risk row from RAP x Damage matrix. Mitigation not yet applied.',
  };
}

export function buildRiskSummary(riskRows: RiskRow[]): RiskSummaryStats {
  const summary: RiskSummaryStats = {
    total: riskRows.length,
    noRisk: 0,
    low: 0,
    moderate: 0,
    high: 0,
    veryHigh: 0,
    highestRiskLevelPresent: null,
    activeRiskRows: riskRows.filter((row) => row.active).length,
    inactiveRiskRows: riskRows.filter((row) => !row.active).length,
  };

  riskRows.forEach((row) => {
    if (row.riskLevel === RiskLevelLabel.NoRisk) summary.noRisk += 1;
    if (row.riskLevel === RiskLevelLabel.Low) summary.low += 1;
    if (row.riskLevel === RiskLevelLabel.Moderate) summary.moderate += 1;
    if (row.riskLevel === RiskLevelLabel.High) summary.high += 1;
    if (row.riskLevel === RiskLevelLabel.VeryHigh) summary.veryHigh += 1;

    if (!summary.highestRiskLevelPresent || compareRiskLevels(row.riskLevel, summary.highestRiskLevelPresent) > 0) {
      summary.highestRiskLevelPresent = row.riskLevel;
    }
  });

  return summary;
}

export function computeRiskRows(
  attackStepInstances: AttackStepInstance[],
  damageScenarios: DamageScenario[],
  definitions: { riskMatrix: RiskMatrixCell[] } = { riskMatrix: RISK_MATRIX },
): RiskComputationResult {
  if (damageScenarios.length === 0 || attackStepInstances.length === 0) {
    return {
      rows: [],
      summary: buildRiskSummary([]),
      source: {
        strategy: 'allAttackStepsXDamageScenarios',
        note: 'No attack steps or no damage scenarios available yet.',
      },
    };
  }

  const sortedSteps = [...attackStepInstances].sort((a, b) => a.id.localeCompare(b.id));
  const sortedScenarios = [...damageScenarios].sort((a, b) => a.id.localeCompare(b.id));

  const rows: RiskRow[] = sortedSteps.flatMap((attackStep) =>
    sortedScenarios.map((scenario) => computeRiskRow(attackStep, scenario, definitions)),
  ).map((row, index) => ({
    riskId: buildRiskId(index),
    ...row,
  }));

  return {
    rows,
    summary: buildRiskSummary(rows),
    source: {
      strategy: 'allAttackStepsXDamageScenarios',
      note: 'Fallback strategy for Sprint 3A: cartesian product of attack steps and damage scenarios.',
    },
  };
}
