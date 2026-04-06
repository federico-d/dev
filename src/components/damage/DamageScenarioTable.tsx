import type { DamageScenario } from '../../domain/types';

type Props = {
  scenarios: DamageScenario[];
};

export function DamageScenarioTable({ scenarios }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-900">Damage Scenarios</h3>
      {scenarios.length === 0 ? (
        <p className="text-sm text-slate-600">No damage scenarios derived from current questionnaire answers.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-3 py-2 text-left">Scenario ID</th>
                <th className="px-3 py-2 text-left">Source Question</th>
                <th className="px-3 py-2 text-left">Scenario</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Damage Level</th>
                <th className="px-3 py-2 text-left">Transformed</th>
                <th className="px-3 py-2 text-left">Excluded</th>
                <th className="px-3 py-2 text-left">Transformation reasons</th>
                <th className="px-3 py-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario) => (
                <tr className="border-t border-slate-200" key={scenario.id}>
                  <td className="px-3 py-2 font-medium">{scenario.id}</td>
                  <td className="px-3 py-2">{scenario.sourceQuestionId}</td>
                  <td className="px-3 py-2">{scenario.scenarioLabel}</td>
                  <td className="px-3 py-2">{scenario.category}</td>
                  <td className="px-3 py-2">{scenario.damageLevel.label}</td>
                  <td className="px-3 py-2">{scenario.transformed ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2">{scenario.excludedFromScope ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2">{scenario.transformationReasons.length ? scenario.transformationReasons.join('; ') : '-'}</td>
                  <td className="px-3 py-2">{scenario.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
