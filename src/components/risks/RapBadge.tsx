import { RapLevel } from '../../domain/enums';

type Props = {
  level: RapLevel;
};

const levelClasses: Record<RapLevel, string> = {
  [RapLevel.Basic]: 'bg-slate-100 text-slate-700 border-slate-200',
  [RapLevel.EnhancedBasic]: 'bg-sky-100 text-sky-700 border-sky-200',
  [RapLevel.Moderate]: 'bg-amber-100 text-amber-800 border-amber-200',
  [RapLevel.High]: 'bg-orange-100 text-orange-800 border-orange-200',
  [RapLevel.BeyondHigh]: 'bg-rose-100 text-rose-800 border-rose-200',
};

export function RapBadge({ level }: Props) {
  return <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${levelClasses[level]}`}>{level}</span>;
}
