import { RapBadge } from './RapBadge';
import { FactorExplanationList } from './FactorExplanationList';
import type { PreliminaryRiskRow } from '../../domain/types';

type Props = {
  rows: PreliminaryRiskRow[];
};

export function PreliminaryRiskTable({ rows }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-900">Preliminary Risks Preview</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">Attack Step</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">RAP Level</th>
              <th className="px-3 py-2 text-left">RAP Sum</th>
              <th className="px-3 py-2 text-left">Factors</th>
              <th className="px-3 py-2 text-left">Linked Damage Scenarios</th>
              <th className="px-3 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t border-slate-200 align-top" key={row.attackStepId}>
                <td className="px-3 py-2">
                  <p className="font-medium">{row.attackStepId}</p>
                  <p className="text-xs text-slate-600">{row.attackStepTitle}</p>
                </td>
                <td className="px-3 py-2">{row.active ? 'active' : 'inactive'}</td>
                <td className="px-3 py-2">
                  <RapBadge level={row.rapLevel} />
                </td>
                <td className="px-3 py-2">{row.rapSum}</td>
                <td className="px-3 py-2 min-w-[280px]">
                  <FactorExplanationList factors={row.factorExplanation} />
                </td>
                <td className="px-3 py-2">{row.linkedDamageScenarioIds.join(', ') || 'not linked yet'}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
