import { fireEvent, render, screen, within } from '@testing-library/react';
import { QuestionnairePage } from '../../pages/questionnaire/QuestionnairePage';
import { useAnalysisStore } from '../../store/analysis-store';

describe('QuestionnairePage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnalysisStore.getState().resetAnalysis();
  });

  it('renders schema-driven questions and inline validation, then writes answers to store', () => {
    render(<QuestionnairePage />);

    expect(screen.getByText('QI1')).toBeInTheDocument();
    expect(screen.getByText('QI16')).toBeInTheDocument();
    expect(screen.getByText('QA1')).toBeInTheDocument();
    expect(screen.getByText('QA21')).toBeInTheDocument();

    const qi1Row = screen.getByText('QI1').closest('article');
    expect(qi1Row).not.toBeNull();
    expect(within(qi1Row as HTMLElement).getByText('Answer 1 is required.')).toBeInTheDocument();

    const qi1Answer1 = within(qi1Row as HTMLElement).getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(qi1Answer1, { target: { value: 'high' } });

    const rationale = within(qi1Row as HTMLElement).getByLabelText('Rationale');
    fireEvent.change(rationale, { target: { value: 'Business impact rationale' } });

    expect(useAnalysisStore.getState().questionnaire.byId.QI1.answer1).toBe('high');
    expect(useAnalysisStore.getState().questionnaire.byId.QI1.rationale).toBe('Business impact rationale');
    expect(within(qi1Row as HTMLElement).getByText('Details are required for the selected Answer 1.')).toBeInTheDocument();
  });
});
