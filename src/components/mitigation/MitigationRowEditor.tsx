import { MitigationParseStatus } from './MitigationParseStatus';
import { NetRiskList } from './NetRiskList';
import type { MitigationRow } from '../../domain/types';

type Props = {
  row: MitigationRow;
  onRawInputChange: (value: string) => void;
};

export function MitigationRowEditor({ row, onRawInputChange }: Props) {
  return (
    <tr className="border-t border-slate-200 align-top">
      <td className="px-3 py-2 font-medium">{row.attackStepId}</td>
      <td className="px-3 py-2">{row.attackStepTitle}</td>
      <td className="px-3 py-2">{row.active ? 'active' : 'inactive'}</td>
      <td className="px-3 py-2 text-xs">{row.proposedCountermeasureIds.join(', ') || '—'}</td>
      <td className="px-3 py-2 text-xs">{row.proposedAssumptionIds.join(', ') || '—'}</td>
      <td className="px-3 py-2 text-xs">{row.additionalAssumptionIds.join(', ') || '—'}</td>
      <td className="px-3 py-2">
        <input
          className="w-72 rounded border border-slate-300 px-2 py-1 text-xs"
          value={row.rawInput}
          onChange={(event) => onRawInputChange(event.target.value)}
          placeholder="{CM1}, {CM5: High}, {A21}"
        />
      </td>
      <td className="px-3 py-2"><MitigationParseStatus errors={row.parseErrors} /></td>
      <td className="px-3 py-2 text-xs">{row.baseRapLevel} ({row.baseRapSum})</td>
      <td className="px-3 py-2 text-xs">{row.netRapLevel} ({row.netRapSum})</td>
      <td className="px-3 py-2 text-xs">{row.highestRemainingRisk ?? 'n/a'}</td>
      <td className="px-3 py-2 min-w-[280px]"><NetRiskList rows={row.netRiskRows} /></td>
    </tr>
  );
}
