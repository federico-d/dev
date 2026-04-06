import { selectDamageCategories, selectDamageScenarios } from '../../store/selectors';
import type { AnalysisStoreState } from '../../domain/types';

const baseState: AnalysisStoreState = {
  analysisMeta: {
    analysisId: 'a1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
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
    activeRoute: '/damage-scenarios',
    sidebarCollapsed: false,
    filters: { questionnaireSection: null, riskLevel: null, showOnlyIssues: false },
  },
};

describe('damage selectors', () => {
  it('selectDamageScenarios derives scenarios from questionnaire', () => {
    const state = {
      ...baseState,
      questionnaire: { byId: { QI2: { questionId: 'QI2', answer1: 'critical' } } },
    };
    const scenarios = selectDamageScenarios(state);
    expect(scenarios.length).toBe(1);
    expect(scenarios[0].damageLevel.label).toBe('Critical');
  });

  it('selectDamageCategories returns category maxima', () => {
    const state = {
      ...baseState,
      questionnaire: { byId: { QI2: { questionId: 'QI2', answer1: 'medium' }, QI4: { questionId: 'QI4', answer1: 'high' } } },
    };
    const categories = selectDamageCategories(state);
    expect(categories.C.label).toBe('High');
    expect(categories.F.label).toBe('High');
  });
});
