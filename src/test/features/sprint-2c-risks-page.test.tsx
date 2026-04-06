import { fireEvent, render, screen } from '@testing-library/react';
import { RisksPage } from '../../pages/risks/RisksPage';
import { useAnalysisStore } from '../../store/analysis-store';

describe('Macro Sprint 3 risks page', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnalysisStore.getState().resetAnalysis();
  });

  it('renders workbook-oriented risk register columns', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI15', 'major-disturbance');
    render(<RisksPage />);
    expect(screen.getByText(/Sprint 3 status/i)).toBeInTheDocument();
    expect(screen.getByText('Path strategy')).toBeInTheDocument();
    expect(screen.getByText('Risk ID')).toBeInTheDocument();
  });

  it('supports filters for status, risk level and linking strategy', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI15', 'major-disturbance');
    useAnalysisStore.getState().setQuestionAnswer1('QA2', 'no');
    render(<RisksPage />);

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'no-risk' } });
    expect(screen.getAllByText('No Risk').length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText('Risk level'), { target: { value: 'No Risk' } });
    expect(screen.getAllByText('No Risk').length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText('Linking strategy'), { target: { value: 'inferredFromQuestionSource' } });
    expect(screen.getByText('Path strategy')).toBeInTheDocument();
  });

  it('shows updated summary cards', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI15', 'major-disturbance');
    render(<RisksPage />);
    expect(screen.getByText('Linking coverage %')).toBeInTheDocument();
    expect(screen.getByText('Fallback rows')).toBeInTheDocument();
  });
});
