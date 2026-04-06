import { EASE_DEFINITIONS, RAP_THRESHOLDS } from '../catalogs/definitions';
import { RapLevel } from '../enums';
import type {
  EaseFactorName,
  EaseFactorSet,
  FactorExplanationEntry,
  RapComputation,
  RapThresholdDefinition,
} from '../types';

const FACTOR_ORDER: EaseFactorName[] = [
  'elapsedTime',
  'expertise',
  'knowledgeOfToe',
  'windowOfOpportunity',
  'equipment',
];

const RAP_RANK: Record<RapLevel, number> = {
  [RapLevel.Basic]: 0,
  [RapLevel.EnhancedBasic]: 1,
  [RapLevel.Moderate]: 2,
  [RapLevel.High]: 3,
  [RapLevel.BeyondHigh]: 4,
};

export function sumEaseFactors(baseEase: EaseFactorSet): number {
  return FACTOR_ORDER.reduce((sum, factorName) => sum + baseEase[factorName], 0);
}

export function classifyRap(sum: number, rapThresholds: RapThresholdDefinition[]): RapLevel {
  const sorted = [...rapThresholds].sort((a, b) => a.min - b.min);
  let level = sorted[0].level;
  sorted.forEach((threshold) => {
    if (sum >= threshold.min) {
      level = threshold.level;
    }
  });
  return level;
}

export function compareRapLevels(a: RapLevel, b: RapLevel): number {
  return RAP_RANK[a] - RAP_RANK[b];
}

export function buildFactorExplanation(
  baseEase: EaseFactorSet,
  easeDefinitions: Record<EaseFactorName, { label: string; score: number }[]>,
): FactorExplanationEntry[] {
  return FACTOR_ORDER.map((factor) => {
    const score = baseEase[factor];
    const matched = easeDefinitions[factor].find((option) => option.score === score);
    return {
      factor,
      score,
      label: matched?.label ?? `Score ${score}`,
    };
  });
}

export function computeRap(
  baseEase: EaseFactorSet,
  definitions: {
    rapThresholds: RapThresholdDefinition[];
    easeDefinitions: Record<EaseFactorName, { label: string; score: number }[]>;
  } = { rapThresholds: RAP_THRESHOLDS, easeDefinitions: EASE_DEFINITIONS },
): RapComputation {
  const sum = sumEaseFactors(baseEase);
  const rapLevel = classifyRap(sum, definitions.rapThresholds);

  return {
    sum,
    rapLevel,
    rapNumericRank: RAP_RANK[rapLevel],
    factors: baseEase,
  };
}
