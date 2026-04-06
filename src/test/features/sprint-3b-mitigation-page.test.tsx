import { fireEvent, render, screen } from '@testing-library/react';
import { MitigationPage } from '../../pages/mitigation/MitigationPage';
import { useAnalysisStore } from '../../store/analysis-store';

describe('Sprint 3B mitigation page', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnalysisStore.getState().resetAnalysis();
    useAnalysisStore.getState().setQuestionAnswer1('QI2', 'critical');
  });

  it('renders real mitigation table', () => {
    render(<MitigationPage />);
    expect(screen.getByText('Mitigation Planning')).toBeInTheDocument();
    expect(screen.getByText('Mitigated Attack Steps')).toBeInTheDocument();
  });

  it('editing raw input updates store', () => {
    render(<MitigationPage />);
    const input = screen.getAllByPlaceholderText('{CM1}, {CM5: High}, {A21}')[0] as HTMLInputElement;
    fireEvent.change(input, { target: { value: '{CM1}' } });
    expect(useAnalysisStore.getState().mitigations.byAttackStepId.AS1?.rawInput).toBe('{CM1}');
  });

  it('parse status shown and parse-error filter works', () => {
    useAnalysisStore.getState().setMitigationRawInput('AS1', 'CM1');
    render(<MitigationPage />);
    expect(screen.getByText(/error\(s\)/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Filter'), { target: { value: 'parse-errors' } });
    expect(screen.getByText('AS1')).toBeInTheDocument();
  });

  it('net RAP and highest remaining risk are shown', () => {
    useAnalysisStore.getState().setMitigationRawInput('AS1', '{CM1: High}');
    render(<MitigationPage />);
    expect(screen.getAllByText(/High/).length).toBeGreaterThan(0);
    expect(screen.getByText('Highest Remaining Risk')).toBeInTheDocument();
  });
});
