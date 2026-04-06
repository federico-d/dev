import type { AttackStepInstance } from '../../domain/types';
import { AttackStepStatusBadge } from './AttackStepStatusBadge';
import { InactiveReasonsList } from './InactiveReasonsList';

type Props = {
  items: AttackStepInstance[];
};

export function AttackStepTable({ items }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-900">Attack Steps</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Group</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Inactive reasons</th>
              <th className="px-3 py-2 text-left">Countermeasures</th>
              <th className="px-3 py-2 text-left">Assumptions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr className="border-t border-slate-200 align-top" key={item.id}>
                <td className="px-3 py-2 font-medium">{item.id}</td>
                <td className="px-3 py-2">{item.title}</td>
                <td className="px-3 py-2">{item.group}</td>
                <td className="px-3 py-2">
                  <AttackStepStatusBadge status={item.status} />
                </td>
                <td className="px-3 py-2">
                  <InactiveReasonsList reasons={item.inactiveReasons} />
                </td>
                <td className="px-3 py-2">{item.proposedCountermeasureIds.join(', ') || '—'}</td>
                <td className="px-3 py-2">
                  {[...item.proposedAssumptionIds, ...item.additionalAssumptionIds].join(', ') || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
