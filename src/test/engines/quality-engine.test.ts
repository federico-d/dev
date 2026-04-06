import { DOCUMENTATION_FIELDS } from '../../domain/catalogs/documentation-fields';
import { QUESTIONS_CATALOG } from '../../domain/catalogs/questions';
import { computeQualityIndicators } from '../../domain/engines/quality-engine';
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

describe('quality-engine rules', () => {
  const catalogs = { documentationFields: DOCUMENTATION_FIELDS, questions: QUESTIONS_CATALOG };

  it('computes missing metadata', () => {
    const state = makeState({ metadata: { toeName: 'X' } });
    const indicator = computeQualityIndicators(state, catalogs).find((item) => item.id === 'QI-META-MISSING');
    expect(indicator?.count).toBe(7);
  });

  it('computes unanswered questions', () => {
    const state = makeState({ questionnaire: { byId: { QI1: { questionId: 'QI1', answer1: 'low' } } } });
    const indicator = computeQualityIndicators(state, catalogs).find((item) => item.id === 'QI-ANSWERS-MISSING');
    expect(indicator?.count).toBe(36);
  });

  it('computes missing details', () => {
    const state = makeState({ questionnaire: { byId: { QI1: { questionId: 'QI1', answer1: 'high' } } } });
    const indicator = computeQualityIndicators(state, catalogs).find((item) => item.id === 'QI-DETAILS-MISSING');
    expect(indicator?.affectedQuestionIds).toContain('QI1');
  });

  it('computes missing rationale', () => {
    const state = makeState({ questionnaire: { byId: { QA1: { questionId: 'QA1', answer1: 'yes' } } } });
    const indicator = computeQualityIndicators(state, catalogs).find((item) => item.id === 'QI-RATIONALE-MISSING');
    expect(indicator?.affectedQuestionIds).toContain('QA1');
  });

  it('computes QA2/QA6 inconsistency', () => {
    const state = makeState({
      questionnaire: {
        byId: {
          QA2: { questionId: 'QA2', answer1: 'internet-facing-gateway' },
          QA6: { questionId: 'QA6', answer1: 'no' },
        },
      },
    });
    const indicator = computeQualityIndicators(state, catalogs).find((item) => item.id === 'QI-QA2-QA6-INCONSISTENT');
    expect(indicator?.count).toBe(1);
  });

  it('computes lifetime > support duration when comparable', () => {
    const state = makeState({
      questionnaire: {
        byId: {
          QA20: { questionId: 'QA20', answer1: '8' },
          QA21: { questionId: 'QA21', answer1: '3' },
        },
      },
    });
    const indicator = computeQualityIndicators(state, catalogs).find((item) => item.id === 'QI-LIFETIME-SUPPORT');
    expect(indicator?.count).toBe(1);
  });

  it('does not flag lifetime rule when values are not comparable', () => {
    const state = makeState({
      questionnaire: {
        byId: {
          QA20: { questionId: 'QA20', answer1: 'unknown' },
          QA21: { questionId: 'QA21', answer1: '' },
        },
      },
    });
    const indicator = computeQualityIndicators(state, catalogs).find((item) => item.id === 'QI-LIFETIME-SUPPORT');
    expect(indicator?.count).toBe(0);
  });
});
