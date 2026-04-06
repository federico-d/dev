import { useMemo, useState } from 'react';
import { AttackStepSummaryCards } from '../../components/attack-steps/AttackStepSummaryCards';
import { AttackStepTable } from '../../components/attack-steps/AttackStepTable';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectAttackStepCounts, selectAttackStepInstances } from '../../store/selectors';

type AttackStepFilter = 'all' | 'active' | 'inactive';

export function AttackStepsPage() {
  const state = useAnalysisStore();
  const instances = selectAttackStepInstances(state);
  const counts = selectAttackStepCounts(state);
  const [filter, setFilter] = useState<AttackStepFilter>('all');

  const filteredItems = useMemo(() => {
    if (filter === 'active') {
      return instances.filter((item) => item.active);
    }
    if (filter === 'inactive') {
      return instances.filter((item) => !item.active);
    }
    return instances;
  }, [instances, filter]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Attack Steps</h2>

      <AttackStepSummaryCards total={counts.total} active={counts.active} inactive={counts.inactive} />

      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-700">Filter:</span>
        {(['all', 'active', 'inactive'] as AttackStepFilter[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded border px-3 py-1 text-sm ${
              filter === value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <AttackStepTable items={filteredItems} />
    </div>
  );
}
