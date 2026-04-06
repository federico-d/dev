import { FactorExplanationList } from './FactorExplanationList';
import { RapBadge } from './RapBadge';
import { RiskLevelBadge } from './RiskLevelBadge';
import { AttackPathCell } from './AttackPathCell';
import type { RiskRow } from '../../domain/types';

type Props = {
  rows: RiskRow[];
};

export function RiskTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">No risk rows available yet. Complete questionnaire to generate damage scenarios.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-900">Initial Risk Rows</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">Risk ID</th>
              <th className="px-3 py-2 text-left">Attack Path</th>
              <th className="px-3 py-2 text-left">Attack Step</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Damage Scenario</th>
              <th className="px-3 py-2 text-left">Damage Level</th>
              <th className="px-3 py-2 text-left">RAP</th>
              <th className="px-3 py-2 text-left">Risk Level</th>
              <th className="px-3 py-2 text-left">Factors</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t border-slate-200 align-top" key={row.riskId}>
                <td className="px-3 py-2 font-medium">{row.riskId}</td>
                <td className="px-3 py-2"><AttackPathCell attackPath={row.attackPath} /></td>
                <td className="px-3 py-2">
                  <p className="font-medium">{row.attackStepId}</p>
                  <p className="text-xs text-slate-600">{row.attackStepTitle}</p>
                </td>
                <td className="px-3 py-2">{row.active ? 'active' : 'inactive'}</td>
                <td className="px-3 py-2">{row.damageScenarioId}</td>
                <td className="px-3 py-2">{row.damageLevelLabel} ({row.damageLevelValue})</td>
                <td className="px-3 py-2"><RapBadge level={row.rapLevel} /> <span className="ml-1">{row.rapSum}</span></td>
                <td className="px-3 py-2"><RiskLevelBadge level={row.riskLevel} /></td>
                <td className="px-3 py-2 min-w-[280px]"><FactorExplanationList factors={row.factorExplanation} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
