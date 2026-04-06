import { describe, expect, it } from 'vitest';
import { ATTACK_STEPS_CATALOG } from '../../domain/catalogs/attack-steps';

describe('attack-steps catalog integrity', () => {
  it('has unique ids for AS1-AS41', () => {
    expect(ATTACK_STEPS_CATALOG).toHaveLength(41);
    const ids = ATTACK_STEPS_CATALOG.map((item) => item.id);
    expect(new Set(ids).size).toBe(41);
    expect(ids[0]).toBe('AS1');
    expect(ids[40]).toBe('AS41');
  });

  it('has valid reference shapes', () => {
    ATTACK_STEPS_CATALOG.forEach((item) => {
      item.proposedCountermeasureIds.forEach((id) => expect(id.trim().length).toBeGreaterThan(0));
      item.proposedAssumptionIds.forEach((id) => expect(id.trim().length).toBeGreaterThan(0));
      item.additionalAssumptionIds.forEach((id) => expect(id.trim().length).toBeGreaterThan(0));
    });
  });

  it('contains minimum required inactive rules', () => {
    const as9 = ATTACK_STEPS_CATALOG.find((item) => item.id === 'AS9');
    const as37 = ATTACK_STEPS_CATALOG.find((item) => item.id === 'AS37');
    const as38 = ATTACK_STEPS_CATALOG.find((item) => item.id === 'AS38');
    const as40 = ATTACK_STEPS_CATALOG.find((item) => item.id === 'AS40');

    expect(as9?.inactiveWhen.some((rule) => rule.id === 'as9-qa2-no')).toBe(true);
    expect(as37?.inactiveWhen.some((rule) => rule.id === 'as37-qa18-yes')).toBe(true);
    expect(as38?.inactiveWhen.some((rule) => rule.id === 'as38-qa19-trusted')).toBe(true);
    expect(as40?.inactiveWhen.some((rule) => rule.id === 'as40-qa11b-not-no')).toBe(true);
  });
});
