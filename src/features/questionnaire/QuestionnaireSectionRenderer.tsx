import { QUESTION_SECTIONS_ORDER, QUESTIONS_CATALOG } from '../../domain/catalogs/questions';
import { SectionProgressCard } from '../../components/quality/SectionProgressCard';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectQuestionnaireProgress, selectQuestionValidationMap } from '../../store/selectors';
import { QuestionRow } from './QuestionRow';

export function QuestionnaireSectionRenderer() {
  const state = useAnalysisStore();
  const answersById = state.questionnaire.byId;

  const progress = selectQuestionnaireProgress(answersById);
  const validationMap = selectQuestionValidationMap(state);

  return (
    <div className="space-y-5">
      <div className="rounded-md bg-indigo-50 p-3 text-sm text-indigo-900">
        Questionnaire progress: <strong>{progress.answeredCount}</strong> / {progress.totalCount}
      </div>

      {QUESTION_SECTIONS_ORDER.map((sectionLabel) => {
        const [group, section] = sectionLabel.split(' / ');
        const questions = QUESTIONS_CATALOG.filter((q) => q.group === group && q.section === section).sort(
          (a, b) => a.workbookOrder - b.workbookOrder,
        );

        if (questions.length === 0) {
          return null;
        }

        const sectionProgress = progress.bySection[sectionLabel] ?? {
          answered: 0,
          total: questions.length,
          issues: 0,
        };

        return (
          <section className="space-y-3" key={sectionLabel}>
            <SectionProgressCard
              answered={sectionProgress.answered}
              issues={sectionProgress.issues}
              title={sectionLabel}
              total={sectionProgress.total}
            />

            <div className="space-y-3">
              {questions.map((question) => (
                <QuestionRow
                  key={question.id}
                  onAnswer1Change={(value) => state.setQuestionAnswer1(question.id, value)}
                  onAnswer2Change={(value) => state.setQuestionAnswer2(question.id, value)}
                  onRationaleChange={(value) => state.setQuestionRationale(question.id, value)}
                  question={question}
                  validationMessages={validationMap[question.id]?.messages ?? []}
                  value={answersById[question.id]}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
