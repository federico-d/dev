import { ValidationSeverity } from '../../domain/enums';
import type { ValidationMessage as ValidationMessageType } from '../../domain/types';

type Props = {
  message: ValidationMessageType;
};

const severityClassMap: Record<ValidationSeverity, string> = {
  [ValidationSeverity.Error]: 'bg-rose-50 text-rose-700 border-rose-200',
  [ValidationSeverity.Warning]: 'bg-amber-50 text-amber-700 border-amber-200',
  [ValidationSeverity.Info]: 'bg-sky-50 text-sky-700 border-sky-200',
};

export function ValidationMessage({ message }: Props) {
  return <p className={`rounded border px-2 py-1 text-xs ${severityClassMap[message.severity]}`}>{message.message}</p>;
}
