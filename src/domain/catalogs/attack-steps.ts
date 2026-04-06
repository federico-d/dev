import type { ActivationRule, AttackStepDefinition, AttackStepGroup, EaseFactorSet, QuestionConditionGroup } from '../types';

const DEFAULT_EASE: EaseFactorSet = {
  elapsedTime: 1,
  expertise: 3,
  knowledgeOfToe: 3,
  windowOfOpportunity: 1,
  equipment: 4,
};

const BASE_EASE_BY_GROUP: Record<AttackStepGroup, EaseFactorSet> = {
  General: DEFAULT_EASE,
  Connectivity: { elapsedTime: 4, expertise: 3, knowledgeOfToe: 3, windowOfOpportunity: 1, equipment: 4 },
  Communication: { elapsedTime: 4, expertise: 3, knowledgeOfToe: 7, windowOfOpportunity: 4, equipment: 4 },
  Physical: { elapsedTime: 10, expertise: 6, knowledgeOfToe: 3, windowOfOpportunity: 10, equipment: 7 },
  Lifecycle: { elapsedTime: 10, expertise: 6, knowledgeOfToe: 7, windowOfOpportunity: 4, equipment: 7 },
  'Supply Chain': { elapsedTime: 19, expertise: 8, knowledgeOfToe: 7, windowOfOpportunity: 10, equipment: 9 },
};

function condition(questionId: string, expected: string | string[]): QuestionConditionGroup {
  return {
    conditions: [{ questionId, operator: Array.isArray(expected) ? 'in' : 'equals', value: expected }],
  };
}

function inactiveRule(id: string, questionId: string, expected: string | string[], reasonText: string): ActivationRule {
  return {
    id,
    reasonCode: `${questionId}-constraint`,
    reasonText,
    when: condition(questionId, expected),
  };
}

function inactiveRuleWithOperator(
  id: string,
  questionId: string,
  operator: 'equals' | 'in' | 'notEqualsOrMissing',
  expected: string | string[],
  reasonText: string,
): ActivationRule {
  return {
    id,
    reasonCode: `${questionId}-constraint`,
    reasonText,
    when: {
      conditions: [{ questionId, operator, value: expected }],
    },
  };
}

function makeStep(id: number, group: AttackStepGroup, overrides: Partial<AttackStepDefinition> = {}): AttackStepDefinition {
  const attackStepId = `AS${id}`;
  return {
    id: attackStepId,
    title: `Attack Step ${id}`,
    description: `Catalog attack step ${attackStepId}.`,
    group,
    inactiveWhen: [],
    proposedCountermeasureIds: ['CM1'],
    proposedAssumptionIds: ['A1'],
    additionalAssumptionIds: [],
    notes: '',
    baseEase: BASE_EASE_BY_GROUP[group],
    annexTags: [],
    ...overrides,
  };
}

export const ATTACK_STEPS_CATALOG: AttackStepDefinition[] = [
  makeStep(1, 'General'),
  makeStep(2, 'Connectivity', {
    inactiveWhen: [
      inactiveRule('as2-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'),
      inactiveRule('as2-qa5-no', 'QA5', 'no', 'Wireless/external access not available (QA5 = No).'),
      inactiveRule('as2-qa13-no', 'QA13', 'no', 'Wireless logical connectivity not present (QA13 = No).'),
    ],
  }),
  makeStep(3, 'Communication'),
  makeStep(4, 'Communication'),
  makeStep(5, 'Connectivity', { inactiveWhen: [inactiveRule('as5-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')] }),
  makeStep(6, 'Connectivity', { inactiveWhen: [inactiveRule('as6-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')] }),
  makeStep(7, 'Connectivity', { inactiveWhen: [inactiveRule('as7-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')] }),
  makeStep(8, 'Connectivity', {
    inactiveWhen: [
      inactiveRule('as8-qa5-no', 'QA5', 'no', 'Wireless/external access not available (QA5 = No).'),
      inactiveRule('as8-qa13-no', 'QA13', 'no', 'Wireless logical connectivity not present (QA13 = No).'),
    ],
  }),
  makeStep(9, 'Connectivity', {
    inactiveWhen: [
      inactiveRule('as9-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'),
      inactiveRule('as9-qa2-no', 'QA2', 'no', 'Required connectivity mode is unavailable (QA2 = No).'),
    ],
  }),
  makeStep(10, 'Connectivity', { inactiveWhen: [inactiveRule('as10-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')] }),
  makeStep(11, 'Connectivity', { inactiveWhen: [inactiveRule('as11-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')] }),
  makeStep(12, 'Connectivity', {
    inactiveWhen: [
      inactiveRule('as12-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'),
      inactiveRule('as12-qa10a-no', 'QA10a', 'no', 'No condition for this communication vector (QA10a = No).'),
    ],
  }),
  makeStep(13, 'Connectivity', {
    inactiveWhen: [
      inactiveRule('as13-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'),
      inactiveRule('as13-qa12-no', 'QA12', 'no', 'Physical access channel is absent (QA12 = No).'),
    ],
  }),
  makeStep(14, 'Connectivity', { inactiveWhen: [inactiveRule('as14-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')] }),
  makeStep(15, 'Connectivity', {
    inactiveWhen: [
      inactiveRule('as15-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'),
      inactiveRule('as15-qa6-no', 'QA6', 'no', 'No communication interface available (QA6 = No).'),
    ],
  }),
  makeStep(16, 'Connectivity', { inactiveWhen: [inactiveRule('as16-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')] }),
  makeStep(17, 'Connectivity', { inactiveWhen: [inactiveRule('as17-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')] }),
  makeStep(18, 'Physical', { inactiveWhen: [inactiveRule('as18-qa11a-no', 'QA11a', 'no', 'Physical precondition not met (QA11a = No).')] }),
  makeStep(19, 'Physical', { inactiveWhen: [inactiveRule('as19-qa11a-no', 'QA11a', 'no', 'Physical precondition not met (QA11a = No).')] }),
  makeStep(20, 'Physical', { inactiveWhen: [inactiveRule('as20-qa11a-no', 'QA11a', 'no', 'Physical precondition not met (QA11a = No).')] }),
  makeStep(21, 'Physical', { inactiveWhen: [inactiveRule('as21-qa14-no', 'QA14', 'no', 'Required physical channel unavailable (QA14 = No).')] }),
  makeStep(22, 'Physical', { inactiveWhen: [inactiveRule('as22-qa14-no', 'QA14', 'no', 'Required physical channel unavailable (QA14 = No).')] }),
  makeStep(23, 'Physical', { inactiveWhen: [inactiveRule('as23-qa14-no', 'QA14', 'no', 'Required physical channel unavailable (QA14 = No).')] }),
  makeStep(24, 'Physical'),
  makeStep(25, 'Lifecycle', { inactiveWhen: [inactiveRule('as25-qa17-no', 'QA17', 'no', 'Lifecycle capability unavailable (QA17 = No).')] }),
  makeStep(26, 'Lifecycle', { inactiveWhen: [inactiveRule('as26-qa17-no', 'QA17', 'no', 'Lifecycle capability unavailable (QA17 = No).')] }),
  makeStep(27, 'Physical', {
    inactiveWhen: [
      inactiveRule('as27-qa14-no', 'QA14', 'no', 'Required physical channel unavailable (QA14 = No).'),
      inactiveRule('as27-qa16-no', 'QA16', 'no', 'Lifecycle operation not available (QA16 = No).'),
    ],
  }),
  makeStep(28, 'Communication'),
  makeStep(29, 'Communication', { inactiveWhen: [inactiveRule('as29-qa9-no', 'QA9', 'no', 'Communication vector not present (QA9 = No).')] }),
  makeStep(30, 'Communication'),
  makeStep(31, 'Connectivity', {
    inactiveWhen: [
      inactiveRule('as31-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'),
      inactiveRule('as31-qa2-no', 'QA2', 'no', 'Required connectivity mode is unavailable (QA2 = No).'),
    ],
  }),
  makeStep(32, 'Communication'),
  makeStep(33, 'Communication', { inactiveWhen: [inactiveRule('as33-qa10b-no', 'QA10b', 'no', 'Feature is absent (QA10b = No).')] }),
  makeStep(34, 'Connectivity', {
    inactiveWhen: [
      inactiveRule('as34-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'),
      inactiveRule('as34-qa10b-no', 'QA10b', 'no', 'Feature is absent (QA10b = No).'),
    ],
  }),
  makeStep(35, 'Connectivity', {
    inactiveWhen: [
      inactiveRule('as35-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'),
      inactiveRule('as35-qa10b-no', 'QA10b', 'no', 'Feature is absent (QA10b = No).'),
    ],
  }),
  makeStep(36, 'Connectivity', {
    inactiveWhen: [
      inactiveRule('as36-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'),
      inactiveRule('as36-qa10b-no', 'QA10b', 'no', 'Feature is absent (QA10b = No).'),
    ],
  }),
  makeStep(37, 'Lifecycle', { inactiveWhen: [inactiveRule('as37-qa18-yes', 'QA18', 'yes', 'Secure production process already enforced (QA18 = Yes).')] }),
  makeStep(38, 'Supply Chain', {
    inactiveWhen: [inactiveRule('as38-qa19-trusted', 'QA19', ['yes', 'trusted'], 'Supply chain already trusted (QA19 trusted/yes).')],
    baseEase: { elapsedTime: 19, expertise: 8, knowledgeOfToe: 11, windowOfOpportunity: 10, equipment: 9 },
    notes: 'Base EASE values estimated from supply-chain threat profile; refine with workbook parity in Sprint 3A.',
  }),
  makeStep(39, 'Lifecycle'),
  makeStep(40, 'Lifecycle', {
    inactiveWhen: [
      inactiveRuleWithOperator(
        'as40-qa11b-not-no',
        'QA11b',
        'notEqualsOrMissing',
        'no',
        'AS40 is only applicable when update functionality is absent (QA11b = No).',
      ),
    ],
    notes: 'AS40 is explicitly relevant when update functionality is absent (QA11b = No).',
  }),
  makeStep(41, 'General'),
];
