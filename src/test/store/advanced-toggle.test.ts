import { useAnalysisStore } from '../../store/analysis-store';
import { PERSIST_KEY } from '../../store/persist';

describe('advanced mode persistence', () => {
  it('persists advancedMode value in localStorage', () => {
    localStorage.clear();

    useAnalysisStore.getState().resetAnalysis();
    expect(useAnalysisStore.getState().ui.advancedMode).toBe(false);

    useAnalysisStore.getState().toggleAdvancedMode();
    expect(useAnalysisStore.getState().ui.advancedMode).toBe(true);

    const raw = localStorage.getItem(PERSIST_KEY);
    expect(raw).not.toBeNull();
    expect(raw).toContain('advancedMode');
    expect(raw).toContain('true');
  });
});
