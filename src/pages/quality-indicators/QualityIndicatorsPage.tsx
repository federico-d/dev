import { ValidationSeverity } from '../../domain/enums';
import { QualityIndicatorList } from '../../components/quality/QualityIndicatorList';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectQualityIndicators } from '../../store/selectors';

export function QualityIndicatorsPage() {
  const state = useAnalysisStore();
  const indicators = selectQualityIndicators(state);

  const totalIssues = indicators.reduce((acc, indicator) => acc + indicator.count, 0);
  const errors = indicators
    .filter((indicator) => indicator.severity === ValidationSeverity.Error)
    .reduce((acc, indicator) => acc + indicator.count, 0);
  const warnings = indicators
    .filter((indicator) => indicator.severity === ValidationSeverity.Warning)
    .reduce((acc, indicator) => acc + indicator.count, 0);

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Initial Analysis Quality Summary</h2>
        <p className="text-sm text-slate-700">Total issues: {totalIssues}</p>
        <p className="text-sm text-slate-700">Errors: {errors}</p>
        <p className="text-sm text-slate-700">Warnings: {warnings}</p>
        <p className="text-sm text-slate-500">
          Overall status: {errors > 0 ? 'Needs attention' : warnings > 0 ? 'Warnings present' : 'Good baseline'}
        </p>
      </section>

      <QualityIndicatorList indicators={indicators} />
    </div>
  );
}
