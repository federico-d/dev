import { useMemo, useState } from 'react';
import { RiskSummaryCards } from '../../components/risks/RiskSummaryCards';
import { RiskTable } from '../../components/risks/RiskTable';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectRiskRows, selectRiskSummaryStats } from '../../store/selectors';

export function RisksPage() {
  const state = useAnalysisStore();
  const rows = selectRiskRows(state);
  const summary = selectRiskSummaryStats(state);

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'no-risk'>('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>('all');
  const [rapFilter, setRapFilter] = useState<string>('all');
  const [attackStepFilter, setAttackStepFilter] = useState<string>('all');
  const [damageCategoryFilter, setDamageCategoryFilter] = useState<string>('all');
  const [strategyFilter, setStrategyFilter] = useState<string>('all');

  const riskLevels = Array.from(new Set(rows.map((row) => row.riskLevel)));
  const rapLevels = Array.from(new Set(rows.map((row) => row.rapLevel)));
  const attackSteps = Array.from(new Set(rows.map((row) => row.attackStepId)));
  const categories = Array.from(new Set(rows.map((row) => row.damageCategory)));
  const strategies = Array.from(new Set(rows.map((row) => row.attackPathSourceStrategy)));

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (statusFilter === 'active' && !row.active) return false;
        if (statusFilter === 'no-risk' && row.riskLevel !== 'No Risk') return false;
        if (riskLevelFilter !== 'all' && row.riskLevel !== riskLevelFilter) return false;
        if (rapFilter !== 'all' && row.rapLevel !== rapFilter) return false;
        if (attackStepFilter !== 'all' && row.attackStepId !== attackStepFilter) return false;
        if (damageCategoryFilter !== 'all' && row.damageCategory !== damageCategoryFilter) return false;
        if (strategyFilter !== 'all' && row.attackPathSourceStrategy !== strategyFilter) return false;
        return true;
      }),
    [rows, statusFilter, riskLevelFilter, rapFilter, attackStepFilter, damageCategoryFilter, strategyFilter],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
        <strong>Sprint 3 status:</strong> risk rows are derived from applicable Attack Steps + applicable Damage Scenarios +
        preliminary Attack Paths. Mitigation, risk treatment and tracing are intentionally not applied in this sprint.
      </div>

      <RiskSummaryCards summary={summary} />

      <div className="flex flex-wrap gap-3 text-sm">
        <label>
          Status
          <select className="ml-2 rounded border border-slate-300 px-2 py-1" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | 'active' | 'no-risk')}>
            <option value="all">all</option>
            <option value="active">active only</option>
            <option value="no-risk">No Risk only</option>
          </select>
        </label>

        <label>
          Risk level
          <select className="ml-2 rounded border border-slate-300 px-2 py-1" value={riskLevelFilter} onChange={(event) => setRiskLevelFilter(event.target.value)}>
            <option value="all">all</option>
            {riskLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label>
          RAP level
          <select className="ml-2 rounded border border-slate-300 px-2 py-1" value={rapFilter} onChange={(event) => setRapFilter(event.target.value)}>
            <option value="all">all</option>
            {rapLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label>
          Attack step
          <select className="ml-2 rounded border border-slate-300 px-2 py-1" value={attackStepFilter} onChange={(event) => setAttackStepFilter(event.target.value)}>
            <option value="all">all</option>
            {attackSteps.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>

        <label>
          Damage category
          <select className="ml-2 rounded border border-slate-300 px-2 py-1" value={damageCategoryFilter} onChange={(event) => setDamageCategoryFilter(event.target.value)}>
            <option value="all">all</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Linking strategy
          <select className="ml-2 rounded border border-slate-300 px-2 py-1" value={strategyFilter} onChange={(event) => setStrategyFilter(event.target.value)}>
            <option value="all">all</option>
            {strategies.map((strategy) => (
              <option key={strategy} value={strategy}>
                {strategy}
              </option>
            ))}
          </select>
        </label>
      </div>

      <RiskTable rows={filteredRows} />
    </div>
  );
}
