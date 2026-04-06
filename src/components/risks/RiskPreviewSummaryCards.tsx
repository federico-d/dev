type Props = {
  totalAttackSteps: number;
  activeAttackSteps: number;
  inactiveAttackSteps: number;
  highestRapLevelPresent: string | null;
  rapDistribution: Record<string, number>;
};

export function RiskPreviewSummaryCards({
  totalAttackSteps,
  activeAttackSteps,
  inactiveAttackSteps,
  highestRapLevelPresent,
  rapDistribution,
}: Props) {
  return (
    <div className="grid gap-3 lg:grid-cols-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Total Attack Steps</p>
        <p className="text-2xl font-semibold text-slate-900">{totalAttackSteps}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Active</p>
        <p className="text-2xl font-semibold text-slate-900">{activeAttackSteps}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Inactive</p>
        <p className="text-2xl font-semibold text-slate-900">{inactiveAttackSteps}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Highest RAP</p>
        <p className="text-lg font-semibold text-slate-900">{highestRapLevelPresent ?? 'n/a'}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">RAP Distribution</p>
        <p className="text-xs text-slate-700">{Object.entries(rapDistribution).map(([k, v]) => `${k}: ${v}`).join(' · ') || 'n/a'}</p>
      </div>
    </div>
  );
}
