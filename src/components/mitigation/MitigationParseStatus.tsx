import type { MitigationParseError } from '../../domain/types';

type Props = { errors: MitigationParseError[] };

export function MitigationParseStatus({ errors }: Props) {
  if (errors.length === 0) {
    return <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-xs text-emerald-700">ok</span>;
  }
  return <span className="rounded-full border border-rose-200 bg-rose-100 px-2 py-1 text-xs text-rose-700">{errors.length} error(s)</span>;
}
