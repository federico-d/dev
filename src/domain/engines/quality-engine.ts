import { ValidationSeverity } from '../enums';
import type {
  AnalysisStoreState,
  DocumentationFieldDefinition,
  MetadataState,
  QualityIndicator,
  QuestionCondition,
  QuestionDefinition,
  ValidationMessage,
  ValidationResult,
} from '../types';

type QualityCatalogs = {
  documentationFields: DocumentationFieldDefinition[];
  questions: QuestionDefinition[];
};

function getAnswer1(state: AnalysisStoreState, currentQuestionId: string, condition: QuestionCondition): string {
  const targetQuestionId = condition.questionId ?? currentQuestionId;
  return state.questionnaire.byId[targetQuestionId]?.answer1?.trim() ?? '';
}

function matchesCondition(state: AnalysisStoreState, currentQuestionId: string, condition: QuestionCondition) {
  const answer1 = getAnswer1(state, currentQuestionId, condition);
  const expected = condition.value;

  switch (condition.operator) {
    case 'always':
      return true;
    case 'notEmptyAnswer1':
      return Boolean(answer1);
    case 'equalsAnswer1':
    case 'equals':
      return answer1 === String(expected ?? '');
    case 'notEquals':
      return answer1 !== String(expected ?? '');
    case 'in':
      return Array.isArray(expected) && expected.includes(answer1);
    case 'notEqualsOrMissing':
      return !answer1 || answer1 !== String(expected ?? '');
    default:
      return false;
  }
}

function matchesAnyCondition(state: AnalysisStoreState, questionId: string, conditions: QuestionCondition[]) {
  if (conditions.length === 0) {
    return false;
  }

  return conditions.some((condition) => matchesCondition(state, questionId, condition));
}

function parseComparableNumber(value?: string): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function computeMetadataCompleteness(metadata: MetadataState, documentationFields: DocumentationFieldDefinition[]) {
  const requiredFieldIds = documentationFields.filter((field) => field.required).map((field) => field.id);
  const missingFieldIds = requiredFieldIds.filter((id) => !metadata[id]?.trim());
  const completionPercent =
    requiredFieldIds.length === 0
      ? 100
      : Math.round(((requiredFieldIds.length - missingFieldIds.length) / requiredFieldIds.length) * 100);

  return {
    completionPercent,
    missingFieldIds,
    requiredFieldIds,
  };
}

export function computeQuestionValidation(
  questionId: string,
  state: AnalysisStoreState,
  catalogs: QualityCatalogs,
): ValidationResult {
  const question = catalogs.questions.find((item) => item.id === questionId);
  if (!question) {
    return { id: questionId, messages: [], hasError: false, hasWarning: false };
  }

  const answer = state.questionnaire.byId[questionId];
  const answer1 = answer?.answer1?.trim() ?? '';
  const answer2 = answer?.answer2?.trim() ?? '';
  const rationale = answer?.rationale?.trim() ?? '';

  const messages: ValidationMessage[] = [];

  if (!answer1) {
    messages.push({
      id: `${questionId}-answer1-missing`,
      severity: ValidationSeverity.Error,
      message: 'Answer 1 is required.',
      questionId,
    });
  }

  if (matchesAnyCondition(state, questionId, question.detailsRequiredWhen) && !answer2) {
    messages.push({
      id: `${questionId}-details-missing`,
      severity: ValidationSeverity.Warning,
      message: 'Details are required for the selected Answer 1.',
      questionId,
    });
  }

  if (matchesAnyCondition(state, questionId, question.rationaleRequiredWhen) && !rationale) {
    messages.push({
      id: `${questionId}-rationale-missing`,
      severity: ValidationSeverity.Warning,
      message: 'Rationale is required for this answer.',
      questionId,
    });
  }

  const qa2 = state.questionnaire.byId.QA2?.answer1?.trim() ?? '';
  const qa6 = state.questionnaire.byId.QA6?.answer1?.trim() ?? '';
  if ((questionId === 'QA2' || questionId === 'QA6') && qa2 === 'internet-facing-gateway' && qa6 === 'no') {
    messages.push({
      id: 'qa2-qa6-inconsistency',
      severity: ValidationSeverity.Error,
      message: 'QA2/QA6 inconsistency: internet-facing gateway cannot have QA6 = No.',
      questionId,
    });
  }

  const qa20 = parseComparableNumber(state.questionnaire.byId.QA20?.answer1);
  const qa21 = parseComparableNumber(state.questionnaire.byId.QA21?.answer1);
  if ((questionId === 'QA20' || questionId === 'QA21') && qa20 !== null && qa21 !== null && qa20 > qa21) {
    messages.push({
      id: 'qa20-qa21-lifetime-support',
      severity: ValidationSeverity.Warning,
      message: 'Lifetime is greater than support duration.',
      questionId,
    });
  }

  return {
    id: questionId,
    messages,
    hasError: messages.some((message) => message.severity === ValidationSeverity.Error),
    hasWarning: messages.some((message) => message.severity === ValidationSeverity.Warning),
  };
}

export function computeQualityIndicators(state: AnalysisStoreState, catalogs: QualityCatalogs): QualityIndicator[] {
  const metadataCompleteness = computeMetadataCompleteness(state.metadata, catalogs.documentationFields);

  const unansweredQuestions = catalogs.questions.filter(
    (question) => !state.questionnaire.byId[question.id]?.answer1?.trim(),
  );

  const detailsMissingQuestions = catalogs.questions.filter((question) => {
    const answer2 = state.questionnaire.byId[question.id]?.answer2?.trim() ?? '';
    return matchesAnyCondition(state, question.id, question.detailsRequiredWhen) && !answer2;
  });

  const rationaleMissingQuestions = catalogs.questions.filter((question) => {
    const rationale = state.questionnaire.byId[question.id]?.rationale?.trim() ?? '';
    return matchesAnyCondition(state, question.id, question.rationaleRequiredWhen) && !rationale;
  });

  const qa2 = state.questionnaire.byId.QA2?.answer1?.trim() ?? '';
  const qa6 = state.questionnaire.byId.QA6?.answer1?.trim() ?? '';
  const qa2qa6Inconsistent = qa2 === 'internet-facing-gateway' && qa6 === 'no';

  const qa20 = parseComparableNumber(state.questionnaire.byId.QA20?.answer1);
  const qa21 = parseComparableNumber(state.questionnaire.byId.QA21?.answer1);
  const lifetimeViolation = qa20 !== null && qa21 !== null && qa20 > qa21;

  return [
    {
      id: 'QI-META-MISSING',
      title: 'Missing metadata',
      severity: ValidationSeverity.Error,
      count: metadataCompleteness.missingFieldIds.length,
      details: metadataCompleteness.missingFieldIds.map((id) => `Missing required metadata: ${id}`),
      affectedQuestionIds: [],
      affectedFieldIds: metadataCompleteness.missingFieldIds,
    },
    {
      id: 'QI-ANSWERS-MISSING',
      title: 'Unanswered questions',
      severity: ValidationSeverity.Error,
      count: unansweredQuestions.length,
      details: unansweredQuestions.map((question) => `${question.id} has no Answer 1.`),
      affectedQuestionIds: unansweredQuestions.map((question) => question.id),
      affectedFieldIds: [],
    },
    {
      id: 'QI-DETAILS-MISSING',
      title: 'Missing details',
      severity: ValidationSeverity.Warning,
      count: detailsMissingQuestions.length,
      details: detailsMissingQuestions.map((question) => `${question.id} requires details (Answer 2).`),
      affectedQuestionIds: detailsMissingQuestions.map((question) => question.id),
      affectedFieldIds: [],
    },
    {
      id: 'QI-RATIONALE-MISSING',
      title: 'Missing rationale',
      severity: ValidationSeverity.Warning,
      count: rationaleMissingQuestions.length,
      details: rationaleMissingQuestions.map((question) => `${question.id} requires rationale.`),
      affectedQuestionIds: rationaleMissingQuestions.map((question) => question.id),
      affectedFieldIds: [],
    },
    {
      id: 'QI-QA2-QA6-INCONSISTENT',
      title: 'QA2 / QA6 inconsistency',
      severity: ValidationSeverity.Error,
      count: qa2qa6Inconsistent ? 1 : 0,
      details: qa2qa6Inconsistent
        ? ['QA2 is Internet-facing gateway while QA6 is No.']
        : ['No inconsistency detected.'],
      affectedQuestionIds: qa2qa6Inconsistent ? ['QA2', 'QA6'] : [],
      affectedFieldIds: [],
    },
    {
      id: 'QI-LIFETIME-SUPPORT',
      title: 'Lifetime > Support Duration',
      severity: ValidationSeverity.Warning,
      count: lifetimeViolation ? 1 : 0,
      details: lifetimeViolation
        ? ['QA20 (lifetime) is greater than QA21 (support duration).']
        : ['Not violated or not evaluable.'],
      affectedQuestionIds: lifetimeViolation ? ['QA20', 'QA21'] : [],
      affectedFieldIds: [],
    },
  ];
}
