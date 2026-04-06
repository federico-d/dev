import { RiskLevelBadge } from '../risks/RiskLevelBadge';
import type { NetRiskRow } from '../../domain/types';

type Props = { rows: NetRiskRow[] };

export function NetRiskList({ rows }: Props) {
  if (rows.length === 0) {
    return <p className="text-xs text-slate-500">No linked risk rows.</p>;
  }

  return (
    <ul className="space-y-1 text-xs">
      {rows.map((row) => (
        <li key={row.riskId}>
          <span className="font-medium">{row.riskId}</span> ({row.damageScenarioId})
          <span className="mx-1">base:</span>
          <RiskLevelBadge level={row.baseRiskLevel} />
          <span className="mx-1">→ net:</span>
          <RiskLevelBadge level={row.netRiskLevel} />
        </li>
      ))}
    </ul>
  );
}
