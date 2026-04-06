import { describe, expect, it } from 'vitest';
import { EASE_DEFINITIONS, RAP_THRESHOLDS } from '../../domain/catalogs/definitions';
import { RapLevel } from '../../domain/enums';
import {
  buildFactorExplanation,
  classifyRap,
  compareRapLevels,
  computeRap,
  sumEaseFactors,
} from '../../domain/engines/rap-engine';

describe('rap-engine', () => {
  it('contains complete EASE scales and RAP thresholds', () => {
    expect(EASE_DEFINITIONS.elapsedTime.map((o) => o.score)).toEqual([0, 1, 4, 10, 19, 25]);
    expect(EASE_DEFINITIONS.windowOfOpportunity.map((o) => o.score)).toEqual([0, 1, 4, 10, 25]);
    expect(RAP_THRESHOLDS.map((o) => o.min)).toEqual([0, 10, 14, 20, 25]);
  });

  it('sumEaseFactors sums all factors', () => {
    expect(
      sumEaseFactors({ elapsedTime: 1, expertise: 3, knowledgeOfToe: 7, windowOfOpportunity: 4, equipment: 4 }),
    ).toBe(19);
  });

  it('classifyRap maps threshold boundaries', () => {
    expect(classifyRap(0, RAP_THRESHOLDS)).toBe(RapLevel.Basic);
    expect(classifyRap(9, RAP_THRESHOLDS)).toBe(RapLevel.Basic);
    expect(classifyRap(10, RAP_THRESHOLDS)).toBe(RapLevel.EnhancedBasic);
    expect(classifyRap(14, RAP_THRESHOLDS)).toBe(RapLevel.Moderate);
    expect(classifyRap(20, RAP_THRESHOLDS)).toBe(RapLevel.High);
    expect(classifyRap(25, RAP_THRESHOLDS)).toBe(RapLevel.BeyondHigh);
  });

  it('compareRapLevels orders levels correctly', () => {
    expect(compareRapLevels(RapLevel.Basic, RapLevel.High)).toBeLessThan(0);
    expect(compareRapLevels(RapLevel.BeyondHigh, RapLevel.Moderate)).toBeGreaterThan(0);
    expect(compareRapLevels(RapLevel.EnhancedBasic, RapLevel.EnhancedBasic)).toBe(0);
  });

  it('computeRap returns sum level and rank', () => {
    const result = computeRap(
      { elapsedTime: 4, expertise: 3, knowledgeOfToe: 3, windowOfOpportunity: 1, equipment: 4 },
      { rapThresholds: RAP_THRESHOLDS, easeDefinitions: EASE_DEFINITIONS },
    );
    expect(result.sum).toBe(15);
    expect(result.rapLevel).toBe(RapLevel.Moderate);
    expect(result.rapNumericRank).toBe(2);
  });

  it('buildFactorExplanation includes all five factors', () => {
    const explanation = buildFactorExplanation(
      { elapsedTime: 4, expertise: 3, knowledgeOfToe: 3, windowOfOpportunity: 1, equipment: 4 },
      EASE_DEFINITIONS,
    );

    expect(explanation).toHaveLength(5);
    expect(explanation.map((entry) => entry.factor)).toEqual([
      'elapsedTime',
      'expertise',
      'knowledgeOfToe',
      'windowOfOpportunity',
      'equipment',
    ]);
  });
});
