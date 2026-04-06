import { DamageLevelLabel, RapLevel, RiskLevelLabel } from '../enums';
import type {
  DamageLevel,
  EaseFactorName,
  EaseOption,
  RapThresholdDefinition,
  RiskMatrixCell,
} from '../types';

export const DAMAGE_LEVELS: DamageLevel[] = [
  { value: 1, label: DamageLevelLabel.Immaterial },
  { value: 2, label: DamageLevelLabel.Low },
  { value: 3, label: DamageLevelLabel.Medium },
  { value: 4, label: DamageLevelLabel.High },
  { value: 5, label: DamageLevelLabel.Critical },
];

export const RISK_LEVELS = [
  RiskLevelLabel.NoRisk,
  RiskLevelLabel.Low,
  RiskLevelLabel.Moderate,
  RiskLevelLabel.High,
  RiskLevelLabel.VeryHigh,
] as const;

export const RAP_THRESHOLDS: RapThresholdDefinition[] = [
  { min: 0, level: RapLevel.Basic, rank: 0 },
  { min: 10, level: RapLevel.EnhancedBasic, rank: 1 },
  { min: 14, level: RapLevel.Moderate, rank: 2 },
  { min: 20, level: RapLevel.High, rank: 3 },
  { min: 25, level: RapLevel.BeyondHigh, rank: 4 },
];

export const RAP_LEVELS: RapLevel[] = RAP_THRESHOLDS.map((threshold) => threshold.level);

const matrixRows: RiskLevelLabel[][] = [
  [RiskLevelLabel.Low, RiskLevelLabel.Moderate, RiskLevelLabel.High, RiskLevelLabel.VeryHigh, RiskLevelLabel.VeryHigh],
  [RiskLevelLabel.Low, RiskLevelLabel.Moderate, RiskLevelLabel.High, RiskLevelLabel.VeryHigh, RiskLevelLabel.VeryHigh],
  [RiskLevelLabel.Low, RiskLevelLabel.Moderate, RiskLevelLabel.High, RiskLevelLabel.High, RiskLevelLabel.VeryHigh],
  [RiskLevelLabel.Moderate, RiskLevelLabel.High, RiskLevelLabel.High, RiskLevelLabel.VeryHigh, RiskLevelLabel.VeryHigh],
  [RiskLevelLabel.Moderate, RiskLevelLabel.High, RiskLevelLabel.High, RiskLevelLabel.High, RiskLevelLabel.High],
];

const RISK_LEVEL_TO_VALUE: Record<RiskLevelLabel, 0 | 1 | 2 | 3 | 4> = {
  [RiskLevelLabel.NoRisk]: 0,
  [RiskLevelLabel.Low]: 1,
  [RiskLevelLabel.Moderate]: 2,
  [RiskLevelLabel.High]: 3,
  [RiskLevelLabel.VeryHigh]: 4,
};

export const RISK_MATRIX: RiskMatrixCell[] = RAP_LEVELS.flatMap((rap, rapIdx) =>
  DAMAGE_LEVELS.map((damage) => ({
    rap,
    rapLabel: rap,
    damageLevelValue: damage.value,
    riskLevel: matrixRows[rapIdx][damage.value - 1],
    riskLevelValue: RISK_LEVEL_TO_VALUE[matrixRows[rapIdx][damage.value - 1]],
  })),
);

export const EASE_DEFINITIONS: Record<EaseFactorName, EaseOption[]> = {
  elapsedTime: [
    { label: '<= 1 day', score: 0 },
    { label: '<= 1 week', score: 1 },
    { label: '<= 1 month', score: 4 },
    { label: '<= 6 months', score: 10 },
    { label: 'Years', score: 19 },
    { label: 'Decades', score: 25 },
  ],
  expertise: [
    { label: 'Layman', score: 0 },
    { label: 'Proficient', score: 3 },
    { label: 'Expert', score: 6 },
    { label: 'Multiple experts', score: 8 },
  ],
  knowledgeOfToe: [
    { label: 'Public', score: 0 },
    { label: 'Restricted', score: 3 },
    { label: 'Sensitive', score: 7 },
    { label: 'Critical', score: 11 },
  ],
  windowOfOpportunity: [
    { label: 'Unnecessary / unlimited', score: 0 },
    { label: 'Easy', score: 1 },
    { label: 'Moderate', score: 4 },
    { label: 'Difficult', score: 10 },
    { label: 'Not available / none', score: 25 },
  ],
  equipment: [
    { label: 'Standard', score: 0 },
    { label: 'Specialized', score: 4 },
    { label: 'Bespoke', score: 7 },
    { label: 'Multiple bespoke', score: 9 },
  ],
};

export const EASE_SCALES = {
  elapsedTime: EASE_DEFINITIONS.elapsedTime.map((item) => item.score),
  expertise: EASE_DEFINITIONS.expertise.map((item) => item.score),
  knowledgeOfToe: EASE_DEFINITIONS.knowledgeOfToe.map((item) => item.score),
  windowOfOpportunity: EASE_DEFINITIONS.windowOfOpportunity.map((item) => item.score),
  equipment: EASE_DEFINITIONS.equipment.map((item) => item.score),
};

export const QA18_SECURE_PRODUCTION_SCALE = [
  { value: 'none', label: 'No secure production controls' },
  { value: 'basic', label: 'Basic secure production controls' },
  { value: 'managed', label: 'Managed secure production controls' },
  { value: 'certified', label: 'Certified secure production controls' },
];

export const QA19_SUPPLY_CHAIN_TRUST_SCALE = [
  { value: 'unknown', label: 'Unknown supply chain trust' },
  { value: 'partial', label: 'Partially trusted supply chain' },
  { value: 'trusted', label: 'Trusted supply chain' },
  { value: 'highly-trusted', label: 'Highly trusted and audited supply chain' },
];
