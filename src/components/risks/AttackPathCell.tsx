import type { PreliminaryAttackPath } from '../../domain/types';

type Props = {
  attackPath: PreliminaryAttackPath;
};

export function AttackPathCell({ attackPath }: Props) {
  return <span className="font-mono text-xs text-slate-700">{attackPath.join(' → ')}</span>;
}
