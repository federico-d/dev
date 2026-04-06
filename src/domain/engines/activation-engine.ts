import { EASE_DEFINITIONS, RAP_THRESHOLDS } from '../catalogs/definitions';
import { AttackStepStatus } from '../enums';
import { buildFactorExplanation, computeRap } from './rap-engine';
import type {
  ActivationReason,
  ActivationRule,
  AttackStepDefinition,
  AttackStepInstance,
  QuestionCondition,
  QuestionnaireAnswer,
} from '../types';

const QUESTION_ALIASES: Record<string, string[]> = {
  QA10a: ['QA10a', 'QA10'],
  QA10b: ['QA10b', 'QA10'],
  QA11a: ['QA11a', 'QA11'],
  QA11b: ['QA11b', 'QA11'],
};

function resolveAnswer(condition: QuestionCondition, answers: Record<string, QuestionnaireAnswer>) {
  const ids = condition.questionId ? QUESTION_ALIASES[condition.questionId] ?? [condition.questionId] : [];
  return ids.map((id) => answers[id]?.answer1?.toLowerCase()).find((value) => Boolean(value));
}

export function evaluateQuestionCondition(
  condition: QuestionCondition,
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
): boolean {
  if (condition.operator === 'always') {
    return true;
  }

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
    if (!answer) {
      return true;
    }
    return answer !== String(condition.value).toLowerCase();
  }

  if (!answer) {
    return false;
  }

  if (condition.operator === 'equals') {
    return answer === String(condition.value).toLowerCase();
  }

  if (condition.operator === 'notEquals') {
    return answer !== String(condition.value).toLowerCase();
  }

  if (condition.operator === 'in') {
    const accepted = Array.isArray(condition.value) ? condition.value.map((value) => value.toLowerCase()) : [String(condition.value).toLowerCase()];
    return accepted.includes(answer);
  }

  return false;
}

export function evaluateInactiveRules(
  rules: ActivationRule[],
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
): ActivationReason[] {
  return rules
    .filter((rule) => rule.when.conditions.every((condition) => evaluateQuestionCondition(condition, questionnaireAnswers)))
    .map((rule) => ({
      ruleId: rule.id,
      code: rule.reasonCode,
      message: rule.reasonText,
    }));
}

export function isAttackStepActive(
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
  attackStep: AttackStepDefinition,
): boolean {
  return evaluateInactiveRules(attackStep.inactiveWhen, questionnaireAnswers).length === 0;
}

export function computeAttackStepInstances(
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
  attackStepCatalog: AttackStepDefinition[],
): AttackStepInstance[] {
  return attackStepCatalog.map((attackStep) => {
    const inactiveReasons = evaluateInactiveRules(attackStep.inactiveWhen, questionnaireAnswers);
    const active = inactiveReasons.length === 0;
    const rap = computeRap(attackStep.baseEase, { rapThresholds: RAP_THRESHOLDS, easeDefinitions: EASE_DEFINITIONS });
    const factorExplanation = buildFactorExplanation(attackStep.baseEase, EASE_DEFINITIONS);

    return {
      id: attackStep.id,
      title: attackStep.title,
      group: attackStep.group,
      active,
      status: active ? AttackStepStatus.Active : AttackStepStatus.Inactive,
      inactiveReasons,
      proposedCountermeasureIds: attackStep.proposedCountermeasureIds,
      proposedAssumptionIds: attackStep.proposedAssumptionIds,
      additionalAssumptionIds: attackStep.additionalAssumptionIds,
      baseEase: attackStep.baseEase,
      rap,
      factorExplanation,
    };
  });
}
