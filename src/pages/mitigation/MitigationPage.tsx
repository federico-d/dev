import { useMemo, useState } from 'react';
import { MitigationSummaryCards } from '../../components/mitigation/MitigationSummaryCards';
import { MitigationTable } from '../../components/mitigation/MitigationTable';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectMitigationRows, selectMitigationSummary } from '../../store/selectors';

export function MitigationPage() {
  const state = useAnalysisStore();
  const rows = selectMitigationRows(state);
  const summary = selectMitigationSummary(state);
  const setMitigationRawInput = useAnalysisStore((s) => s.setMitigationRawInput);

  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'parse-errors' | 'with-mitigation'>('all');

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (filter === 'active' && !row.active) return false;
      if (filter === 'inactive' && row.active) return false;
      if (filter === 'parse-errors' && row.parseErrors.length === 0) return false;
      if (filter === 'with-mitigation' && row.rawInput.trim().length === 0) return false;
      return true;
    });
  }, [rows, filter]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
        <strong>Planned mitigation mode:</strong> this sprint stores planned C/A IDs and computes Net RAP/Net Risk. Confirmation,
        risk treatment and tracing are out of scope for now.
      </div>

      <MitigationSummaryCards
        totalAttackSteps={summary.totalAttackSteps}
        mitigatedAttackSteps={summary.mitigatedAttackSteps}
        parseErrorCount={summary.parseErrorCount}
        highestRemainingRiskPresent={summary.highestRemainingRiskPresent}
      />

      <label className="text-sm text-slate-700">
        Filter
        <select
          className="ml-2 rounded border border-slate-300 px-2 py-1"
          value={filter}
          onChange={(event) => setFilter(event.target.value as typeof filter)}
        >
          <option value="all">all</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="parse-errors">parse errors</option>
          <option value="with-mitigation">with mitigation</option>
        </select>
      </label>

      <MitigationTable rows={filteredRows} onRawInputChange={setMitigationRawInput} />
    </div>
  );
}
