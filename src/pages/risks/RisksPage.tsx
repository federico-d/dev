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

  const riskLevels = Array.from(new Set(rows.map((row) => row.riskLevel)));
  const rapLevels = Array.from(new Set(rows.map((row) => row.rapLevel)));

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (statusFilter === 'active' && !row.active) {
          return false;
        }
        if (statusFilter === 'no-risk' && row.riskLevel !== 'No Risk') {
          return false;
        }
        if (riskLevelFilter !== 'all' && row.riskLevel !== riskLevelFilter) {
          return false;
        }
        if (rapFilter !== 'all' && row.rapLevel !== rapFilter) {
          return false;
        }
        return true;
      }),
    [rows, statusFilter, riskLevelFilter, rapFilter],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
        <strong>Initial risk rows available:</strong> Risk Levels are now computed via RAP x Damage matrix. Mitigation and treatment
        are not yet applied in Sprint 3A.
      </div>

      <RiskSummaryCards summary={summary} />

      <div className="flex flex-wrap gap-3">
        <label className="text-sm text-slate-700">
          Status
          <select
            className="ml-2 rounded border border-slate-300 px-2 py-1"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | 'active' | 'no-risk')}
          >
            <option value="all">all</option>
            <option value="active">active only</option>
            <option value="no-risk">No Risk only</option>
          </select>
        </label>

        <label className="text-sm text-slate-700">
          Risk level
          <select
            className="ml-2 rounded border border-slate-300 px-2 py-1"
            value={riskLevelFilter}
            onChange={(event) => setRiskLevelFilter(event.target.value)}
          >
            <option value="all">all</option>
            {riskLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-700">
          RAP level
          <select
            className="ml-2 rounded border border-slate-300 px-2 py-1"
            value={rapFilter}
            onChange={(event) => setRapFilter(event.target.value)}
          >
            <option value="all">all</option>
            {rapLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
      </div>

      <RiskTable rows={filteredRows} />
    </div>
  );
}
