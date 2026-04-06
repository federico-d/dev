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
              <th className="px-3 py-2 text-left">CM / A</th>
              <th className="px-3 py-2 text-left">Base EASE</th>
              <th className="px-3 py-2 text-left">RAP</th>
              <th className="px-3 py-2 text-left">Linking notes</th>
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
                <td className="px-3 py-2 text-xs">
                  <p>CM: {item.proposedCountermeasureIds.join(', ') || '—'}</p>
                  <p>A: {[...item.proposedAssumptionIds, ...item.additionalAssumptionIds].join(', ') || '—'}</p>
                </td>
                <td className="px-3 py-2 text-xs">
                  ET {item.baseEase.elapsedTime} / EX {item.baseEase.expertise} / KT {item.baseEase.knowledgeOfToe} / WO {item.baseEase.windowOfOpportunity} / EQ {item.baseEase.equipment}
                </td>
                <td className="px-3 py-2 text-xs">{item.rap.rapLevel} ({item.rap.sum})</td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {item.linkedDamageScenarioHints.notes}
                  {item.qualityFlags?.missingWorkbookLiteral ? ' • missingWorkbookLiteral' : ''}
                  {item.qualityFlags?.unresolvedLinkingGap ? ' • unresolvedLinkingGap' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
