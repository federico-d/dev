import { describe, expect, it } from 'vitest';
import type { AnalysisStoreState } from '../../domain/types';
import {
  selectMitigationRows,
  selectMitigationSummary,
  selectMitigationValidationIssues,
  selectNetRiskRows,
} from '../../store/selectors';

const state: AnalysisStoreState = {
  analysisMeta: { analysisId: '1', createdAt: '1', updatedAt: '1', templateVersion: 'v1', dirty: false },
  metadata: {},
  questionnaire: { byId: { QI2: { questionId: 'QI2', answer1: 'ruinous' } } },
  mitigations: { byAttackStepId: { AS1: { attackStepId: 'AS1', rawInput: '{CM1}' } } },
  riskTreatment: { byRiskId: {} },
  tracing: { byRiskId: {} },
  ui: { advancedMode: false, activeRoute: '/mitigation', sidebarCollapsed: false, filters: { questionnaireSection: null, riskLevel: null, showOnlyIssues: false } },
};

describe('mitigation selectors', () => {
  it('selectMitigationRows returns computed rows', () => {
    expect(selectMitigationRows(state).length).toBeGreaterThan(0);
  });

  it('selectMitigationSummary returns coherent summary', () => {
    const summary = selectMitigationSummary(state);
    expect(summary.totalAttackSteps).toBeGreaterThan(0);
    expect(summary.mitigatedAttackSteps).toBeGreaterThanOrEqual(1);
  });

  it('selectNetRiskRows returns flattened net rows', () => {
    expect(selectNetRiskRows(state).length).toBeGreaterThan(0);
  });

  it('selectMitigationValidationIssues returns issue list', () => {
    expect(Array.isArray(selectMitigationValidationIssues(state))).toBe(true);
  });
});
