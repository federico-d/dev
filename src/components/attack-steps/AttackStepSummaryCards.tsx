type Props = {
  total: number;
  active: number;
  inactive: number;
  explicitLinking: number;
  fallbackLinking: number;
  byGroup: Record<string, { total: number; active: number; inactive: number }>;
};

export function AttackStepSummaryCards({ total, active, inactive, explicitLinking, fallbackLinking, byGroup }: Props) {
  const cards = [
    { label: 'Total Attack Steps', value: total },
    { label: 'Active', value: active },
    { label: 'Inactive', value: inactive },
    { label: 'Explicit linking', value: explicitLinking },
    { label: 'Fallback linking', value: fallbackLinking },
  ];

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-sm">
        {Object.entries(byGroup)
          .map(([group, values]) => `${group}: ${values.active}/${values.total} active`)
          .join(' • ')}
      </div>
    </div>
  );
}
