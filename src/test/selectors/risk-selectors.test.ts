import { describe, expect, it } from 'vitest';
import type { AnalysisStoreState } from '../../domain/types';
import {
  selectApplicableDamageScenariosByAttackStep,
  selectAttackPaths,
  selectActiveRiskRows,
  selectHighestRiskRows,
  selectNoRiskRows,
  selectRiskRows,
  selectRiskSummaryStats,
} from '../../store/selectors';

const baseState: AnalysisStoreState = {
  analysisMeta: {
    analysisId: 'x',
    createdAt: 'x',
    updatedAt: 'x',
    templateVersion: 'v1',
    dirty: false,
  },
  metadata: {},
  questionnaire: { byId: { QI2: { questionId: 'QI2', answer1: 'ruinous' } } },
  mitigations: { byAttackStepId: {} },
  riskTreatment: { byRiskId: {} },
  tracing: { byRiskId: {} },
  ui: {
    advancedMode: false,
    activeRoute: '/risks',
    sidebarCollapsed: false,
    filters: { questionnaireSection: null, riskLevel: null, showOnlyIssues: false },
  },
};

describe('risk selectors', () => {
  it('selectRiskRows returns computed risk rows', () => {
    expect(selectRiskRows(baseState).length).toBeGreaterThan(0);
  });

  it('selectApplicableDamageScenariosByAttackStep returns typed link map', () => {
    const links = selectApplicableDamageScenariosByAttackStep(baseState);
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveProperty('strategy');
  });

  it('selectAttackPaths returns preliminary typed paths', () => {
    const paths = selectAttackPaths(baseState);
    expect(paths.length).toBeGreaterThan(0);
    expect(paths[0]).toHaveProperty('sourceStrategy');
  });

  it('selectActiveRiskRows returns active rows only', () => {
    expect(selectActiveRiskRows(baseState).every((row) => row.active)).toBe(true);
  });

  it('selectNoRiskRows returns no-risk rows when attack steps inactive', () => {
    const state = {
      ...baseState,
      questionnaire: { byId: { ...baseState.questionnaire.byId, QA1: { questionId: 'QA1', answer1: 'no' } } },
    };
    expect(selectNoRiskRows(state).length).toBeGreaterThan(0);
  });

  it('selectHighestRiskRows returns highest-value rows', () => {
    const rows = selectHighestRiskRows(baseState);
    expect(rows.length).toBeGreaterThan(0);
    const max = Math.max(...rows.map((row) => row.riskLevelValue));
    expect(rows.every((row) => row.riskLevelValue === max)).toBe(true);
  });

  it('selectRiskSummaryStats returns coherent counts', () => {
    const summary = selectRiskSummaryStats(baseState);
    expect(summary.total).toBeGreaterThan(0);
    expect(summary.noRisk + summary.low + summary.moderate + summary.high + summary.veryHigh).toBe(summary.total);
    expect(summary.linkingCoverage).toBeGreaterThanOrEqual(0);
  });
});
