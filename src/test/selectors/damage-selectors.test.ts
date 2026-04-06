import {
  selectBaseDamageScenarios,
  selectDamageCategories,
  selectDamageScenarios,
  selectDamageTransformationSummary,
} from '../../store/selectors';
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
  it('selectBaseDamageScenarios derives scenarios before transformations', () => {
    const state = {
      ...baseState,
      questionnaire: { byId: { QI2: { questionId: 'QI2', answer1: 'ruinous' } } },
    };
    const scenarios = selectBaseDamageScenarios(state);
    expect(scenarios.length).toBe(1);
    expect(scenarios[0].damageLevel.label).toBe('Critical');
    expect(scenarios[0].transformed).toBe(false);
  });

  it('selectDamageScenarios applies default template transformations', () => {
    const state = {
      ...baseState,
      questionnaire: { byId: { QI6: { questionId: 'QI6', answer1: 'life-threatening-injury' } } },
    };
    const scenarios = selectDamageScenarios(state);
    expect(scenarios[0].transformed).toBe(true);
  });

  it('selectDamageCategories returns category maxima from final scenarios', () => {
    const state = {
      ...baseState,
      questionnaire: { byId: { QI2: { questionId: 'QI2', answer1: 'significant' }, QI4: { questionId: 'QI4', answer1: 'high' } } },
    };
    const categories = selectDamageCategories(state);
    expect(categories.C.label).toBe('Medium');
    expect(categories.F.label).toBe('High');
  });

  it('selectDamageTransformationSummary exposes transformed/excluded counts', () => {
    const state = {
      ...baseState,
      questionnaire: { byId: { QI15: { questionId: 'QI15', answer1: 'major-disturbance' } } },
    };
    const summary = selectDamageTransformationSummary(state);
    expect(summary.total).toBeGreaterThan(0);
    expect(summary.transformed).toBeGreaterThan(0);
  });
});
