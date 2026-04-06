import { EASE_DEFINITIONS, RAP_THRESHOLDS } from '../catalogs/definitions';
import { AttackStepStatus } from '../enums';
import { buildFactorExplanation, computeRap } from './rap-engine';
import type {
  ActivationAdjustment,
  ActivationReason,
  ActivationRule,
  AttackStepDefinition,
  AttackStepInstance,
  QuestionCondition,
  QuestionConditionGroup,
  QuestionnaireAnswer,
} from '../types';

function resolveAnswer(condition: QuestionCondition, answers: Record<string, QuestionnaireAnswer>) {
  return condition.questionId ? answers[condition.questionId]?.answer1?.toLowerCase() : undefined;
}

export function evaluateQuestionCondition(
  condition: QuestionCondition,
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
): boolean {
  if (condition.operator === 'always') return true;

  if (condition.operator === 'notEmptyAnswer1') {
    return Boolean(condition.questionId && questionnaireAnswers[condition.questionId]?.answer1?.trim());
  }

  if (condition.operator === 'equalsAnswer1') {
    return condition.questionId
      ? questionnaireAnswers[condition.questionId]?.answer1?.toLowerCase() === String(condition.value).toLowerCase()
      : false;
  }

  const answer = resolveAnswer(condition, questionnaireAnswers);
  if (condition.operator === 'notEqualsOrMissing') {
    if (!answer) return true;
    return answer !== String(condition.value).toLowerCase();
  }

  if (!answer) return false;

  if (condition.operator === 'equals') return answer === String(condition.value).toLowerCase();
  if (condition.operator === 'notEquals') return answer !== String(condition.value).toLowerCase();

  const accepted = Array.isArray(condition.value)
    ? condition.value.map((value) => value.toLowerCase())
    : [String(condition.value).toLowerCase()];

  if (condition.operator === 'in') return accepted.includes(answer);
  if (condition.operator === 'notIn') return !accepted.includes(answer);

  return false;
}

export function evaluateConditionGroup(
  group: QuestionConditionGroup,
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
): boolean {
  return group.conditions.every((condition) => evaluateQuestionCondition(condition, questionnaireAnswers));
}

export function evaluateInactiveRules(
  rules: ActivationRule[],
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
): ActivationReason[] {
  return rules
    .filter((rule) => evaluateConditionGroup(rule.when, questionnaireAnswers))
    .map((rule) => ({ ruleId: rule.id, code: rule.reasonCode, message: rule.reasonText }));
}

function collectActivationAdjustments(
  attackStep: AttackStepDefinition,
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
): ActivationAdjustment[] {
  const adjustments: ActivationAdjustment[] = [];

  const qa18 = questionnaireAnswers.QA18?.answer1;
  if (attackStep.id === 'AS37' && qa18 === 'no-protection') {
    adjustments.push({
      questionId: 'QA18',
      kind: 'easeModifier',
      factor: 'windowOfOpportunity',
      delta: -2,
      note: 'No secure production controls reduce attack effort window constraints.',
    });
  }

  const qa19 = questionnaireAnswers.QA19?.answer1;
  if (attackStep.id === 'AS38' && qa19 === 'not-trusted') {
    adjustments.push({
      questionId: 'QA19',
      kind: 'easeModifier',
      factor: 'knowledgeOfToe',
      delta: -2,
      note: 'Untrusted supplier relation increases attacker knowledge opportunities.',
    });
  }

  if (attackStep.id === 'AS40' && questionnaireAnswers.QA11b?.answer1 === 'no') {
    adjustments.push({
      questionId: 'QA11b',
      kind: 'context',
      note: 'Field updates absent: persistence of exploitation is increased.',
    });
  }

  return adjustments;
}

function applyAdjustments(baseEase: AttackStepDefinition['baseEase'], adjustments: ActivationAdjustment[]) {
  const updated = { ...baseEase };
  adjustments.forEach((adj) => {
    if (adj.kind === 'easeModifier' && adj.factor && typeof adj.delta === 'number') {
      updated[adj.factor] = Math.max(0, updated[adj.factor] + adj.delta);
    }
  });
  return updated;
}

export function isAttackStepActive(
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
  attackStep: AttackStepDefinition,
): boolean {
  return evaluateInactiveRules(attackStep.inactiveWhen, questionnaireAnswers).length === 0;
}

export function collectAttackStepActivationMetadata(
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
  attackStep: AttackStepDefinition,
) {
  const inactiveReasons = evaluateInactiveRules(attackStep.inactiveWhen, questionnaireAnswers);
  const activationAdjustments = collectActivationAdjustments(attackStep, questionnaireAnswers);
  const activationNotes = activationAdjustments.map((item) => item.note);
  return { inactiveReasons, activationAdjustments, activationNotes };
}

export function computeAttackStepInstances(
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
  attackStepCatalog: AttackStepDefinition[],
): AttackStepInstance[] {
  return attackStepCatalog.map((attackStep) => {
    const { inactiveReasons, activationAdjustments, activationNotes } = collectAttackStepActivationMetadata(
      questionnaireAnswers,
      attackStep,
    );

    const active = inactiveReasons.length === 0;
    const effectiveBaseEase = applyAdjustments(attackStep.baseEase, activationAdjustments);
    const rap = computeRap(effectiveBaseEase, { rapThresholds: RAP_THRESHOLDS, easeDefinitions: EASE_DEFINITIONS });
    const factorExplanation = buildFactorExplanation(effectiveBaseEase, EASE_DEFINITIONS);

    return {
      id: attackStep.id,
      title: attackStep.title,
      group: attackStep.group,
      active,
      status: active ? AttackStepStatus.Active : AttackStepStatus.Inactive,
      inactiveReasons,
      activationNotes,
      activationAdjustments,
      proposedCountermeasureIds: attackStep.proposedCountermeasureIds,
      proposedAssumptionIds: attackStep.proposedAssumptionIds,
      additionalAssumptionIds: attackStep.additionalAssumptionIds,
      baseEase: effectiveBaseEase,
      rap,
      factorExplanation,
      linkedDamageScenarioHints: attackStep.linkedDamageScenarioHints,
      qualityFlags: attackStep.qualityFlags,
    };
  });
}
