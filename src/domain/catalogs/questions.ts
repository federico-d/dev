import { QA18_SECURE_PRODUCTION_SCALE, QA19_SUPPLY_CHAIN_TRUST_SCALE } from './definitions';
import type { QuestionDefinition, QuestionOption } from '../types';

const YES_NO_OPTIONS: QuestionOption[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const QA2_GATEWAY_OPTIONS: QuestionOption[] = [
  { label: 'No', value: 'no' },
  { label: 'Internal / local gateway', value: 'internal-local-gateway' },
  { label: 'Internet-facing gateway', value: 'internet-facing-gateway' },
];

const QA20_21_DURATION_OPTIONS: QuestionOption[] = [
  { label: '< 1 year', value: '1' },
  { label: '1–3 years', value: '3' },
  { label: '4–5 years', value: '5' },
  { label: '6–10 years', value: '10' },
  { label: '> 10 years', value: '15' },
];

const IMPACT_PERSONAL_DATA_OPTIONS: QuestionOption[] = [
  { label: 'Low', value: 'low' },
  { label: 'Significant', value: 'significant' },
  { label: 'Ruinous', value: 'ruinous' },
];

const IMPACT_OEM_IP_OPTIONS: QuestionOption[] = [
  { label: 'Slightly innovative', value: 'slightly-innovative' },
  { label: 'Moderately innovative', value: 'moderately-innovative' },
  { label: 'Highly innovative', value: 'highly-innovative' },
];

const IMPACT_FINANCIAL_OPTIONS: QuestionOption[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const IMPACT_INJURY_OPTIONS: QuestionOption[] = [
  { label: 'Potentially dangerous', value: 'potentially-dangerous' },
  { label: 'Light or moderate injury', value: 'light-or-moderate-injury' },
  { label: 'Severe injury', value: 'severe-injury' },
  { label: 'Life-threatening injury', value: 'life-threatening-injury' },
];

const IMPACT_OPERATIONAL_OPTIONS: QuestionOption[] = [
  { label: 'Disturbance', value: 'disturbance' },
  { label: 'Service required', value: 'service-required' },
  { label: 'Major disturbance', value: 'major-disturbance' },
  { label: 'Critical disturbance', value: 'critical-disturbance' },
  { label: 'Environmental damage', value: 'environmental-damage' },
  { label: 'Critical environmental damage', value: 'critical-environmental-damage' },
];

const hasHighImpact: import('../types').QuestionCondition[] = [
  { operator: 'in', value: ['high', 'critical', 'ruinous', 'highly-innovative', 'severe-injury', 'life-threatening-injury', 'critical-disturbance', 'critical-environmental-damage'] },
];

function qi(def: Omit<QuestionDefinition, 'kind' | 'group' | 'sourceSheet' | 'hasAnswer2' | 'answer2Label' | 'answer2Type' | 'answer2Options'>): QuestionDefinition {
  return {
    ...def,
    kind: 'QI',
    group: 'Impact',
    sourceSheet: 'Questions',
    hasAnswer2: true,
    answer2Label: 'Impact details',
    answer2Type: 'text',
    answer2Options: [],
  };
}

function qa(def: Omit<QuestionDefinition, 'kind' | 'group' | 'sourceSheet'>): QuestionDefinition {
  return {
    ...def,
    kind: 'QA',
    group: 'Architecture',
    sourceSheet: 'Questions',
  };
}

export const QUESTIONS_CATALOG: QuestionDefinition[] = [
  qi({ id: 'QI1', workbookOrder: 1, section: 'Confidentiality', title: 'Does the product provide cameras or other sensors with person-recognition capabilities?', answer1Type: 'singleSelect', answer1Options: IMPACT_PERSONAL_DATA_OPTIONS, detailsRequiredWhen: [...hasHighImpact], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI2', workbookOrder: 2, section: 'Confidentiality', title: 'Does the product process personal data?', additionalQuestionText: '(e.g. user IDs, address labels)', answer1Type: 'singleSelect', answer1Options: IMPACT_PERSONAL_DATA_OPTIONS, detailsRequiredWhen: [...hasHighImpact], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI3', workbookOrder: 3, section: 'Confidentiality', title: 'Does the product contain OEM intellectual property?', additionalQuestionText: '(Only firmware/software-accessible IP is in scope; optical and mechanical IP excluded)', answer1Type: 'singleSelect', answer1Options: IMPACT_OEM_IP_OPTIONS, detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'highly-innovative' }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI4', workbookOrder: 4, section: 'Confidentiality', title: 'Is the OEM obliged to keep processed/stored data confidential due to contract or law?', additionalQuestionText: '(Does not refer to standard warranty)', answer1Type: 'singleSelect', answer1Options: IMPACT_FINANCIAL_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['high', 'critical'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI5', workbookOrder: 5, section: 'Confidentiality', title: 'Does the product contain credentials / cryptographic keys that enable access to sensitive data or systems in the operating environment?', additionalQuestionText: '(Includes crypto material introduced by the customer)', answer1Type: 'singleSelect', answer1Options: IMPACT_FINANCIAL_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['high', 'critical'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI6', workbookOrder: 6, section: 'Availability', title: "Can a loss of availability of the product (or its communication) endanger people's health?", additionalQuestionText: 'Consider the reaction of the operating environment.', answer1Type: 'singleSelect', answer1Options: IMPACT_INJURY_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['severe-injury', 'life-threatening-injury'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI7', workbookOrder: 7, section: 'Availability', title: "Is the product's availability relevant to its operating environment?", answer1Type: 'singleSelect', answer1Options: IMPACT_OPERATIONAL_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['major-disturbance', 'critical-disturbance', 'environmental-damage', 'critical-environmental-damage'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI8', workbookOrder: 8, section: 'Availability', title: 'Can a loss of availability allow an attacker access to customer assets?', additionalQuestionText: '(including undetected physical access not detected by the OEM product). Example: the product is used for access control.', answer1Type: 'singleSelect', answer1Options: IMPACT_OPERATIONAL_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['major-disturbance', 'critical-disturbance'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI9', workbookOrder: 9, section: 'Availability', title: 'Can a loss of availability cause contractual penalties?', additionalQuestionText: '(e.g. SLA-based)', answer1Type: 'singleSelect', answer1Options: IMPACT_FINANCIAL_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['high', 'critical'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI10', workbookOrder: 10, section: 'Integrity', title: "Can a manipulated product (or its communication) endanger people's health?", additionalQuestionText: 'Also consider misuse or wrong configuration.', answer1Type: 'singleSelect', answer1Options: IMPACT_INJURY_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['severe-injury', 'life-threatening-injury'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI11', workbookOrder: 11, section: 'Integrity', title: 'Can a manipulated product disclose personal data to an attacker?', additionalQuestionText: 'Also consider misuse or wrong configuration.', answer1Type: 'singleSelect', answer1Options: IMPACT_PERSONAL_DATA_OPTIONS, detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'ruinous' }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI12', workbookOrder: 12, section: 'Integrity', title: 'Can a manipulated product disclose intellectual property to an attacker?', additionalQuestionText: 'Also consider misuse or wrong configuration.', answer1Type: 'singleSelect', answer1Options: IMPACT_OEM_IP_OPTIONS, detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'highly-innovative' }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI13', workbookOrder: 13, section: 'Integrity', title: 'Can a manipulated product disclose credentials / cryptographic material to an attacker, or misuse its own access to other systems?', additionalQuestionText: 'Example: credentials to store data on servers.', answer1Type: 'singleSelect', answer1Options: IMPACT_FINANCIAL_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['high', 'critical'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI14', workbookOrder: 14, section: 'Integrity', title: 'Can a manipulated product affect the functioning of its operating environment?', answer1Type: 'singleSelect', answer1Options: IMPACT_OPERATIONAL_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['major-disturbance', 'critical-disturbance', 'environmental-damage', 'critical-environmental-damage'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI15', workbookOrder: 15, section: 'Integrity', title: 'Can a manipulated product allow an attacker access to customer assets or enable attacks on the customer network?', answer1Type: 'singleSelect', answer1Options: IMPACT_OPERATIONAL_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['major-disturbance', 'critical-disturbance'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qi({ id: 'QI16', workbookOrder: 16, section: 'Integrity', title: 'Can a manipulated product cause contractual / legal penalties?', additionalQuestionText: '(Does not refer to standard warranty)', answer1Type: 'singleSelect', answer1Options: IMPACT_FINANCIAL_OPTIONS, detailsRequiredWhen: [{ operator: 'in', value: ['high', 'critical'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),

  qa({ id: 'QA1', workbookOrder: 17, section: 'Connectivity', title: 'Does the product have any kind of connectivity?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Connectivity details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA2', workbookOrder: 18, section: 'Connectivity', title: 'Does the product connect two networks together (e.g. as a gateway)?', answer1Type: 'singleSelect', answer1Options: QA2_GATEWAY_OPTIONS, hasAnswer2: true, answer2Label: 'Gateway details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'internet-facing-gateway' }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qa({ id: 'QA3', workbookOrder: 19, section: 'Connectivity', title: 'Does the product provide a point-to-point connection with another device?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Connection details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA4', workbookOrder: 20, section: 'Connectivity', title: 'Does the product have a direct connection to a local network?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Network details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA5', workbookOrder: 21, section: 'Connectivity', title: 'Does the product support wireless connections?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Wireless details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA6', workbookOrder: 22, section: 'Connectivity', title: 'Does the product have a direct connection to a mobile network / Internet?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Internet details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA7', workbookOrder: 23, section: 'Connectivity', title: 'Does the product offer services to other entities on the network?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Service details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA8', workbookOrder: 24, section: 'Connectivity', title: 'Does the product offer a configuration interface?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Configuration details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA9', workbookOrder: 25, section: 'Connectivity', title: 'Does the product have an IP stack (or another routable protocol)?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Protocol details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA10a', workbookOrder: 26, section: 'External Systems', title: 'Does the product communicate with an external system locally (e.g. USB stick, SD card, RFID tag)?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Local external system details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA10b', workbookOrder: 27, section: 'External Systems', title: 'Does the product communicate with an external system on the Internet?', additionalQuestionText: '(e.g. untrusted third-party backend, OEM cloud, OEM server system)', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Internet external system details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA11a', workbookOrder: 28, section: 'Updates', title: 'Can the product software be updated through an interface?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Update interface details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA11b', workbookOrder: 29, section: 'Updates', title: 'Are field software updates planned (regularly or event-based)?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Update plan details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA12', workbookOrder: 30, section: 'Deployment', title: 'Does the product have a logical connection to a local network via gateway?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Gateway linkage details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA13', workbookOrder: 31, section: 'Deployment', title: 'Does the product have a logical connection to a wireless network via gateway?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Wireless gateway details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA14', workbookOrder: 32, section: 'Deployment', title: 'Is the product typically installed in a physically accessible location?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Physical access details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA15', workbookOrder: 33, section: 'Deployment', title: 'Is the product typically installed in an operating environment with public access?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Public access details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA16', workbookOrder: 34, section: 'Deployment', title: 'Are the physical connections of the product (e.g. connected bus cables) typically installed in an environment with public access?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Connection exposure details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA17', workbookOrder: 35, section: 'Deployment', title: 'Does the product provide debug / development interfaces (e.g. JTAG, root access via SSH)?', answer1Type: 'singleSelect', answer1Options: YES_NO_OPTIONS, hasAnswer2: true, answer2Label: 'Debug interface details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }], rationaleRequiredWhen: [{ operator: 'equalsAnswer1', value: 'yes' }] }),
  qa({ id: 'QA18', workbookOrder: 36, section: 'Supply Chain & Lifecycle', title: 'Is the product produced in a secure environment?', answer1Type: 'singleSelect', answer1Options: QA18_SECURE_PRODUCTION_SCALE, hasAnswer2: true, answer2Label: 'Production controls details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'in', value: ['no-protection', 'internal-access-control'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qa({ id: 'QA19', workbookOrder: 37, section: 'Supply Chain & Lifecycle', title: 'Are supply-chain partners trustworthy and protected against attacks?', answer1Type: 'singleSelect', answer1Options: QA19_SUPPLY_CHAIN_TRUST_SCALE, hasAnswer2: true, answer2Label: 'Supply-chain details', answer2Type: 'text', answer2Options: [], detailsRequiredWhen: [{ operator: 'in', value: ['not-trusted', 'na-no-supplier'] }], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qa({ id: 'QA20', workbookOrder: 38, section: 'Supply Chain & Lifecycle', title: 'What is the expected lifetime of the product?', instructions: 'Used for quality check: Lifetime > Support Duration.', answer1Type: 'duration', answer1Options: QA20_21_DURATION_OPTIONS, hasAnswer2: false, detailsRequiredWhen: [], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
  qa({ id: 'QA21', workbookOrder: 39, section: 'Supply Chain & Lifecycle', title: 'What is the planned support duration of the product?', instructions: 'Use values comparable with QA20.', answer1Type: 'duration', answer1Options: QA20_21_DURATION_OPTIONS, hasAnswer2: false, detailsRequiredWhen: [], rationaleRequiredWhen: [{ operator: 'notEmptyAnswer1' }] }),
];

export const QUESTION_SECTIONS_ORDER = [
  'Impact / Confidentiality',
  'Impact / Availability',
  'Impact / Integrity',
  'Architecture / Connectivity',
  'Architecture / External Systems',
  'Architecture / Updates',
  'Architecture / Deployment',
  'Architecture / Supply Chain & Lifecycle',
];
