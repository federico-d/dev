import { describe, expect, it } from 'vitest';
import { ATTACK_STEPS_CATALOG } from '../../domain/catalogs/attack-steps';
import { computeAttackStepInstances } from '../../domain/engines/activation-engine';
import type { QuestionnaireAnswer } from '../../domain/types';

function instancesFor(answers: Record<string, QuestionnaireAnswer>) {
  return computeAttackStepInstances(answers, ATTACK_STEPS_CATALOG);
}

function inactiveIds(answers: Record<string, QuestionnaireAnswer>) {
  return instancesFor(answers)
    .filter((step) => !step.active)
    .map((step) => step.id);
}

describe('activation-engine', () => {
  it('QA10a and QA10b are handled independently', () => {
    expect(inactiveIds({ QA10a: { questionId: 'QA10a', answer1: 'no' } })).toContain('AS12');
    expect(inactiveIds({ QA10a: { questionId: 'QA10a', answer1: 'no' } })).not.toContain('AS33');

    expect(inactiveIds({ QA10b: { questionId: 'QA10b', answer1: 'no' } })).toContain('AS33');
    expect(inactiveIds({ QA10b: { questionId: 'QA10b', answer1: 'no' } })).not.toContain('AS12');
  });

  it('QA11a and QA11b are handled independently with AS40 special case', () => {
    const qa11a = inactiveIds({ QA11a: { questionId: 'QA11a', answer1: 'no' } });
    expect(qa11a).toEqual(expect.arrayContaining(['AS18', 'AS19', 'AS20']));

    const as40yes = instancesFor({ QA11b: { questionId: 'QA11b', answer1: 'yes' } }).find((step) => step.id === 'AS40');
    const as40no = instancesFor({ QA11b: { questionId: 'QA11b', answer1: 'no' } }).find((step) => step.id === 'AS40');
    expect(as40yes?.active).toBe(false);
    expect(as40no?.active).toBe(true);
  });

  it('QA18 secure production and QA19 supply chain trust disable AS37 and AS38', () => {
    expect(inactiveIds({ QA18: { questionId: 'QA18', answer1: 'certified-production' } })).toContain('AS37');
    expect(inactiveIds({ QA19: { questionId: 'QA19', answer1: 'trusted-with-updates' } })).toContain('AS38');
  });

  it('collects inactive reasons and activation metadata', () => {
    const as2 = instancesFor({
      QA1: { questionId: 'QA1', answer1: 'no' },
      QA5: { questionId: 'QA5', answer1: 'no' },
    }).find((step) => step.id === 'AS2');

    expect(as2?.active).toBe(false);
    expect(as2?.inactiveReasons.length).toBeGreaterThan(0);

    const as37 = instancesFor({ QA18: { questionId: 'QA18', answer1: 'no-protection' } }).find((step) => step.id === 'AS37');
    expect(as37?.activationAdjustments?.some((x) => x.questionId === 'QA18')).toBe(true);
  });

  it('legacy QA10/QA11 aliases do not influence split questions', () => {
    const ids = inactiveIds({
      QA10: { questionId: 'QA10', answer1: 'no' },
      QA11: { questionId: 'QA11', answer1: 'no' },
    } as Record<string, QuestionnaireAnswer>);

    expect(ids).not.toContain('AS12');
    expect(ids).not.toContain('AS18');
    expect(ids).not.toContain('AS33');
  });
});
