import { DamageCategorySummary } from '../../components/damage/DamageCategorySummary';
import { DamageScenarioTable } from '../../components/damage/DamageScenarioTable';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectDamageCategories, selectDamageScenarios } from '../../store/selectors';

export function DSOverviewPage() {
  const state = useAnalysisStore();
  const scenarios = selectDamageScenarios(state);
  const categories = selectDamageCategories(state);

  return (
    <div className="space-y-4">
      <DamageCategorySummary categoryResult={categories} totalScenarios={scenarios.length} />
      <DamageScenarioTable scenarios={scenarios} />
    </div>
  );
}
