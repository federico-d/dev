import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ValidationMessage } from '../../components/quality/ValidationMessage';
import { DOCUMENTATION_FIELDS } from '../../domain/catalogs/documentation-fields';
import type { MetadataState } from '../../domain/types';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectMetadataCompleteness, selectMetadataValidationMap } from '../../store/selectors';

const schema = z.object({
  toeName: z.string().min(1, 'Required'),
  author: z.string().min(1, 'Required'),
  pmContact: z.string().email('Invalid email'),
  rdContact: z.string().email('Invalid email'),
  css: z.string().min(1, 'Required'),
  csts: z.string().min(1, 'Required'),
  version: z.string().min(1, 'Required'),
  changeHistory: z.string().min(1, 'Required'),
});

type FormValues = z.infer<typeof schema>;

export function DocumentationForm() {
  const state = useAnalysisStore();
  const metadata = state.metadata;

  const { register, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      toeName: metadata.toeName ?? '',
      author: metadata.author ?? '',
      pmContact: metadata.pmContact ?? '',
      rdContact: metadata.rdContact ?? '',
      css: metadata.css ?? '',
      csts: metadata.csts ?? '',
      version: metadata.version ?? '',
      changeHistory: metadata.changeHistory ?? '',
    },
  });

  useEffect(() => {
    const subscription = watch((values, info) => {
      if (!info.name) {
        return;
      }

      const key = info.name as keyof MetadataState;
      state.setMetadataField(key, String(values[key] ?? ''));
    });

    return () => subscription.unsubscribe();
  }, [state, watch]);

  const completeness = selectMetadataCompleteness(metadata);
  const validationMap = selectMetadataValidationMap(state);

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
        Metadata completeness: <strong>{completeness.completionPercent}%</strong>
      </div>

      <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {DOCUMENTATION_FIELDS.map((field) => (
          <label className="flex flex-col gap-1" key={field.id}>
            <span className="text-sm font-semibold text-slate-800">{field.label}</span>
            {field.fieldType === 'textarea' ? (
              <textarea
                className="min-h-24 rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder={field.placeholder ?? ''}
                {...register(field.id as keyof FormValues)}
              />
            ) : (
              <input
                className="rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder={field.placeholder ?? ''}
                type={field.fieldType}
                {...register(field.id as keyof FormValues)}
              />
            )}
            {field.helpText && <span className="text-xs text-slate-500">{field.helpText}</span>}
            {validationMap[field.id]?.map((message) => (
              <ValidationMessage key={message.id} message={message} />
            ))}
            <span className="text-xs text-rose-600">
              {formState.errors[field.id as keyof FormValues]?.message?.toString() ?? ''}
            </span>
          </label>
        ))}
      </form>
    </section>
  );
}
