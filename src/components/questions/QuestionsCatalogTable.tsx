import type { QuestionDefinition, QuestionKind } from '../../domain/types';

type Props = {
  questions: QuestionDefinition[];
  kindFilter: 'all' | QuestionKind;
  sectionFilter: string;
  onKindFilterChange: (value: 'all' | QuestionKind) => void;
  onSectionFilterChange: (value: string) => void;
};

export function QuestionsCatalogTable({
  questions,
  kindFilter,
  sectionFilter,
  onKindFilterChange,
  onSectionFilterChange,
}: Props) {
  const sections = Array.from(new Set(questions.map((question) => question.section))).sort();

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap gap-3">
        <label className="text-sm text-slate-700">
          Kind
          <select
            className="ml-2 rounded border border-slate-300 px-2 py-1"
            value={kindFilter}
            onChange={(event) => onKindFilterChange(event.target.value as 'all' | QuestionKind)}
          >
            <option value="all">All</option>
            <option value="QI">QI</option>
            <option value="QA">QA</option>
          </select>
        </label>

        <label className="text-sm text-slate-700">
          Section
          <select
            className="ml-2 rounded border border-slate-300 px-2 py-1"
            value={sectionFilter}
            onChange={(event) => onSectionFilterChange(event.target.value)}
          >
            <option value="all">All</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Kind</th>
              <th className="px-3 py-2 text-left">Section</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Answer Type</th>
              <th className="px-3 py-2 text-left">Has Answer2</th>
              <th className="px-3 py-2 text-left">Details Rule</th>
              <th className="px-3 py-2 text-left">Rationale Rule</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id} className="border-t border-slate-200">
                <td className="px-3 py-2 font-medium">{question.id}</td>
                <td className="px-3 py-2">{question.kind}</td>
                <td className="px-3 py-2">{question.section}</td>
                <td className="px-3 py-2">{question.title}</td>
                <td className="px-3 py-2">{question.answer1Type}</td>
                <td className="px-3 py-2">{question.hasAnswer2 ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2">{question.detailsRequiredWhen.length > 0 ? 'Configured' : '—'}</td>
                <td className="px-3 py-2">{question.rationaleRequiredWhen.length > 0 ? 'Configured' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
