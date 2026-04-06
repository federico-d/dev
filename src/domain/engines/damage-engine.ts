import { ASSUMPTIONS_CATALOG } from '../catalogs/assumptions';
import { DamageLevelLabel } from '../enums';
import type {
  AssumptionDefinition,
  DamageCategoryResult,
  DamageLevel,
  DamageRule,
  DamageScenario,
  QuestionnaireAnswer,
} from '../types';

const DAMAGE_LEVEL_BY_VALUE: Record<1 | 2 | 3 | 4 | 5, DamageLevelLabel> = {
  1: DamageLevelLabel.Immaterial,
  2: DamageLevelLabel.Low,
  3: DamageLevelLabel.Medium,
  4: DamageLevelLabel.High,
  5: DamageLevelLabel.Critical,
};

const IMMATERIAL: DamageLevel = { label: DamageLevelLabel.Immaterial, value: 1 };

function normalizeAnswers(questionnaireAnswers: Record<string, QuestionnaireAnswer>) {
  return Object.fromEntries(
    Object.entries(questionnaireAnswers).map(([key, value]) => [key, value.answer1?.trim() ?? '']),
  );
}

function toDamageLevel(value: number): DamageLevel {
  const bounded = Math.max(1, Math.min(5, Math.round(value))) as 1 | 2 | 3 | 4 | 5;
  return { value: bounded, label: DAMAGE_LEVEL_BY_VALUE[bounded] };
}

function lowerDamageLevel(level: DamageLevel, by = 1): DamageLevel {
  return toDamageLevel(level.value - by);
}

function assumptionAppliesToScenario(assumption: AssumptionDefinition, scenario: DamageScenario): boolean {
  const { effectConfig } = assumption;
  if (effectConfig.sourceQuestionIds?.length && !effectConfig.sourceQuestionIds.includes(scenario.sourceQuestionId)) {
    return false;
  }
  if (effectConfig.targetDamageCategories?.length && !effectConfig.targetDamageCategories.includes(scenario.category)) {
    return false;
  }
  if (effectConfig.targetDamageLevels?.length && !effectConfig.targetDamageLevels.includes(scenario.damageLevel.label)) {
    return false;
  }
  return true;
}

function applySingleTransformation(scenario: DamageScenario, assumption: AssumptionDefinition): DamageScenario {
  if (!assumptionAppliesToScenario(assumption, scenario)) {
    return scenario;
  }

  const reasons = [...scenario.transformationReasons];
  const notes = [scenario.note];
  const effectNotes = [
    ...(assumption.effectConfig.transformationNotes ?? []),
    ...(assumption.effectConfig.scopeImpactNotes ?? []),
  ].filter(Boolean);

  if (assumption.effectConfig.excludedScenarioKinds?.includes(scenario.scenarioKind)) {
    // no-op: narrative-based exclusion is too brittle; keep branch documented.
  }

  if (assumption.id === 'A21' && ['customer-asset-access', 'customer-network-attack'].includes(scenario.scenarioKind)) {
    return {
      ...scenario,
      transformed: true,
      excludedFromScope: true,
      transformationReasons: [...reasons, 'A21: customer-managed attack consequences moved out of baseline scope'],
      note: `${notes.join(' ')} Scope reduced by A21.`,
    };
  }

  if (assumption.id === 'A30' && scenario.scenarioKind === 'physical-destruction') {
    return {
      ...scenario,
      transformed: true,
      excludedFromScope: true,
      transformationReasons: [...reasons, 'A30: physical destruction is out of scope for baseline cyber risk'],
      note: `${notes.join(' ')} Excluded by A30.`,
    };
  }

  if (assumption.id === 'A31' && scenario.scenarioKind === 'availability-safety') {
    return {
      ...scenario,
      transformed: true,
      damageLevel: lowerDamageLevel(scenario.damageLevel, 1),
      transformationReasons: [...reasons, 'A31: availability not safety-relevant in intended operating environment'],
      note: `${notes.join(' ')} Damage level reduced by A31.`,
    };
  }

  if (assumption.id === 'A38' && scenario.scenarioKind === 'credential-misuse') {
    return {
      ...scenario,
      transformed: true,
      damageLevel: lowerDamageLevel(scenario.damageLevel, 1),
      transformationReasons: [...reasons, 'A38: least-privilege limits consequences of credential misuse'],
      note: `${notes.join(' ')} Damage level reduced by A38.`,
    };
  }

  if (assumption.effectType === 'scopeReduction' && assumption.effectConfig.excludedScenarioKinds?.includes(scenario.scenarioLabel)) {
    return {
      ...scenario,
      transformed: true,
      excludedFromScope: true,
      transformationReasons: [...reasons, `${assumption.id}: scenario excluded from scope`],
      note: `${notes.join(' ')} Excluded by ${assumption.id}.`,
    };
  }

  if (assumption.effectType === 'damageTransformation') {
    return {
      ...scenario,
      transformed: true,
      damageLevel: lowerDamageLevel(scenario.damageLevel, 1),
      transformationReasons: [...reasons, `${assumption.id}: damage transformed`],
      note: `${notes.join(' ')} ${effectNotes.join(' ')}`.trim(),
    };
  }

  return scenario;
}

export function collectDamageTransformationReasons(scenarios: DamageScenario[]): Record<string, string[]> {
  return Object.fromEntries(scenarios.map((scenario) => [scenario.id, scenario.transformationReasons]));
}

export function getMaxDamageLevel(levels: DamageLevel[]): DamageLevel {
  if (levels.length === 0) {
    return IMMATERIAL;
  }

  return levels.reduce((max, level) => (level.value > max.value ? level : max), levels[0]);
}

export function computeBaseDamageScenarios(
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
  damageRules: DamageRule[],
): DamageScenario[] {
  const normalized = normalizeAnswers(questionnaireAnswers);
  const matched = damageRules.filter((rule) => normalized[rule.questionId] === rule.answerValue);

  return matched.map((rule) => ({
    id: `DS-${rule.id}`,
    baseScenarioId: `DS-${rule.id}`,
    sourceQuestionId: rule.questionId,
    category: rule.category,
    damageLevel: {
      label: rule.damageLevelLabel,
      value: rule.damageLevelValue,
    },
    scenarioLabel: rule.scenarioLabel ?? `${rule.questionId} / ${rule.answerValue}`,
    scenarioKind: rule.scenarioKind ?? 'generic',
    damageNarrative: rule.damageNarrative ?? rule.note,
    note: rule.note,
    transformed: false,
    transformationReasons: [],
    excludedFromScope: false,
  }));
}

export function applyDamageTransformations(
  baseScenarios: DamageScenario[],
  activeAssumptions: AssumptionDefinition[],
): DamageScenario[] {
  return baseScenarios.map((scenario) =>
    activeAssumptions.reduce((current, assumption) => applySingleTransformation(current, assumption), scenario),
  );
}

export function computeDamageScenarios(
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
  damageRules: DamageRule[],
  assumptions: AssumptionDefinition[] = ASSUMPTIONS_CATALOG.filter((item) => item.activeByTemplate),
): DamageScenario[] {
  const baseScenarios = computeBaseDamageScenarios(questionnaireAnswers, damageRules);
  return applyDamageTransformations(baseScenarios, assumptions);
}

export function computeDamageCategories(
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
  damageRules: DamageRule[],
  assumptions: AssumptionDefinition[] = ASSUMPTIONS_CATALOG.filter((item) => item.activeByTemplate),
): DamageCategoryResult {
  const scenarios = computeDamageScenarios(questionnaireAnswers, damageRules, assumptions).filter(
    (scenario) => !scenario.excludedFromScope,
  );

  return {
    C: getMaxDamageLevel(scenarios.filter((scenario) => scenario.category === 'C').map((scenario) => scenario.damageLevel)),
    I: getMaxDamageLevel(scenarios.filter((scenario) => scenario.category === 'I').map((scenario) => scenario.damageLevel)),
    A: getMaxDamageLevel(scenarios.filter((scenario) => scenario.category === 'A').map((scenario) => scenario.damageLevel)),
    F: getMaxDamageLevel(scenarios.filter((scenario) => scenario.category === 'F').map((scenario) => scenario.damageLevel)),
  };
}
