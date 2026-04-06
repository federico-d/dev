import type { QualityIndicator } from '../../domain/types';
import { QualityIndicatorCard } from './QualityIndicatorCard';

type Props = {
  indicators: QualityIndicator[];
};

export function QualityIndicatorList({ indicators }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {indicators.map((indicator) => (
        <QualityIndicatorCard indicator={indicator} key={indicator.id} />
      ))}
    </div>
  );
}
