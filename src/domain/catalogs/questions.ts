import type { QuestionDefinition, QuestionOption } from '../types';

const YES_NO_OPTIONS: QuestionOption[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const IMPACT_OPTIONS: QuestionOption[] = [
  { label: 'None', value: 'none' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const CONNECTIVITY_OPTIONS: QuestionOption[] = [
  { label: 'None', value: 'none' },
  { label: 'Local Network', value: 'local-network' },
  { label: 'Internet-facing gateway', value: 'internet-facing-gateway' },
];

const COMMUNICATION_OPTIONS: QuestionOption[] = [
  { label: 'No external protocol', value: 'none' },
  { label: 'Standard protocol', value: 'standard' },
  { label: 'Custom protocol', value: 'custom' },
];

const PHYSICAL_ACCESS_OPTIONS: QuestionOption[] = [
  { label: 'Restricted', value: 'restricted' },
  { label: 'Controlled', value: 'controlled' },
  { label: 'Uncontrolled', value: 'uncontrolled' },
];

const LIFECYCLE_OPTIONS: QuestionOption[] = [
  { label: '< 1 year', value: '1' },
  { label: '1-3 years', value: '3' },
  { label: '3-5 years', value: '5' },
  { label: '> 5 years', value: '8' },
];

function qi(questionNumber: number, section: 'Confidentiality' | 'Availability' | 'Integrity', order: number): QuestionDefinition {
  return {
    id: `QI${questionNumber}`,
    kind: 'QI',
    group: 'Impact',
    section,
    order,
    title: `QI${questionNumber} - Impact assessment question`,
    answer1Type: 'singleSelect',
    answer1Options: IMPACT_OPTIONS,
    hasAnswer2: true,
    answer2Label: 'Details',
    answer2Type: 'text',
    answer2Options: [],
    detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'high' }, { operator: 'equalsAnswer1', value: 'critical' }],
    rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }],
  };
}

function qa(
  questionNumber: number,
  section: 'Connectivity' | 'Communication' | 'Physical Access' | 'Lifecycle',
  order: number,
  answer1Options: QuestionOption[],
  answer1Type: 'singleSelect' | 'duration' = 'singleSelect',
): QuestionDefinition {
  return {
    id: `QA${questionNumber}`,
    kind: 'QA',
    group: 'Architecture',
    section,
    order,
    title: `QA${questionNumber} - Architecture assessment question`,
    answer1Type,
    answer1Options,
    hasAnswer2: true,
    answer2Label: 'Details',
    answer2Type: 'text',
    answer2Options: [],
    detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }, { operator: 'equalsAnswer1', value: 'internet-facing-gateway' }],
    rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }],
  };
}

export const QUESTIONS_CATALOG: QuestionDefinition[] = [
  qi(1, 'Confidentiality', 1),
  qi(2, 'Confidentiality', 2),
  qi(3, 'Confidentiality', 3),
  qi(4, 'Confidentiality', 4),
  qi(5, 'Availability', 5),
  qi(6, 'Availability', 6),
  qi(7, 'Availability', 7),
  qi(8, 'Availability', 8),
  qi(9, 'Integrity', 9),
  qi(10, 'Integrity', 10),
  qi(11, 'Integrity', 11),
  qi(12, 'Integrity', 12),
  qi(13, 'Integrity', 13),
  qi(14, 'Integrity', 14),
  qi(15, 'Integrity', 15),
  qi(16, 'Integrity', 16),
  qa(1, 'Connectivity', 17, YES_NO_OPTIONS),
  qa(2, 'Connectivity', 18, CONNECTIVITY_OPTIONS),
  qa(3, 'Connectivity', 19, YES_NO_OPTIONS),
  qa(4, 'Connectivity', 20, YES_NO_OPTIONS),
  qa(5, 'Connectivity', 21, YES_NO_OPTIONS),
  qa(6, 'Communication', 22, YES_NO_OPTIONS),
  qa(7, 'Communication', 23, COMMUNICATION_OPTIONS),
  qa(8, 'Communication', 24, YES_NO_OPTIONS),
  qa(9, 'Communication', 25, YES_NO_OPTIONS),
  qa(10, 'Communication', 26, YES_NO_OPTIONS),
  qa(11, 'Physical Access', 27, PHYSICAL_ACCESS_OPTIONS),
  qa(12, 'Physical Access', 28, YES_NO_OPTIONS),
  qa(13, 'Physical Access', 29, YES_NO_OPTIONS),
  qa(14, 'Physical Access', 30, YES_NO_OPTIONS),
  qa(15, 'Physical Access', 31, YES_NO_OPTIONS),
  qa(16, 'Lifecycle', 32, YES_NO_OPTIONS),
  qa(17, 'Lifecycle', 33, YES_NO_OPTIONS),
  qa(18, 'Lifecycle', 34, YES_NO_OPTIONS),
  qa(19, 'Lifecycle', 35, YES_NO_OPTIONS),
  qa(20, 'Lifecycle', 36, LIFECYCLE_OPTIONS, 'duration'),
  qa(21, 'Lifecycle', 37, LIFECYCLE_OPTIONS, 'duration'),
];

export const QUESTION_SECTIONS_ORDER = [
  'Impact / Confidentiality',
  'Impact / Availability',
  'Impact / Integrity',
  'Architecture / Connectivity',
  'Architecture / Communication',
  'Architecture / Physical Access',
  'Architecture / Lifecycle',
] as const;
