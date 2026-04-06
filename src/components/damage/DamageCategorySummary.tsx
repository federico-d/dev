import type { DamageCategoryResult, DamageScenario } from '../../domain/types';

type Props = {
  categoryResult: DamageCategoryResult;
  scenarios: DamageScenario[];
};

export function DamageCategorySummary({ categoryResult, scenarios }: Props) {
  const transformedCount = scenarios.filter((item) => item.transformed).length;
  const excludedCount = scenarios.filter((item) => item.excludedFromScope).length;
  const highlighted = [...scenarios]
    .filter((item) => !item.excludedFromScope)
    .sort((a, b) => b.damageLevel.value - a.damageLevel.value)
    .slice(0, 5);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-base font-semibold text-slate-900">Damage Overview</h3>
      <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
        <p>Total scenarios: {scenarios.length}</p>
        <p>Transformed scenarios: {transformedCount}</p>
        <p>Excluded from scope: {excludedCount}</p>
        <p>Final included scenarios: {scenarios.length - excludedCount}</p>
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        <li>Confidentiality max: {categoryResult.C.label}</li>
        <li>Integrity max: {categoryResult.I.label}</li>
        <li>Availability max: {categoryResult.A.label}</li>
        <li>Financial &amp; Legal max: {categoryResult.F.label}</li>
      </ul>

      <div className="mt-3">
        <p className="text-sm font-medium text-slate-800">Top final scenarios</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {highlighted.length === 0 ? (
            <li>No final scenarios available.</li>
          ) : (
            highlighted.map((scenario) => (
              <li key={scenario.id}>
                {scenario.id} — {scenario.scenarioLabel} ({scenario.damageLevel.label})
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
