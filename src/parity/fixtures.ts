import type { QuestionnaireAnswer } from '../domain/types';

export type ParityFixture = {
  id: string;
  metadata: {
    name: string;
    workbookProfile?: string;
  };
  notes: string;
  questionnaire: Record<string, QuestionnaireAnswer>;
  expectedHighlights: string[];
};

export const PARITY_FIXTURES: ParityFixture[] = [
  {
    id: 'empty-analysis',
    metadata: { name: 'Empty analysis' },
    notes: 'No questionnaire answers, used for baseline completeness checks.',
    questionnaire: {},
    expectedHighlights: ['All questions unanswered', 'No QA2/QA6 inconsistency'],
  },
  {
    id: 'no-connectivity',
    metadata: { name: 'No connectivity profile' },
    notes: 'Minimal architecture with no connectivity exposure.',
    questionnaire: {
      QA1: { questionId: 'QA1', answer1: 'no' },
      QA2: { questionId: 'QA2', answer1: 'no' },
      QA6: { questionId: 'QA6', answer1: 'no' },
    },
    expectedHighlights: ['No QA2/QA6 inconsistency'],
  },
  {
    id: 'internet-facing-gateway-inconsistent',
    metadata: { name: 'Gateway inconsistent profile' },
    notes: 'Intentional inconsistency for regression test.',
    questionnaire: {
      QA2: { questionId: 'QA2', answer1: 'internet-facing-gateway' },
      QA6: { questionId: 'QA6', answer1: 'no' },
    },
    expectedHighlights: ['QA2/QA6 inconsistency is raised'],
  },
  {
    id: 'no-update-functionality',
    metadata: { name: 'No software update profile' },
    notes: 'QA11a and QA11b explicitly disabled.',
    questionnaire: {
      QA11a: { questionId: 'QA11a', answer1: 'no' },
      QA11b: { questionId: 'QA11b', answer1: 'no' },
    },
    expectedHighlights: ['QA11 split questions are both represented'],
  },
  {
    id: 'profile-a-baseline',
    metadata: { name: 'Profile A baseline', workbookProfile: 'A' },
    notes: 'Representative baseline with coherent lifecycle values.',
    questionnaire: {
      QI1: { questionId: 'QI1', answer1: 'low' },
      QA1: { questionId: 'QA1', answer1: 'yes' },
      QA2: { questionId: 'QA2', answer1: 'internal-local-gateway' },
      QA6: { questionId: 'QA6', answer1: 'yes' },
      QA20: { questionId: 'QA20', answer1: '10' },
      QA21: { questionId: 'QA21', answer1: '10' },
    },
    expectedHighlights: ['No lifetime/support warning', 'No QA2/QA6 inconsistency'],
  },
];
