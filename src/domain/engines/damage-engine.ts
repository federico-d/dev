import { DamageLevelLabel } from '../enums';
import type { DamageCategoryResult, DamageLevel, DamageRule, DamageScenario, QuestionnaireAnswer } from '../types';

const IMMATERIAL: DamageLevel = { label: DamageLevelLabel.Immaterial, value: 1 };

export function getMaxDamageLevel(levels: DamageLevel[]): DamageLevel {
  if (levels.length === 0) {
    return IMMATERIAL;
  }

  return levels.reduce((max, level) => (level.value > max.value ? level : max), levels[0]);
}

export function computeDamageScenarios(
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
  damageRules: DamageRule[],
): DamageScenario[] {
  return damageRules
    .filter((rule) => questionnaireAnswers[rule.questionId]?.answer1?.trim() === rule.answerValue)
    .map((rule, index) => ({
      id: `DS-${index + 1}`,
      sourceQuestionId: rule.questionId,
      category: rule.category,
      damageLevel: {
        label: rule.damageLevelLabel,
        value: rule.damageLevelValue,
      },
      note: rule.note,
    }));
}

export function computeDamageCategories(
  questionnaireAnswers: Record<string, QuestionnaireAnswer>,
  damageRules: DamageRule[],
): DamageCategoryResult {
  const scenarios = computeDamageScenarios(questionnaireAnswers, damageRules);

  return {
    C: getMaxDamageLevel(scenarios.filter((scenario) => scenario.category === 'C').map((scenario) => scenario.damageLevel)),
    I: getMaxDamageLevel(scenarios.filter((scenario) => scenario.category === 'I').map((scenario) => scenario.damageLevel)),
    A: getMaxDamageLevel(scenarios.filter((scenario) => scenario.category === 'A').map((scenario) => scenario.damageLevel)),
    F: getMaxDamageLevel(scenarios.filter((scenario) => scenario.category === 'F').map((scenario) => scenario.damageLevel)),
  };
}
