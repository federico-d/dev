import { RISK_MATRIX } from '../catalogs/definitions';
import { RiskLevelLabel } from '../enums';
import type {
  AttackPath,
  AttackStepDamageLinkResult,
  AttackStepInstance,
  DamageScenario,
  RiskComputationResult,
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

function buildRiskId(pathId: string, damageScenarioId: string): string {
  return `R-${pathId}-${damageScenarioId}`;
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function lookupRiskLevel(
  rapLevel: AttackStepInstance['rap']['rapLevel'],
  damageLevelValue: 1 | 2 | 3 | 4 | 5,
  definitions: { riskMatrix: RiskMatrixCell[] } = { riskMatrix: RISK_MATRIX },
): { riskLevel: RiskLevel; riskLevelValue: RiskLevelValue } {
  const found = definitions.riskMatrix.find((cell) => cell.rap === rapLevel && cell.damageLevelValue === damageLevelValue);
  if (!found) return { riskLevel: RiskLevelLabel.Low, riskLevelValue: 1 };
  return { riskLevel: found.riskLevel, riskLevelValue: found.riskLevelValue };
}

export function compareRiskLevels(a: RiskLevel, b: RiskLevel): number {
  return RISK_LEVEL_VALUE[a] - RISK_LEVEL_VALUE[b];
}

export function resolveApplicableDamageScenariosForAttackStep(
  attackStep: AttackStepInstance,
  damageScenarios: DamageScenario[],
): AttackStepDamageLinkResult {
  const hints = attackStep.linkedDamageScenarioHints;

  const byExplicit = (hints.explicitDamageScenarioRefs ?? []).filter((id) => damageScenarios.some((scenario) => scenario.id === id));
  if (byExplicit.length > 0) {
    return {
      attackStepId: attackStep.id,
      damageScenarioIds: unique(byExplicit),
      strategy: 'explicitHints',
      notes: ['Matched explicit damage scenario references in attack-step catalog.'],
      fallbackUsed: false,
    };
  }

  const byQuestionAndCategory = damageScenarios
    .filter((scenario) => hints.sourceQuestionIds.includes(scenario.sourceQuestionId) && hints.categories.includes(scenario.category))
    .map((scenario) => scenario.id);

  if (byQuestionAndCategory.length > 0) {
    return {
      attackStepId: attackStep.id,
      damageScenarioIds: unique(byQuestionAndCategory),
      strategy: 'questionSource',
      notes: ['Matched sourceQuestionIds and damage categories from catalog hints.'],
      fallbackUsed: false,
    };
  }

  const byCategoryOnly = damageScenarios.filter((scenario) => hints.categories.includes(scenario.category)).map((scenario) => scenario.id);
  if (byCategoryOnly.length > 0) {
    return {
      attackStepId: attackStep.id,
      damageScenarioIds: unique(byCategoryOnly),
      strategy: 'categoryFallback',
      notes: ['No exact source-question match; category-level fallback used.'],
      fallbackUsed: true,
    };
  }

  return {
    attackStepId: attackStep.id,
    damageScenarioIds: damageScenarios.map((scenario) => scenario.id),
    strategy: 'noMatchFallback',
    notes: ['No linking hints available. Temporary all-scenarios fallback used.'],
    fallbackUsed: true,
  };
}

export function buildApplicableRiskSources(
  attackStepInstances: AttackStepInstance[],
  damageScenarios: DamageScenario[],
): AttackStepDamageLinkResult[] {
  return attackStepInstances.map((step) => resolveApplicableDamageScenariosForAttackStep(step, damageScenarios));
}

export function buildPreliminaryAttackPaths(
  attackStep: AttackStepInstance,
  applicableDamageScenarioIds: string[],
  sourceStrategy: AttackStepDamageLinkResult['strategy'],
): AttackPath[] {
  const strategyMap = {
    explicitHints: 'explicitWorkbookLink',
    questionSource: 'inferredFromQuestionSource',
    categoryFallback: 'inferredFromCategory',
    noMatchFallback: 'fallbackSingleStep',
  } as const;

  return [
    {
      id: `P-${attackStep.id}`,
      attackStepIds: [attackStep.id],
      title: `${attackStep.id} single-step preliminary path`,
      pathKind: 'singleStep',
      targetDamageScenarioIds: applicableDamageScenarioIds,
      notes:
        sourceStrategy === 'noMatchFallback'
          ? 'Single-step path built with fallbackSingleStep because no controlled link was available.'
          : 'Single-step preliminary path derived from Sprint 3 linking metadata.',
      sourceStrategy: strategyMap[sourceStrategy],
      qualityFlags: attackStep.qualityFlags,
    },
  ];
}

export function computeRiskRow(
  attackStepInstance: AttackStepInstance,
  attackPath: AttackPath,
  damageScenario: DamageScenario,
  notes: string[],
  definitions: { riskMatrix: RiskMatrixCell[] } = { riskMatrix: RISK_MATRIX },
): RiskRow {
  const riskId = buildRiskId(attackPath.id, damageScenario.id);

  if (!attackStepInstance.active) {
    return {
      riskId,
      attackPathId: attackPath.id,
      attackPath,
      attackPathSourceStrategy: attackPath.sourceStrategy,
      attackStepId: attackStepInstance.id,
      attackStepTitle: attackStepInstance.title,
      active: false,
      damageScenarioId: damageScenario.id,
      damageScenarioLabel: damageScenario.scenarioLabel,
      damageCategory: damageScenario.category,
      damageLevelLabel: damageScenario.damageLevel.label,
      damageLevelValue: damageScenario.damageLevel.value,
      rapLevel: attackStepInstance.rap.rapLevel,
      rapSum: attackStepInstance.rap.sum,
      riskLevel: RiskLevelLabel.NoRisk,
      riskLevelValue: 0,
      factorExplanation: attackStepInstance.factorExplanation,
      notes: [...notes, 'Attack step inactive: forced to No Risk on applicable links only.'].join(' '),
      linkingQualityFlags: attackPath.sourceStrategy === 'fallbackSingleStep' ? ['fallbackSingleStep'] : undefined,
    };
  }

  const mapped = lookupRiskLevel(attackStepInstance.rap.rapLevel, damageScenario.damageLevel.value, definitions);

  return {
    riskId,
    attackPathId: attackPath.id,
    attackPath,
    attackPathSourceStrategy: attackPath.sourceStrategy,
    attackStepId: attackStepInstance.id,
    attackStepTitle: attackStepInstance.title,
    active: true,
    damageScenarioId: damageScenario.id,
    damageScenarioLabel: damageScenario.scenarioLabel,
    damageCategory: damageScenario.category,
    damageLevelLabel: damageScenario.damageLevel.label,
    damageLevelValue: damageScenario.damageLevel.value,
    rapLevel: attackStepInstance.rap.rapLevel,
    rapSum: attackStepInstance.rap.sum,
    riskLevel: mapped.riskLevel,
    riskLevelValue: mapped.riskLevelValue,
    factorExplanation: attackStepInstance.factorExplanation,
    notes: [...notes, 'Risk from RAP x Damage matrix (mitigation/treatment/tracing not applied in this sprint).'].join(' '),
    linkingQualityFlags: attackPath.sourceStrategy === 'fallbackSingleStep' ? ['fallbackSingleStep'] : undefined,
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
    linkingCoverage: 0,
    fallbackCount: 0,
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

    if (row.attackPathSourceStrategy === 'fallbackSingleStep') summary.fallbackCount += 1;
  });

  summary.linkingCoverage = summary.total === 0 ? 0 : Math.round(((summary.total - summary.fallbackCount) / summary.total) * 100);

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
        strategy: 'linkedDamageScenariosOnly',
        note: 'No attack steps or damage scenarios available.',
      },
    };
  }

  const links = buildApplicableRiskSources(
    [...attackStepInstances].sort((a, b) => a.id.localeCompare(b.id)),
    [...damageScenarios].sort((a, b) => a.id.localeCompare(b.id)),
  );

  const rows = links.flatMap((link) => {
    const step = attackStepInstances.find((item) => item.id === link.attackStepId);
    if (!step) return [];

    const scenarios = damageScenarios.filter((scenario) => link.damageScenarioIds.includes(scenario.id));
    const paths = buildPreliminaryAttackPaths(step, link.damageScenarioIds, link.strategy);

    return paths.flatMap((path) =>
      scenarios.map((scenario) =>
        computeRiskRow(step, path, scenario, [link.notes.join(' '), step.linkedDamageScenarioHints.notes], definitions),
      ),
    );
  });

  return {
    rows,
    summary: buildRiskSummary(rows),
    source: {
      strategy: rows.some((row) => row.attackPathSourceStrategy === 'fallbackSingleStep')
        ? 'fallbackAllScenarios'
        : 'linkedDamageScenariosOnly',
      note: 'Risk rows derive from applicable AS↔DS links and preliminary attack paths.',
    },
  };
}
