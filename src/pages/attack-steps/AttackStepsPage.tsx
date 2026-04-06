import { useMemo, useState } from 'react';
import { AttackStepSummaryCards } from '../../components/attack-steps/AttackStepSummaryCards';
import { AttackStepTable } from '../../components/attack-steps/AttackStepTable';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectApplicableDamageScenariosByAttackStep, selectAttackStepCounts, selectAttackStepInstances } from '../../store/selectors';

type AttackStepFilter = 'all' | 'active' | 'inactive';

export function AttackStepsPage() {
  const state = useAnalysisStore();
  const instances = selectAttackStepInstances(state);
  const counts = selectAttackStepCounts(state);
  const links = selectApplicableDamageScenariosByAttackStep(state);

  const [filter, setFilter] = useState<AttackStepFilter>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [linkFilter, setLinkFilter] = useState<'all' | 'fallback' | 'explicit'>('all');

  const groups = Array.from(new Set(instances.map((item) => item.group)));

  const filteredItems = useMemo(() => {
    return instances.filter((item) => {
      if (filter === 'active' && !item.active) return false;
      if (filter === 'inactive' && item.active) return false;
      if (groupFilter !== 'all' && item.group !== groupFilter) return false;

      if (linkFilter !== 'all') {
        const strategy = links.find((entry) => entry.attackStepId === item.id)?.strategy;
        if (linkFilter === 'fallback' && strategy !== 'categoryFallback' && strategy !== 'noMatchFallback') return false;
        if (linkFilter === 'explicit' && strategy !== 'explicitHints' && strategy !== 'questionSource') return false;
      }

      return true;
    });
  }, [instances, filter, groupFilter, linkFilter, links]);

  const explicitLinking = links.filter((item) => item.strategy === 'explicitHints' || item.strategy === 'questionSource').length;
  const fallbackLinking = links.filter((item) => item.strategy === 'categoryFallback' || item.strategy === 'noMatchFallback').length;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Attack Steps</h2>

      <AttackStepSummaryCards
        total={counts.total}
        active={counts.active}
        inactive={counts.inactive}
        explicitLinking={explicitLinking}
        fallbackLinking={fallbackLinking}
        byGroup={counts.byGroup}
      />

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-700">State:</span>
        {(['all', 'active', 'inactive'] as AttackStepFilter[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded border px-3 py-1 ${
              filter === value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            {value}
          </button>
        ))}

        <label>
          Group
          <select className="ml-2 rounded border border-slate-300 px-2 py-1" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
            <option value="all">all</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        <label>
          Linking
          <select className="ml-2 rounded border border-slate-300 px-2 py-1" value={linkFilter} onChange={(e) => setLinkFilter(e.target.value as 'all' | 'fallback' | 'explicit')}>
            <option value="all">all</option>
            <option value="explicit">explicit/question-source</option>
            <option value="fallback">fallback</option>
          </select>
        </label>
      </div>

      <AttackStepTable items={filteredItems} />
    </div>
  );
}
