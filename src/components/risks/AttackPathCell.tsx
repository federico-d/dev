import type { AttackPath } from '../../domain/types';

type Props = {
  attackPath: AttackPath;
};

export function AttackPathCell({ attackPath }: Props) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-xs text-slate-700">{attackPath.attackStepIds.join(' → ')}</p>
      <p className="text-[11px] text-slate-500">{attackPath.sourceStrategy}</p>
    </div>
  );
}
