import { describe, expect, it } from 'vitest';
import { ATTACK_STEPS_CATALOG } from '../../domain/catalogs/attack-steps';

describe('attack-steps catalog integrity', () => {
  it('contains AS1-AS41 and unique ids', () => {
    expect(ATTACK_STEPS_CATALOG).toHaveLength(41);
    const ids = ATTACK_STEPS_CATALOG.map((item) => item.id);
    expect(new Set(ids).size).toBe(41);
    expect(ids).toEqual(Array.from({ length: 41 }, (_, i) => `AS${i + 1}`));
  });

  it('does not contain placeholder titles/descriptions', () => {
    ATTACK_STEPS_CATALOG.forEach((item) => {
      expect(item.title).not.toMatch(/^Attack Step\s+\d+$/i);
      expect(item.description).not.toMatch(/^Catalog attack step/i);
    });
  });

  it('contains complete baseEase and linking metadata for all attack steps', () => {
    ATTACK_STEPS_CATALOG.forEach((item) => {
      expect(item.baseEase.elapsedTime).toBeTypeOf('number');
      expect(item.baseEase.expertise).toBeTypeOf('number');
      expect(item.baseEase.knowledgeOfToe).toBeTypeOf('number');
      expect(item.baseEase.windowOfOpportunity).toBeTypeOf('number');
      expect(item.baseEase.equipment).toBeTypeOf('number');
      expect(item.linkedDamageScenarioHints.sourceQuestionIds.length).toBeGreaterThan(0);
      expect(item.linkedDamageScenarioHints.categories.length).toBeGreaterThan(0);
    });
  });

  it('contains required sprint-specific activation constraints', () => {
    const as12 = ATTACK_STEPS_CATALOG.find((item) => item.id === 'AS12');
    const as33 = ATTACK_STEPS_CATALOG.find((item) => item.id === 'AS33');
    const as18 = ATTACK_STEPS_CATALOG.find((item) => item.id === 'AS18');
    const as40 = ATTACK_STEPS_CATALOG.find((item) => item.id === 'AS40');

    expect(as12?.inactiveWhen.some((rule) => rule.id.includes('qa10a'))).toBe(true);
    expect(as33?.inactiveWhen.some((rule) => rule.id.includes('qa10b'))).toBe(true);
    expect(as18?.inactiveWhen.some((rule) => rule.id.includes('qa11a'))).toBe(true);
    expect(as40?.inactiveWhen.some((rule) => rule.id.includes('qa11b'))).toBe(true);
  });
});
