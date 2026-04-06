import { useMemo, useState } from 'react';
import { DamageScenarioTable } from '../../components/damage/DamageScenarioTable';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectDamageScenarios } from '../../store/selectors';

export function DamageScenariosPage() {
  const state = useAnalysisStore();
  const scenarios = selectDamageScenarios(state);
  const [mode, setMode] = useState<'all' | 'transformed' | 'excluded'>('all');
  const [category, setCategory] = useState<'all' | 'C' | 'I' | 'A' | 'F'>('all');
  const [sourceQuestion, setSourceQuestion] = useState('all');

  const sourceOptions = useMemo(
    () => Array.from(new Set(scenarios.map((item) => item.sourceQuestionId))).sort(),
    [scenarios],
  );

  const filteredScenarios = scenarios.filter((scenario) => {
    if (mode === 'transformed' && !scenario.transformed) return false;
    if (mode === 'excluded' && !scenario.excludedFromScope) return false;
    if (category !== 'all' && scenario.category !== category) return false;
    if (sourceQuestion !== 'all' && scenario.sourceQuestionId !== sourceQuestion) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Damage Scenario Filters</h3>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="text-sm">Scope
            <select className="mt-1 w-full rounded border border-slate-300 p-2" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
              <option value="all">All</option>
              <option value="transformed">Transformed</option>
              <option value="excluded">Excluded</option>
            </select>
          </label>
          <label className="text-sm">Category
            <select className="mt-1 w-full rounded border border-slate-300 p-2" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
              <option value="all">All</option>
              <option value="C">Confidentiality</option>
              <option value="I">Integrity</option>
              <option value="A">Availability</option>
              <option value="F">Financial &amp; Legal</option>
            </select>
          </label>
          <label className="text-sm">Source question
            <select className="mt-1 w-full rounded border border-slate-300 p-2" value={sourceQuestion} onChange={(e) => setSourceQuestion(e.target.value)}>
              <option value="all">All</option>
              {sourceOptions.map((questionId) => (
                <option key={questionId} value={questionId}>{questionId}</option>
              ))}
            </select>
          </label>
          <div className="text-sm text-slate-600 md:pt-6">Showing {filteredScenarios.length} of {scenarios.length} scenarios.</div>
        </div>
      </section>

      <DamageScenarioTable scenarios={filteredScenarios} />
    </div>
  );
}
