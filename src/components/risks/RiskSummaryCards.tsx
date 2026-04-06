import type { RiskSummaryStats } from '../../domain/types';

type Props = {
  summary: RiskSummaryStats;
};

export function RiskSummaryCards({ summary }: Props) {
  const cards = [
    ['Total Risk Rows', summary.total],
    ['No Risk', summary.noRisk],
    ['Low', summary.low],
    ['Moderate', summary.moderate],
    ['High', summary.high],
    ['Very High', summary.veryHigh],
    ['Highest Risk', summary.highestRiskLevelPresent ?? 'n/a'],
    ['Linking coverage %', summary.linkingCoverage],
    ['Fallback rows', summary.fallbackCount],
  ] as const;

  return (
    <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-9">
      {cards.map(([label, value]) => (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm" key={label}>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-lg font-semibold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
}
