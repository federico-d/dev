import {
  selectMetadataCompleteness,
  selectQuestionnaireProgress,
  selectQualityIndicators,
  selectQuestionValidationMap,
} from '../../store/selectors';
import type { AnalysisStoreState } from '../../domain/types';

function makeState(overrides?: Partial<AnalysisStoreState>): AnalysisStoreState {
  return {
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
      activeRoute: '/questionnaire',
      sidebarCollapsed: false,
      filters: { questionnaireSection: null, riskLevel: null, showOnlyIssues: false },
    },
    ...overrides,
  };
}

describe('progress selectors', () => {
  it('computes metadata completeness', () => {
    const metadata = {
      toeName: 'Device',
      author: 'Alice',
      pmContact: 'pm@example.com',
      rdContact: '',
      css: 'CSS',
      csts: 'CSTS',
      version: '1.0.0',
      changeHistory: '',
    };

    const result = selectMetadataCompleteness(metadata);
    expect(result.missingRequiredFields).toEqual(['rdContact', 'changeHistory']);
    expect(result.completionPercent).toBe(75);
  });

  it('computes questionnaire progress by section', () => {
    const byId = {
      QI1: { questionId: 'QI1', answer1: 'low' },
      QA1: { questionId: 'QA1', answer1: 'yes' },
      QA21: { questionId: 'QA21', answer1: '5' },
    };

    const result = selectQuestionnaireProgress(byId);
    expect(result.totalCount).toBe(37);
    expect(result.answeredCount).toBe(3);
    expect(result.bySection['Impact / Confidentiality'].answered).toBe(1);
    expect(result.bySection['Architecture / Lifecycle'].answered).toBe(1);
  });

  it('returns quality indicators from state', () => {
    const state = makeState({ metadata: { toeName: 'X' } });
    const indicators = selectQualityIndicators(state);
    expect(indicators.find((item) => item.id === 'QI-META-MISSING')?.count).toBe(7);
  });

  it('returns question validation map', () => {
    const state = makeState({ questionnaire: { byId: { QI1: { questionId: 'QI1', answer1: '' } } } });
    const map = selectQuestionValidationMap(state);
    expect(map.QI1.messages.length).toBeGreaterThan(0);
  });
});
