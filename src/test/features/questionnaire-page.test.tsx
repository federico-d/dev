import { fireEvent, render, screen, within } from '@testing-library/react';
import { QuestionnairePage } from '../../pages/questionnaire/QuestionnairePage';
import { useAnalysisStore } from '../../store/analysis-store';

describe('QuestionnairePage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnalysisStore.getState().resetAnalysis();
  });

  it('renders workbook-faithful questions and validation rules', () => {
    render(<QuestionnairePage />);

    expect(screen.getByText('QI1')).toBeInTheDocument();
    expect(screen.getByText('QA10a')).toBeInTheDocument();
    expect(screen.getByText('QA10b')).toBeInTheDocument();
    expect(screen.getByText('QA11a')).toBeInTheDocument();
    expect(screen.getByText('QA11b')).toBeInTheDocument();

    expect(
      screen.getByText('Does the product provide cameras or other sensors with person-recognition capabilities?'),
    ).toBeInTheDocument();

    const qi1Row = screen.getByText('QI1').closest('article');
    expect(qi1Row).not.toBeNull();
    expect(within(qi1Row as HTMLElement).getByText('Answer 1 is required.')).toBeInTheDocument();

    const qi1Answer1 = within(qi1Row as HTMLElement).getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(qi1Answer1, { target: { value: 'ruinous' } });

    const rationale = within(qi1Row as HTMLElement).getByLabelText('Rationale');
    fireEvent.change(rationale, { target: { value: 'Business impact rationale' } });

    expect(useAnalysisStore.getState().questionnaire.byId.QI1.answer1).toBe('ruinous');
    expect(useAnalysisStore.getState().questionnaire.byId.QI1.rationale).toBe('Business impact rationale');
  });

  it('flags QA2/QA6 and QA20/QA21 consistency checks', () => {
    render(<QuestionnairePage />);

    const qa2Row = screen.getByText('QA2').closest('article') as HTMLElement;
    const qa6Row = screen.getByText('QA6').closest('article') as HTMLElement;
    const qa20Row = screen.getByText('QA20').closest('article') as HTMLElement;
    const qa21Row = screen.getByText('QA21').closest('article') as HTMLElement;

    fireEvent.change(within(qa2Row).getByRole('combobox'), { target: { value: 'internet-facing-gateway' } });
    fireEvent.change(within(qa6Row).getByRole('combobox'), { target: { value: 'no' } });
    fireEvent.change(within(qa20Row).getByRole('combobox'), { target: { value: '15' } });
    fireEvent.change(within(qa21Row).getByRole('combobox'), { target: { value: '3' } });

    expect(screen.getAllByText('QA2/QA6 inconsistency: internet-facing gateway cannot have QA6 = No.').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Lifetime is greater than support duration.').length).toBeGreaterThan(0);
  });
});
