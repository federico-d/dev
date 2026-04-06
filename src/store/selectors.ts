import { ASSUMPTIONS_CATALOG } from '../domain/catalogs/assumptions';
import { ATTACK_STEPS_CATALOG } from '../domain/catalogs/attack-steps';
import { COUNTERMEASURES_CATALOG } from '../domain/catalogs/countermeasures';
import { DAMAGE_RULES } from '../domain/catalogs/damage-rules';
import { DAMAGE_LEVELS, EASE_DEFINITIONS, EASE_SCALES, QA18_SECURE_PRODUCTION_SCALE, QA19_SUPPLY_CHAIN_TRUST_SCALE, RAP_THRESHOLDS, RISK_LEVELS, RISK_MATRIX } from '../domain/catalogs/definitions';
import { DOCUMENTATION_FIELDS } from '../domain/catalogs/documentation-fields';
import { QUESTIONS_CATALOG } from '../domain/catalogs/questions';
import { ValidationSeverity } from '../domain/enums';
import { computeDamageCategories, computeDamageScenarios } from '../domain/engines/damage-engine';
import { computeAttackStepInstances } from '../domain/engines/activation-engine';
import { computeRiskRows } from '../domain/engines/risk-engine';
import {
  computeMetadataCompleteness,
  computeQualityIndicators,
  computeQuestionValidation,
} from '../domain/engines/quality-engine';
import type {
  AttackStepRapResult,
  AnalysisStoreState,
  MetadataState,
  PreliminaryRiskRow,
  QuestionnaireAnswer,
  RiskRow,
  RiskSummaryStats,
  ValidationMessage,
  ValidationResult,
} from '../domain/types';

const qualityCatalogs = {
  documentationFields: DOCUMENTATION_FIELDS,
  questions: QUESTIONS_CATALOG,
};

function buildStateFromQuestionnaire(byId: Record<string, QuestionnaireAnswer>): AnalysisStoreState {
  return {
    analysisMeta: {
      analysisId: '',
      createdAt: '',
      updatedAt: '',
      templateVersion: '',
      dirty: false,
    },
    metadata: {},
    questionnaire: { byId },
    mitigations: { byAttackStepId: {} },
    riskTreatment: { byRiskId: {} },
    tracing: { byRiskId: {} },
    ui: {
      advancedMode: false,
      activeRoute: '',
      sidebarCollapsed: false,
      filters: { questionnaireSection: null, riskLevel: null, showOnlyIssues: false },
    },
  };
}

export function selectDefinitionsCatalog() {
  return {
    damageLevels: DAMAGE_LEVELS,
    riskLevels: RISK_LEVELS,
    rapThresholds: RAP_THRESHOLDS,
    riskMatrix: RISK_MATRIX,
    easeScales: EASE_SCALES,
    easeDefinitions: EASE_DEFINITIONS,
    qa18ProductionScale: QA18_SECURE_PRODUCTION_SCALE,
    qa19SupplyChainScale: QA19_SUPPLY_CHAIN_TRUST_SCALE,
  };
}

export function selectAssumptionsCatalog() {
  return ASSUMPTIONS_CATALOG;
}

export function selectAttackStepCatalog() {
  return ATTACK_STEPS_CATALOG;
}

export function selectQuestionsCatalog() {
  return QUESTIONS_CATALOG;
}

export function selectCountermeasuresCatalog() {
  return COUNTERMEASURES_CATALOG;
}

export function selectAttackStepInstances(state: AnalysisStoreState) {
  return computeAttackStepInstances(state.questionnaire.byId, ATTACK_STEPS_CATALOG);
}

export function selectActiveAttackSteps(state: AnalysisStoreState) {
  return selectAttackStepInstances(state).filter((item) => item.active);
}

export function selectInactiveAttackSteps(state: AnalysisStoreState) {
  return selectAttackStepInstances(state).filter((item) => !item.active);
}

export function selectAttackStepCounts(state: AnalysisStoreState) {
  const instances = selectAttackStepInstances(state);
  const byGroup = instances.reduce<Record<string, { total: number; active: number; inactive: number }>>((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = { total: 0, active: 0, inactive: 0 };
    }
    acc[item.group].total += 1;
    if (item.active) {
      acc[item.group].active += 1;
    } else {
      acc[item.group].inactive += 1;
    }
    return acc;
  }, {});

  return {
    total: instances.length,
    active: instances.filter((item) => item.active).length,
    inactive: instances.filter((item) => !item.active).length,
    byGroup,
  };
}

export function selectRapThresholds() {
  return RAP_THRESHOLDS;
}

export function selectEaseDefinitions() {
  return EASE_DEFINITIONS;
}

export function selectAttackStepRapResults(state: AnalysisStoreState): AttackStepRapResult[] {
  return selectAttackStepInstances(state).map((item) => ({
    attackStepId: item.id,
    attackStepTitle: item.title,
    active: item.active,
    rap: item.rap,
    factorExplanation: item.factorExplanation,
  }));
}

export function selectPreliminaryRiskRows(state: AnalysisStoreState): PreliminaryRiskRow[] {
  const scenarios = selectDamageScenarios(state);
  return selectAttackStepInstances(state).map((item) => ({
    attackStepId: item.id,
    attackStepTitle: item.title,
    active: item.active,
    rapLevel: item.rap.rapLevel,
    rapSum: item.rap.sum,
    factorExplanation: item.factorExplanation,
    linkedDamageScenarioIds: scenarios
      .filter((scenario) => scenario.sourceQuestionId === item.id || scenario.note.includes(item.id))
      .map((scenario) => scenario.id),
    notes: item.active
      ? 'Preliminary RAP computed from base EASE. Final risk level comes in next sprint.'
      : 'Inactive attack step. It will map to No Risk in later phases.',
  }));
}

export function selectHighestRapAttackSteps(state: AnalysisStoreState) {
  const results = selectAttackStepRapResults(state);
  if (results.length === 0) {
    return [];
  }
  const highest = results.reduce((max, row) => Math.max(max, row.rap.rapNumericRank), 0);
  return results.filter((row) => row.rap.rapNumericRank === highest);
}

export function selectRisksPreviewSummary(state: AnalysisStoreState) {
  const rows = selectPreliminaryRiskRows(state);
  const rapDistribution = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.rapLevel] = (acc[row.rapLevel] ?? 0) + 1;
    return acc;
  }, {});

  const highestRapLevelPresent = rows.reduce<string | null>((highest, row) => {
    if (!highest) {
      return row.rapLevel;
    }
    const current = RAP_THRESHOLDS.find((threshold) => threshold.level === row.rapLevel)?.rank ?? 0;
    const baseline = RAP_THRESHOLDS.find((threshold) => threshold.level === highest)?.rank ?? 0;
    return current > baseline ? row.rapLevel : highest;
  }, null);

  return {
    totalAttackSteps: rows.length,
    activeAttackSteps: rows.filter((row) => row.active).length,
    inactiveAttackSteps: rows.filter((row) => !row.active).length,
    rapDistribution,
    highestRapLevelPresent,
  };
}

export function selectRiskMatrix() {
  return RISK_MATRIX;
}

export function selectRiskRows(state: AnalysisStoreState): RiskRow[] {
  const attackStepInstances = selectAttackStepInstances(state);
  const damageScenarios = selectDamageScenarios(state);
  return computeRiskRows(attackStepInstances, damageScenarios, { riskMatrix: RISK_MATRIX }).rows;
}

export function selectActiveRiskRows(state: AnalysisStoreState): RiskRow[] {
  return selectRiskRows(state).filter((row) => row.active);
}

export function selectNoRiskRows(state: AnalysisStoreState): RiskRow[] {
  return selectRiskRows(state).filter((row) => row.riskLevel === 'No Risk');
}

export function selectHighestRiskRows(state: AnalysisStoreState): RiskRow[] {
  const rows = selectRiskRows(state);
  if (rows.length === 0) {
    return [];
  }
  const highestValue = rows.reduce((max, row) => Math.max(max, row.riskLevelValue), 0);
  return rows.filter((row) => row.riskLevelValue === highestValue);
}

export function selectRiskSummaryStats(state: AnalysisStoreState): RiskSummaryStats {
  const attackStepInstances = selectAttackStepInstances(state);
  const damageScenarios = selectDamageScenarios(state);
  return computeRiskRows(attackStepInstances, damageScenarios, { riskMatrix: RISK_MATRIX }).summary;
}

export function selectRiskRowsByAttackStep(state: AnalysisStoreState) {
  return selectRiskRows(state).reduce<Record<string, RiskRow[]>>((acc, row) => {
    if (!acc[row.attackStepId]) {
      acc[row.attackStepId] = [];
    }
    acc[row.attackStepId].push(row);
    return acc;
  }, {});
}

export function selectRiskRowsByDamageScenario(state: AnalysisStoreState) {
  return selectRiskRows(state).reduce<Record<string, RiskRow[]>>((acc, row) => {
    if (!acc[row.damageScenarioId]) {
      acc[row.damageScenarioId] = [];
    }
    acc[row.damageScenarioId].push(row);
    return acc;
  }, {});
}

export function selectDamageScenarios(state: AnalysisStoreState) {
  return computeDamageScenarios(state.questionnaire.byId, DAMAGE_RULES);
}

export function selectDamageCategories(state: AnalysisStoreState) {
  return computeDamageCategories(state.questionnaire.byId, DAMAGE_RULES);
}

export function selectMetadataCompleteness(metadata: MetadataState) {
  const result = computeMetadataCompleteness(metadata, qualityCatalogs.documentationFields);
  return {
    missingRequiredFields: result.missingFieldIds,
    completionPercent: result.completionPercent,
  };
}

export function selectQuestionnaireProgress(byId: Record<string, QuestionnaireAnswer>) {
  const totalCount = QUESTIONS_CATALOG.length;
  const answeredCount = QUESTIONS_CATALOG.filter((question) => byId[question.id]?.answer1?.trim()).length;
  const lightweightState = buildStateFromQuestionnaire(byId);

  const bySection = QUESTIONS_CATALOG.reduce<
    Record<string, { answered: number; total: number; issues: number }>
  >((acc, question) => {
    const key = `${question.group} / ${question.section}`;
    if (!acc[key]) {
      acc[key] = { answered: 0, total: 0, issues: 0 };
    }

    acc[key].total += 1;
    if (byId[question.id]?.answer1?.trim()) {
      acc[key].answered += 1;
    }

    if (computeQuestionValidation(question.id, lightweightState, qualityCatalogs).messages.length > 0) {
      acc[key].issues += 1;
    }

    return acc;
  }, {});

  return {
    answeredCount,
    totalCount,
    bySection,
  };
}

export function selectQualityIndicators(state: AnalysisStoreState) {
  return computeQualityIndicators(state, qualityCatalogs);
}

export function selectQuestionValidationMap(state: AnalysisStoreState): Record<string, ValidationResult> {
  return Object.fromEntries(
    QUESTIONS_CATALOG.map((question) => [question.id, computeQuestionValidation(question.id, state, qualityCatalogs)]),
  );
}

export function selectMetadataValidationMap(state: AnalysisStoreState): Record<string, ValidationMessage[]> {
  const completeness = computeMetadataCompleteness(state.metadata, qualityCatalogs.documentationFields);

  return Object.fromEntries(
    DOCUMENTATION_FIELDS.map((field) => {
      if (!field.required || !completeness.missingFieldIds.includes(field.id)) {
        return [field.id, []];
      }

      return [
        field.id,
        [
          {
            id: `${String(field.id)}-missing`,
            severity: ValidationSeverity.Error,
            message: `${field.label} is required.`,
            fieldId: field.id,
          },
        ],
      ];
    }),
  );
}
