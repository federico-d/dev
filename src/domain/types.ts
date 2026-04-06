import type {
  AttackStepStatus,
  DamageLevelLabel,
  NavGroup,
  RapLevel,
  RiskLevelLabel,
  SheetStatus,
  ValidationSeverity,
} from './enums';

export type SheetId =
  | 'license'
  | 'readme'
  | 'version-history'
  | 'definitions'
  | 'questions'
  | 'damage-scenarios'
  | 'attack-steps'
  | 'assumptions'
  | 'countermeasures'
  | 'documentation'
  | 'questionnaire'
  | 'ds-overview'
  | 'risks'
  | 'mitigation'
  | 'risk-treatment'
  | 'result-summary'
  | 'annex-i-1-2-report'
  | 'tracing'
  | 'tasks'
  | 'quality-indicators'
  | 'json-export'
  | 'user-information'
  | 'profile-definitions'
  | 'helper';

export type SheetDefinition = {
  id: SheetId;
  sheetName: string;
  route: string;
  navGroup: NavGroup;
  advanced: boolean;
  status: SheetStatus;
  description: string;
  dependsOn: string[];
  expectedData: string[];
};

export type AnalysisMeta = {
  analysisId: string;
  createdAt: string;
  updatedAt: string;
  templateVersion: string;
  dirty: boolean;
};

export type DocumentationFieldGroup = 'core' | 'contacts' | 'release' | 'cra-user-info';
export type DocumentationFieldType = 'text' | 'email' | 'textarea' | 'date' | 'url';

export type DocumentationFieldDefinition = {
  id: keyof MetadataState;
  label: string;
  group: DocumentationFieldGroup;
  required: boolean;
  fieldType: DocumentationFieldType;
  placeholder: string | null;
  helpText: string | null;
};

export type MetadataState = {
  toeName?: string;
  author?: string;
  pmContact?: string;
  rdContact?: string;
  css?: string;
  csts?: string;
  version?: string;
  changeHistory?: string;
};

export type QuestionKind = 'QI' | 'QA';
export type QuestionAnswerType = 'boolean' | 'singleSelect' | 'text' | 'duration';

export type QuestionOption = {
  label: string;
  value: string;
};

export type QuestionCondition = {
  questionId?: string;
  operator: 'always' | 'notEmptyAnswer1' | 'equalsAnswer1' | 'equals' | 'notEquals' | 'in' | 'notEqualsOrMissing';
  value?: string | string[];
};

export type QuestionConditionGroup = {
  conditions: QuestionCondition[];
};

export type QuestionDefinition = {
  id: string;
  workbookOrder: number;
  kind: QuestionKind;
  group: string;
  section: string;
  title: string;
  additionalQuestionText?: string;
  instructions?: string;
  answer1Type: QuestionAnswerType;
  answer1Options: QuestionOption[];
  hasAnswer2: boolean;
  answer2Label?: string | null;
  answer2Type?: QuestionAnswerType | null;
  answer2Options?: QuestionOption[];
  detailsRequiredWhen: QuestionCondition[];
  rationaleRequiredWhen: QuestionCondition[];
  sourceSheet: string;
  workbookNotes?: string;
};

export type QuestionnaireAnswer = {
  questionId: string;
  answer1?: string;
  answer2?: string;
  rationale?: string;
};

export type DamageCategory = 'C' | 'I' | 'A' | 'F';

export type DamageLevel = {
  label: DamageLevelLabel;
  value: 1 | 2 | 3 | 4 | 5;
};

export type DamageRule = {
  questionId: string;
  answerValue: string;
  category: DamageCategory;
  damageLevelLabel: DamageLevelLabel;
  damageLevelValue: 1 | 2 | 3 | 4 | 5;
  note: string;
};

export type DamageScenario = {
  id: string;
  sourceQuestionId: string;
  category: DamageCategory;
  damageLevel: DamageLevel;
  note: string;
};

export type DamageCategoryResult = Record<DamageCategory, DamageLevel>;

export type RiskId = string;

export type RiskLevel = RiskLevelLabel;
export type RiskLevelValue = 0 | 1 | 2 | 3 | 4;

export type RiskMatrixCell = {
  rap: RapLevel;
  rapLabel: RapLevel;
  damageLevelValue: 1 | 2 | 3 | 4 | 5;
  riskLevel: RiskLevelLabel;
  riskLevelValue: RiskLevelValue;
};

export type RiskMatrixLookupKey = `${RapLevel}|${1 | 2 | 3 | 4 | 5}`;

export type EaseFactorName =
  | 'elapsedTime'
  | 'expertise'
  | 'knowledgeOfToe'
  | 'windowOfOpportunity'
  | 'equipment';

export type EaseOption = {
  label: string;
  score: number;
  note?: string;
};

export type EaseFactorSet = {
  elapsedTime: number;
  expertise: number;
  knowledgeOfToe: number;
  windowOfOpportunity: number;
  equipment: number;
};

export type RapThresholdDefinition = {
  min: number;
  level: RapLevel;
  rank: number;
};

export type FactorExplanationEntry = {
  factor: EaseFactorName;
  score: number;
  label: string;
};

export type RapComputation = {
  sum: number;
  rapLevel: RapLevel;
  rapNumericRank: number;
  factors: EaseFactorSet;
};

export type AssumptionStatus = 'default' | 'potentialAdditional' | 'activeByTemplate' | 'conditional';

export type AssumptionDefinition = {
  id: string;
  name: string;
  reference: string;
  stakeholder: string;
  description: string;
  status: AssumptionStatus;
  annexMappings: string[];
};

export type CountermeasureDefinition = {
  id: string;
  name: string;
  reference: string;
  stakeholder: string;
  type: 'Default' | 'Additional' | 'Baseline' | 'CM';
  description: string;
  easeDelta: EaseFactorSet;
  forcedMinimumRap: RapLevel | null;
  annexMappings: string[];
  configFlags: {
    requiresOemConfiguration: boolean;
    incompleteInTemplate: boolean;
  };
};

export type AttackStepGroup =
  | 'Connectivity'
  | 'Communication'
  | 'Physical'
  | 'Lifecycle'
  | 'Supply Chain'
  | 'General';

export type ActivationRule = {
  id: string;
  reasonCode: string;
  reasonText: string;
  when: QuestionConditionGroup;
};

export type ActivationReason = {
  ruleId: string;
  code: string;
  message: string;
};

export type AttackStepDefinition = {
  id: string;
  title: string;
  description: string;
  group: AttackStepGroup;
  inactiveWhen: ActivationRule[];
  proposedCountermeasureIds: string[];
  proposedAssumptionIds: string[];
  additionalAssumptionIds: string[];
  notes: string;
  baseEase: EaseFactorSet;
  annexTags: string[];
};

export type AttackStepInstance = {
  id: string;
  title: string;
  group: AttackStepGroup;
  active: boolean;
  status: AttackStepStatus;
  inactiveReasons: ActivationReason[];
  proposedCountermeasureIds: string[];
  proposedAssumptionIds: string[];
  additionalAssumptionIds: string[];
  baseEase: EaseFactorSet;
  rap: RapComputation;
  factorExplanation: FactorExplanationEntry[];
};

export type AttackStepRapResult = {
  attackStepId: string;
  attackStepTitle: string;
  active: boolean;
  rap: RapComputation;
  factorExplanation: FactorExplanationEntry[];
};

export type DamageScenarioRef = {
  id: string;
  category: DamageCategory;
  damageLevelLabel: DamageLevelLabel;
  damageLevelValue: 1 | 2 | 3 | 4 | 5;
};

export type PreliminaryAttackPath = string[];

export type RiskRowSource = {
  strategy: 'allAttackStepsXDamageScenarios' | 'linkedDamageScenariosOnly';
  note: string;
};

export type PreliminaryRiskRow = {
  attackStepId: string;
  attackStepTitle: string;
  active: boolean;
  rapLevel: RapLevel;
  rapSum: number;
  factorExplanation: FactorExplanationEntry[];
  linkedDamageScenarioIds: string[];
  notes: string;
};

export type RiskRow = {
  riskId: RiskId;
  attackPath: PreliminaryAttackPath;
  attackStepId: string;
  attackStepTitle: string;
  active: boolean;
  damageScenarioId: string;
  damageCategory: DamageCategory;
  damageLevelLabel: DamageLevelLabel;
  damageLevelValue: 1 | 2 | 3 | 4 | 5;
  rapLevel: RapLevel;
  rapSum: number;
  riskLevel: RiskLevel;
  riskLevelValue: RiskLevelValue;
  factorExplanation: FactorExplanationEntry[];
  notes: string;
};

export type RiskSummaryStats = {
  total: number;
  noRisk: number;
  low: number;
  moderate: number;
  high: number;
  veryHigh: number;
  highestRiskLevelPresent: RiskLevel | null;
  activeRiskRows: number;
  inactiveRiskRows: number;
};

export type RiskComputationResult = {
  rows: RiskRow[];
  summary: RiskSummaryStats;
  source: RiskRowSource;
};

export type ValidationMessage = {
  id: string;
  severity: ValidationSeverity;
  message: string;
  questionId?: string;
  fieldId?: keyof MetadataState;
};

export type ValidationResult = {
  id: string;
  messages: ValidationMessage[];
  hasError: boolean;
  hasWarning: boolean;
};

export type QualityIndicator = {
  id: string;
  title: string;
  severity: ValidationSeverity;
  count: number;
  details: string[];
  affectedQuestionIds: string[];
  affectedFieldIds: (keyof MetadataState)[];
};

export type MitigationSelection = {
  attackStepId: string;
  rawInput?: string;
  parsedItems?: MitigationParsedItem[];
  validationErrors?: string[];
};

export type MitigationParsedCountermeasure = {
  kind: 'countermeasure';
  id: string;
  forcedMinimumRap?: RapLevel;
  raw: string;
};

export type MitigationParsedAssumption = {
  kind: 'assumption';
  id: string;
  raw: string;
};

export type MitigationParsedItem = MitigationParsedCountermeasure | MitigationParsedAssumption;

export type MitigationParseError = {
  raw: string;
  message: string;
  index: number;
};

export type ForcedMinimumRap = RapLevel | null;

export type NetRapResult = {
  netRapSum: number;
  netRapLevel: RapLevel;
  netRapNumericRank: number;
  factors: EaseFactorSet;
};

export type NetRiskRow = {
  riskId: string;
  damageScenarioId: string;
  baseRiskLevel: RiskLevel;
  netRiskLevel: RiskLevel;
  netRiskLevelValue: RiskLevelValue;
  rapLevel: RapLevel;
  netRapLevel: RapLevel;
  netRapSum: number;
};

export type MitigationValidationResult = {
  attackStepId: string;
  issues: string[];
};

export type MitigationRow = {
  attackStepId: string;
  attackStepTitle: string;
  active: boolean;
  proposedCountermeasureIds: string[];
  proposedAssumptionIds: string[];
  additionalAssumptionIds: string[];
  rawInput: string;
  parsedItems: MitigationParsedItem[];
  parseErrors: MitigationParseError[];
  baseRapLevel: RapLevel;
  baseRapSum: number;
  netRapLevel: RapLevel;
  netRapSum: number;
  affectedRiskIds: string[];
  highestRemainingRisk: RiskLevel | null;
  notes: string;
  netRiskRows: NetRiskRow[];
};

export type MitigationComputationResult = {
  rows: MitigationRow[];
  validationIssues: MitigationValidationResult[];
};

export type RiskTreatmentEntry = {
  riskId: string;
  decision?: string;
  rationale?: string;
};

export type TracingEntry = {
  riskId: string;
  confirmedItems?: string[];
};

export type UiFilters = {
  questionnaireSection: string | null;
  riskLevel: string | null;
  showOnlyIssues: boolean;
};

export type UiState = {
  advancedMode: boolean;
  activeRoute: string;
  sidebarCollapsed: boolean;
  filters: UiFilters;
};

export type AnalysisStoreState = {
  analysisMeta: AnalysisMeta;
  metadata: MetadataState;
  questionnaire: {
    byId: Record<string, QuestionnaireAnswer>;
  };
  mitigations: {
    byAttackStepId: Record<string, MitigationSelection>;
  };
  riskTreatment: {
    byRiskId: Record<string, RiskTreatmentEntry>;
  };
  tracing: {
    byRiskId: Record<string, TracingEntry>;
  };
  ui: UiState;
};

export type AnalysisSnapshot = AnalysisStoreState;
