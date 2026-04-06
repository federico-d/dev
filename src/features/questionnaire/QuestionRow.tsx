import { ValidationMessage } from '../../components/quality/ValidationMessage';
import type { QuestionDefinition, QuestionnaireAnswer, ValidationMessage as ValidationMessageType } from '../../domain/types';

type Props = {
  question: QuestionDefinition;
  value?: QuestionnaireAnswer;
  validationMessages: ValidationMessageType[];
  onAnswer1Change: (value: string) => void;
  onAnswer2Change: (value: string) => void;
  onRationaleChange: (value: string) => void;
};

function renderInput(
  type: QuestionDefinition['answer1Type'],
  value: string,
  onChange: (value: string) => void,
  options: QuestionDefinition['answer1Options'],
) {
  if (type === 'singleSelect' || type === 'boolean' || type === 'duration') {
    return (
      <select
        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
      onChange={(event) => onChange(event.target.value)}
      type="text"
      value={value}
    />
  );
}

export function QuestionRow({
  question,
  value,
  validationMessages,
  onAnswer1Change,
  onAnswer2Change,
  onRationaleChange,
}: Props) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="font-semibold text-slate-900">{question.id}</h4>
      <p className="mb-1 text-sm text-slate-700">{question.title}</p>
      {question.additionalQuestionText && <p className="mb-2 text-xs text-slate-600">{question.additionalQuestionText}</p>}
      {question.instructions && <p className="mb-3 rounded bg-slate-50 px-2 py-1 text-xs text-slate-700">{question.instructions}</p>}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase text-slate-600">Answer</span>
          {renderInput(question.answer1Type, value?.answer1 ?? '', onAnswer1Change, question.answer1Options)}
        </label>

        {question.hasAnswer2 && (
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase text-slate-600">{question.answer2Label}</span>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) => onAnswer2Change(event.target.value)}
              type="text"
              value={value?.answer2 ?? ''}
            />
          </label>
        )}
      </div>

      <label className="mt-3 flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase text-slate-600">Rationale</span>
        <textarea
          className="min-h-20 rounded border border-slate-300 px-3 py-2 text-sm"
          onChange={(event) => onRationaleChange(event.target.value)}
          value={value?.rationale ?? ''}
        />
      </label>

      {validationMessages.length > 0 && (
        <div className="mt-3 space-y-2">
          {validationMessages.map((message) => (
            <ValidationMessage key={message.id} message={message} />
          ))}
        </div>
      )}
    </article>
  );
}
