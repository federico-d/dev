import { RiskLevelLabel } from '../../domain/enums';
import type { RiskLevel } from '../../domain/types';

type Props = {
  level: RiskLevel;
};

const classes: Record<RiskLevel, string> = {
  [RiskLevelLabel.NoRisk]: 'bg-slate-100 text-slate-700 border-slate-200',
  [RiskLevelLabel.Low]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [RiskLevelLabel.Moderate]: 'bg-amber-100 text-amber-800 border-amber-200',
  [RiskLevelLabel.High]: 'bg-orange-100 text-orange-800 border-orange-200',
  [RiskLevelLabel.VeryHigh]: 'bg-rose-100 text-rose-800 border-rose-200',
};

export function RiskLevelBadge({ level }: Props) {
  return <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${classes[level]}`}>{level}</span>;
}
