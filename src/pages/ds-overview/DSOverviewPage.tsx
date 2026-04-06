import { DamageCategorySummary } from '../../components/damage/DamageCategorySummary';
import { DamageScenarioTable } from '../../components/damage/DamageScenarioTable';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectDamageCategories, selectDamageScenarios, selectDamageTransformationSummary } from '../../store/selectors';

export function DSOverviewPage() {
  const state = useAnalysisStore();
  const scenarios = selectDamageScenarios(state);
  const categories = selectDamageCategories(state);
  const transformationSummary = selectDamageTransformationSummary(state);

  return (
    <div className="space-y-4">
      <DamageCategorySummary categoryResult={categories} scenarios={scenarios} />
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-700">
        <h3 className="mb-2 text-base font-semibold text-slate-900">Transformation Summary</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <p>Total scenarios: {transformationSummary.total}</p>
          <p>Transformed: {transformationSummary.transformed}</p>
          <p>Excluded from scope: {transformationSummary.excluded}</p>
          <p>Included in final categories: {transformationSummary.included}</p>
        </div>
      </section>
      <DamageScenarioTable scenarios={scenarios} />
    </div>
  );
}
