import { EASE_DEFINITIONS, RAP_THRESHOLDS, RISK_MATRIX } from '../catalogs/definitions';
import { RapLevel, RiskLevelLabel } from '../enums';
import { computeRap } from './rap-engine';
import { lookupRiskLevel } from './risk-engine';
import { parseMitigationInput } from '../parsers/mitigation-input';
import type {
  AnalysisStoreState,
  CountermeasureDefinition,
  EaseFactorSet,
  ForcedMinimumRap,
  MitigationComputationResult,
  MitigationParsedItem,
  MitigationRow,
  NetRapResult,
  NetRiskRow,
  RiskLevel,
  RiskRow,
  AttackStepInstance,
} from '../types';

const RAP_RANK: Record<RapLevel, number> = {
  [RapLevel.Basic]: 0,
  [RapLevel.EnhancedBasic]: 1,
  [RapLevel.Moderate]: 2,
  [RapLevel.High]: 3,
  [RapLevel.BeyondHigh]: 4,
};

function addEase(base: EaseFactorSet, delta: EaseFactorSet): EaseFactorSet {
  return {
    elapsedTime: base.elapsedTime + delta.elapsedTime,
    expertise: base.expertise + delta.expertise,
    knowledgeOfToe: base.knowledgeOfToe + delta.knowledgeOfToe,
    windowOfOpportunity: base.windowOfOpportunity + delta.windowOfOpportunity,
    equipment: base.equipment + delta.equipment,
  };
}

export function computeForcedMinimumRap(parsedItems: MitigationParsedItem[]): ForcedMinimumRap {
  const forced = parsedItems
    .filter((item): item is Extract<MitigationParsedItem, { kind: 'countermeasure' }> => item.kind === 'countermeasure')
    .map((item) => item.forcedMinimumRap)
    .filter((value): value is RapLevel => Boolean(value));

  if (forced.length === 0) {
    return null;
  }

  return forced.sort((a, b) => RAP_RANK[b] - RAP_RANK[a])[0];
}

export function applyForcedMinimumRap(netRap: NetRapResult, forcedMinimumRap: ForcedMinimumRap): NetRapResult {
  if (!forcedMinimumRap) {
    return netRap;
  }

  if (RAP_RANK[netRap.netRapLevel] >= RAP_RANK[forcedMinimumRap]) {
    return netRap;
  }

  return {
    ...netRap,
    netRapLevel: forcedMinimumRap,
    netRapNumericRank: RAP_RANK[forcedMinimumRap],
  };
}

export function collectSelectedItems(
  parsedItems: MitigationParsedItem[],
  catalogs: { countermeasures: CountermeasureDefinition[] },
): CountermeasureDefinition[] {
  const byId = Object.fromEntries(catalogs.countermeasures.map((item) => [item.id.toUpperCase(), item]));
  return parsedItems
    .filter((item): item is Extract<MitigationParsedItem, { kind: 'countermeasure' }> => item.kind === 'countermeasure')
    .map((item) => byId[item.id])
    .filter((item): item is CountermeasureDefinition => Boolean(item));
}

export function computeNetRap(
  baseEase: EaseFactorSet,
  selectedCountermeasures: CountermeasureDefinition[],
): NetRapResult {
  const mergedEase = selectedCountermeasures.reduce((acc, item) => addEase(acc, item.easeDelta), baseEase);
  const rap = computeRap(mergedEase, { rapThresholds: RAP_THRESHOLDS, easeDefinitions: EASE_DEFINITIONS });

  return {
    netRapSum: rap.sum,
    netRapLevel: rap.rapLevel,
    netRapNumericRank: rap.rapNumericRank,
    factors: mergedEase,
  };
}

export function computeHighestRemainingRisk(netRiskRows: NetRiskRow[]): RiskLevel | null {
  if (netRiskRows.length === 0) {
    return null;
  }

  return netRiskRows
    .slice()
    .sort((a, b) => b.netRiskLevelValue - a.netRiskLevelValue)[0]
    .netRiskLevel;
}

function toNetRiskRows(relatedRiskRows: RiskRow[], attackStep: AttackStepInstance, netRap: NetRapResult): NetRiskRow[] {
  return relatedRiskRows.map((riskRow) => {
    if (!attackStep.active) {
      return {
        riskId: riskRow.riskId,
        damageScenarioId: riskRow.damageScenarioId,
        baseRiskLevel: riskRow.riskLevel,
        netRiskLevel: RiskLevelLabel.NoRisk,
        netRiskLevelValue: 0,
        rapLevel: riskRow.rapLevel,
        netRapLevel: netRap.netRapLevel,
        netRapSum: netRap.netRapSum,
      };
    }

    const mapped = lookupRiskLevel(netRap.netRapLevel, riskRow.damageLevelValue, { riskMatrix: RISK_MATRIX });
    return {
      riskId: riskRow.riskId,
      damageScenarioId: riskRow.damageScenarioId,
      baseRiskLevel: riskRow.riskLevel,
      netRiskLevel: mapped.riskLevel,
      netRiskLevelValue: mapped.riskLevelValue,
      rapLevel: riskRow.rapLevel,
      netRapLevel: netRap.netRapLevel,
      netRapSum: netRap.netRapSum,
    };
  });
}

export function computeMitigationRow(
  attackStepInstance: AttackStepInstance,
  relatedRiskRows: RiskRow[],
  rawInput: string,
  catalogs: { countermeasures: CountermeasureDefinition[]; assumptions: { id: string }[] },
): MitigationRow {
  const parsed = parseMitigationInput(rawInput);
  const selectedCountermeasures = collectSelectedItems(parsed.parsedItems, { countermeasures: catalogs.countermeasures });
  const netRap = computeNetRap(attackStepInstance.baseEase, selectedCountermeasures);
  const forcedMinimumRap = computeForcedMinimumRap(parsed.parsedItems);
  const appliedRap = applyForcedMinimumRap(netRap, forcedMinimumRap);
  const netRiskRows = toNetRiskRows(relatedRiskRows, attackStepInstance, appliedRap);

  return {
    attackStepId: attackStepInstance.id,
    attackStepTitle: attackStepInstance.title,
    active: attackStepInstance.active,
    proposedCountermeasureIds: attackStepInstance.proposedCountermeasureIds,
    proposedAssumptionIds: attackStepInstance.proposedAssumptionIds,
    additionalAssumptionIds: attackStepInstance.additionalAssumptionIds,
    rawInput,
    parsedItems: parsed.parsedItems,
    parseErrors: parsed.parseErrors,
    baseRapLevel: attackStepInstance.rap.rapLevel,
    baseRapSum: attackStepInstance.rap.sum,
    netRapLevel: appliedRap.netRapLevel,
    netRapSum: appliedRap.netRapSum,
    affectedRiskIds: relatedRiskRows.map((row) => row.riskId),
    highestRemainingRisk: computeHighestRemainingRisk(netRiskRows),
    notes: attackStepInstance.active
      ? 'Planned mitigations only. Confirmation/tracing in later sprint.'
      : 'Attack step inactive: mitigation entry is not relevant for final risk.',
    netRiskRows,
  };
}

function buildValidationIssues(row: MitigationRow, catalogs: { countermeasures: CountermeasureDefinition[]; assumptions: { id: string }[] }) {
  const issues: string[] = [];
  const allCountermeasureIds = new Set(catalogs.countermeasures.map((item) => item.id.toUpperCase()));
  const allAssumptionIds = new Set(catalogs.assumptions.map((item) => item.id.toUpperCase()));
  const allowedForAs = new Set(
    [...row.proposedCountermeasureIds, ...row.proposedAssumptionIds, ...row.additionalAssumptionIds].map((id) => id.toUpperCase()),
  );

  if (row.parseErrors.length > 0) {
    issues.push(...row.parseErrors.map((error) => `Parse error: ${error.message}`));
  }

  row.parsedItems.forEach((item) => {
    if (item.kind === 'countermeasure' && !allCountermeasureIds.has(item.id.toUpperCase())) {
      issues.push(`Countermeasure not in catalog: ${item.id}`);
    }
    if (item.kind === 'assumption' && !allAssumptionIds.has(item.id.toUpperCase())) {
      issues.push(`Assumption not in catalog: ${item.id}`);
    }
    if (!allowedForAs.has(item.id.toUpperCase())) {
      issues.push(`Item not proposed for ${row.attackStepId}: ${item.id}`);
    }
  });

  if (!row.active && row.rawInput.trim()) {
    issues.push(`Mitigation present on inactive attack step: ${row.attackStepId}`);
  }

  return issues;
}

export function computeMitigationRows(
  attackStepInstances: AttackStepInstance[],
  riskRows: RiskRow[],
  mitigationState: AnalysisStoreState['mitigations']['byAttackStepId'],
  catalogs: { countermeasures: CountermeasureDefinition[]; assumptions: { id: string }[] },
): MitigationComputationResult {
  const rows = attackStepInstances.map((attackStep) => {
    const related = riskRows.filter((row) => row.attackStepId === attackStep.id);
    const rawInput = mitigationState[attackStep.id]?.rawInput ?? '';
    return computeMitigationRow(attackStep, related, rawInput, catalogs);
  });

  const validationIssues = rows.map((row) => ({ attackStepId: row.attackStepId, issues: buildValidationIssues(row, catalogs) }));

  return {
    rows,
    validationIssues,
  };
}

export { parseMitigationInput };
