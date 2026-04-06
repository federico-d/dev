import { describe, expect, it } from 'vitest';
import type { AnalysisStoreState } from '../../domain/types';
import {
  selectActiveAttackSteps,
  selectAttackStepRapResults,
  selectAttackStepCounts,
  selectAttackStepInstances,
  selectInactiveAttackSteps,
  selectPreliminaryRiskRows,
  selectRisksPreviewSummary,
} from '../../store/selectors';

const baseState: AnalysisStoreState = {
  analysisMeta: {
    analysisId: 't',
    createdAt: 't',
    updatedAt: 't',
    templateVersion: 'v1',
    dirty: false,
  },
  metadata: {},
  questionnaire: { byId: {} },
  mitigations: { byAttackStepId: {} },
  riskTreatment: { byRiskId: {} },
  tracing: { byRiskId: {} },
  ui: {
    advancedMode: false,
    activeRoute: '/attack-steps',
    sidebarCollapsed: false,
    filters: { questionnaireSection: null, riskLevel: null, showOnlyIssues: false },
  },
};

describe('attack-step selectors', () => {
  it('selectAttackStepInstances returns computed instances', () => {
    const state: AnalysisStoreState = {
      ...baseState,
      questionnaire: { byId: { QA1: { questionId: 'QA1', answer1: 'no' } } },
    };
    expect(selectAttackStepInstances(state).length).toBe(41);
  });

  it('selectActiveAttackSteps returns only active items', () => {
    const state: AnalysisStoreState = {
      ...baseState,
      questionnaire: { byId: { QA1: { questionId: 'QA1', answer1: 'no' } } },
    };
    expect(selectActiveAttackSteps(state).every((item) => item.active)).toBe(true);
  });

  it('selectInactiveAttackSteps returns only inactive items', () => {
    const state: AnalysisStoreState = {
      ...baseState,
      questionnaire: { byId: { QA1: { questionId: 'QA1', answer1: 'no' } } },
    };
    expect(selectInactiveAttackSteps(state).every((item) => !item.active)).toBe(true);
  });

  it('selectAttackStepCounts returns total/active/inactive/byGroup', () => {
    const state: AnalysisStoreState = {
      ...baseState,
      questionnaire: { byId: { QA1: { questionId: 'QA1', answer1: 'no' } } },
    };
    const counts = selectAttackStepCounts(state);
    expect(counts.total).toBe(41);
    expect(counts.active + counts.inactive).toBe(41);
    expect(Object.keys(counts.byGroup).length).toBeGreaterThan(0);
  });

  it('selectAttackStepRapResults exposes rap and factor explanation', () => {
    const state: AnalysisStoreState = {
      ...baseState,
      questionnaire: { byId: {} },
    };
    const results = selectAttackStepRapResults(state);
    expect(results[0].rap.sum).toBeGreaterThanOrEqual(0);
    expect(results[0].factorExplanation).toHaveLength(5);
  });

  it('selectPreliminaryRiskRows returns rows with rap and linkage placeholders', () => {
    const state: AnalysisStoreState = {
      ...baseState,
      questionnaire: { byId: {} },
    };
    const rows = selectPreliminaryRiskRows(state);
    expect(rows[0].rapLevel).toBeDefined();
    expect(Array.isArray(rows[0].linkedDamageScenarioIds)).toBe(true);
  });

  it('selectRisksPreviewSummary returns coherent aggregate', () => {
    const state: AnalysisStoreState = {
      ...baseState,
      questionnaire: { byId: { QA1: { questionId: 'QA1', answer1: 'no' } } },
    };
    const summary = selectRisksPreviewSummary(state);
    expect(summary.totalAttackSteps).toBe(41);
    expect(summary.activeAttackSteps + summary.inactiveAttackSteps).toBe(41);
    expect(summary.highestRapLevelPresent).toBeTruthy();
  });
});
