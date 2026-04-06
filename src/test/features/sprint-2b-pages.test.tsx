import { fireEvent, render, screen } from '@testing-library/react';
import { AttackStepsPage } from '../../pages/attack-steps/AttackStepsPage';
import { QuestionsPage } from '../../pages/questions/QuestionsPage';
import { useAnalysisStore } from '../../store/analysis-store';

describe('Sprint 2B pages', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnalysisStore.getState().resetAnalysis();
  });

  it('renders Questions page with real catalog', () => {
    render(<QuestionsPage />);
    expect(screen.getByText('Questions Catalog')).toBeInTheDocument();
    expect(screen.getByText('QI1')).toBeInTheDocument();
    expect(screen.getByText('QA1')).toBeInTheDocument();
  });

  it('Questions page filters by kind and section', () => {
    render(<QuestionsPage />);

    fireEvent.change(screen.getByLabelText('Kind'), { target: { value: 'QA' } });
    expect(screen.queryByText('QI1')).not.toBeInTheDocument();
    expect(screen.getByText('QA1')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Section'), { target: { value: 'Lifecycle' } });
    expect(screen.getByText('QA16')).toBeInTheDocument();
    expect(screen.queryByText('QA1')).not.toBeInTheDocument();
  });

  it('renders Attack Steps page with summary and table', () => {
    render(<AttackStepsPage />);
    expect(screen.getByText('Total Attack Steps')).toBeInTheDocument();
    expect(screen.getByText('AS1')).toBeInTheDocument();
  });

  it('Attack Steps page reacts to questionnaire answers from store', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QA1', 'no');
    render(<AttackStepsPage />);
    expect(screen.getAllByText('Connectivity is disabled (QA1 = No).').length).toBeGreaterThan(0);
  });

  it('Attack Steps page filter active/inactive works', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QA1', 'no');
    render(<AttackStepsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'inactive' }));
    expect(screen.getByText('AS2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'active' }));
    expect(screen.queryByText('AS2')).not.toBeInTheDocument();
  });
});
