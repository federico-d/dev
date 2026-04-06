import { fireEvent, render, screen } from '@testing-library/react';
import { RisksPage } from '../../pages/risks/RisksPage';
import { useAnalysisStore } from '../../store/analysis-store';

describe('Sprint 3A risks page', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnalysisStore.getState().resetAnalysis();
  });

  it('renders real risk table', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI2', 'critical');
    render(<RisksPage />);
    expect(screen.getByText('Initial Risk Rows')).toBeInTheDocument();
    expect(screen.getByText('Risk ID')).toBeInTheDocument();
  });

  it('shows risk level column values', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI2', 'critical');
    render(<RisksPage />);
    expect(screen.getAllByText('Moderate').length).toBeGreaterThan(0);
  });

  it('No Risk filter works', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI2', 'critical');
    useAnalysisStore.getState().setQuestionAnswer1('QA1', 'no');
    render(<RisksPage />);

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'no-risk' } });
    expect(screen.getAllByText('No Risk').length).toBeGreaterThan(0);
  });

  it('Risk level and RAP filters work', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI2', 'critical');
    render(<RisksPage />);

    fireEvent.change(screen.getByLabelText('Risk level'), { target: { value: 'Moderate' } });
    expect(screen.getAllByText('Moderate').length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText('RAP level'), { target: { value: 'Moderate' } });
    expect(screen.getAllByText('Moderate').length).toBeGreaterThan(0);
  });

  it('summary cards stay coherent', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI2', 'critical');
    render(<RisksPage />);
    expect(screen.getByText('Total Risk Rows')).toBeInTheDocument();
    expect(screen.getByText('Highest Risk')).toBeInTheDocument();
  });
});
