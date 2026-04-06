import { ValidationSeverity } from '../../domain/enums';
import type { QualityIndicator } from '../../domain/types';

type Props = {
  indicator: QualityIndicator;
};

const severityClassMap: Record<ValidationSeverity, string> = {
  [ValidationSeverity.Error]: 'bg-rose-100 text-rose-800',
  [ValidationSeverity.Warning]: 'bg-amber-100 text-amber-800',
  [ValidationSeverity.Info]: 'bg-sky-100 text-sky-800',
};

export function QualityIndicatorCard({ indicator }: Props) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{indicator.title}</h3>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${severityClassMap[indicator.severity]}`}>
          {indicator.severity}
        </span>
      </div>
      <p className="mb-2 text-sm text-slate-700">Count: {indicator.count}</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
        {indicator.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </article>
  );
}
