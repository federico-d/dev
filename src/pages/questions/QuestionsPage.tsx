import { useMemo, useState } from 'react';
import { QuestionsCatalogTable } from '../../components/questions/QuestionsCatalogTable';
import type { QuestionKind } from '../../domain/types';
import { selectQuestionsCatalog } from '../../store/selectors';

export function QuestionsPage() {
  const questions = selectQuestionsCatalog();
  const [kindFilter, setKindFilter] = useState<'all' | QuestionKind>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');

  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) => {
        if (kindFilter !== 'all' && question.kind !== kindFilter) {
          return false;
        }
        if (sectionFilter !== 'all' && question.section !== sectionFilter) {
          return false;
        }
        return true;
      }),
    [questions, kindFilter, sectionFilter],
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Questions Catalog</h2>
      <QuestionsCatalogTable
        questions={filteredQuestions}
        kindFilter={kindFilter}
        sectionFilter={sectionFilter}
        onKindFilterChange={setKindFilter}
        onSectionFilterChange={setSectionFilter}
      />
    </div>
  );
}
