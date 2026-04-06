import type { FactorExplanationEntry } from '../../domain/types';

type Props = {
  factors: FactorExplanationEntry[];
};

export function FactorExplanationList({ factors }: Props) {
  return (
    <ul className="space-y-1 text-xs text-slate-700">
      {factors.map((factor) => (
        <li key={factor.factor}>
          <span className="font-medium">{factor.factor}</span>: {factor.label} ({factor.score})
        </li>
      ))}
    </ul>
  );
}
