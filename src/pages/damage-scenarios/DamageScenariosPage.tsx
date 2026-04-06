import { DamageScenarioTable } from '../../components/damage/DamageScenarioTable';
import { useAnalysisStore } from '../../store/analysis-store';
import { selectDamageScenarios } from '../../store/selectors';

export function DamageScenariosPage() {
  const scenarios = selectDamageScenarios(useAnalysisStore());
  return <DamageScenarioTable scenarios={scenarios} />;
}
