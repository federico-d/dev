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
  it('QA1 = No disables connectivity dependent attack steps', () => {
    const ids = inactiveIds({ QA1: { questionId: 'QA1', answer1: 'no' } });
    ['AS2', 'AS5', 'AS6', 'AS7', 'AS9', 'AS10', 'AS11', 'AS12', 'AS13', 'AS14', 'AS15', 'AS16', 'AS17', 'AS31', 'AS34', 'AS35', 'AS36'].forEach(
      (id) => expect(ids).toContain(id),
    );
  });

  it('QA2 = No disables AS9 and AS31', () => {
    const ids = inactiveIds({ QA2: { questionId: 'QA2', answer1: 'no' } });
    expect(ids).toEqual(expect.arrayContaining(['AS9', 'AS31']));
  });

  it('QA5 = No disables AS2 and AS8', () => {
    const ids = inactiveIds({ QA5: { questionId: 'QA5', answer1: 'no' } });
    expect(ids).toEqual(expect.arrayContaining(['AS2', 'AS8']));
  });

  it('QA6 = No disables AS15', () => {
    const ids = inactiveIds({ QA6: { questionId: 'QA6', answer1: 'no' } });
    expect(ids).toContain('AS15');
  });

  it('QA9 = No disables AS29', () => {
    const ids = inactiveIds({ QA9: { questionId: 'QA9', answer1: 'no' } });
    expect(ids).toContain('AS29');
  });

  it('QA10b = No disables AS33-AS36', () => {
    const ids = inactiveIds({ QA10b: { questionId: 'QA10b', answer1: 'no' } });
    expect(ids).toEqual(expect.arrayContaining(['AS33', 'AS34', 'AS35', 'AS36']));
  });

  it('QA10a = No disables AS12', () => {
    const ids = inactiveIds({ QA10a: { questionId: 'QA10a', answer1: 'no' } });
    expect(ids).toContain('AS12');
  });

  it('QA11a = No disables AS18-AS20', () => {
    const ids = inactiveIds({ QA11a: { questionId: 'QA11a', answer1: 'no' } });
    expect(ids).toEqual(expect.arrayContaining(['AS18', 'AS19', 'AS20']));
  });

  it('QA11b = No explicitly activates AS40 relevance', () => {
    const as40 = instancesFor({ QA11b: { questionId: 'QA11b', answer1: 'no' } }).find((step) => step.id === 'AS40');
    expect(as40?.active).toBe(true);
    expect(as40?.inactiveReasons).toHaveLength(0);
  });

  it('QA11b missing or yes keeps AS40 inactive', () => {
    const as40NoAnswer = instancesFor({}).find((step) => step.id === 'AS40');
    const as40Yes = instancesFor({ QA11b: { questionId: 'QA11b', answer1: 'yes' } }).find((step) => step.id === 'AS40');
    expect(as40NoAnswer?.active).toBe(false);
    expect(as40Yes?.active).toBe(false);
  });

  it('QA14 = No disables AS21, AS22, AS23, AS27', () => {
    const ids = inactiveIds({ QA14: { questionId: 'QA14', answer1: 'no' } });
    expect(ids).toEqual(expect.arrayContaining(['AS21', 'AS22', 'AS23', 'AS27']));
  });

  it('QA17 = No disables AS25 and AS26', () => {
    const ids = inactiveIds({ QA17: { questionId: 'QA17', answer1: 'no' } });
    expect(ids).toEqual(expect.arrayContaining(['AS25', 'AS26']));
  });

  it('QA12 = No disables AS13', () => {
    const ids = inactiveIds({ QA12: { questionId: 'QA12', answer1: 'no' } });
    expect(ids).toContain('AS13');
  });

  it('QA13 = No disables AS2 and AS8', () => {
    const ids = inactiveIds({ QA13: { questionId: 'QA13', answer1: 'no' } });
    expect(ids).toEqual(expect.arrayContaining(['AS2', 'AS8']));
  });

  it('QA16 = No disables AS27', () => {
    const ids = inactiveIds({ QA16: { questionId: 'QA16', answer1: 'no' } });
    expect(ids).toContain('AS27');
  });

  it('QA18 = Yes disables AS37', () => {
    const ids = inactiveIds({ QA18: { questionId: 'QA18', answer1: 'yes' } });
    expect(ids).toContain('AS37');
  });

  it('QA19 trusted disables AS38', () => {
    const ids = inactiveIds({ QA19: { questionId: 'QA19', answer1: 'trusted' } });
    expect(ids).toContain('AS38');
  });

  it('if any inactive rule matches, step becomes inactive and reasons are populated', () => {
    const as2 = instancesFor({
      QA1: { questionId: 'QA1', answer1: 'no' },
      QA5: { questionId: 'QA5', answer1: 'no' },
    }).find((step) => step.id === 'AS2');

    expect(as2?.active).toBe(false);
    expect(as2?.inactiveReasons.length).toBeGreaterThan(0);
    expect(as2?.inactiveReasons[0].message).toContain('QA1');
  });
});
