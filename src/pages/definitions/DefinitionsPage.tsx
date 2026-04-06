import {
  DAMAGE_LEVELS,
  EASE_DEFINITIONS,
  EASE_SCALES,
  QA18_SECURE_PRODUCTION_SCALE,
  QA19_SUPPLY_CHAIN_TRUST_SCALE,
  RAP_THRESHOLDS,
} from '../../domain/catalogs/definitions';
import { DefinitionTable } from '../../components/definitions/DefinitionTable';
import { RiskMatrixTable } from '../../components/definitions/RiskMatrixTable';

export function DefinitionsPage() {
  return (
    <div className="space-y-4">
      <DefinitionTable
        columns={[
          { key: 'value', label: 'Value' },
          { key: 'label', label: 'Damage level' },
        ]}
        rows={DAMAGE_LEVELS}
        title="Damage Levels"
      />

      <DefinitionTable
        columns={[
          { key: 'min', label: 'Min score' },
          { key: 'level', label: 'RAP level' },
        ]}
        rows={RAP_THRESHOLDS}
        title="RAP Thresholds"
      />

      <RiskMatrixTable />

      <DefinitionTable
        columns={[
          { key: 'factor', label: 'EASE factor' },
          { key: 'scale', label: 'Scale values' },
          { key: 'labels', label: 'Options' },
        ]}
        rows={Object.entries(EASE_SCALES).map(([factor, scale]) => ({
          factor,
          scale: scale.join(', '),
          labels: EASE_DEFINITIONS[factor as keyof typeof EASE_DEFINITIONS]
            .map((option) => `${option.label} (${option.score})`)
            .join(' | '),
        }))}
        title="EASE Scales"
      />

      <DefinitionTable
        columns={[
          { key: 'value', label: 'Value' },
          { key: 'label', label: 'QA18 Secure production' },
        ]}
        rows={QA18_SECURE_PRODUCTION_SCALE}
        title="QA18 Secure Production Scale"
      />

      <DefinitionTable
        columns={[
          { key: 'value', label: 'Value' },
          { key: 'label', label: 'QA19 Supply chain trust' },
        ]}
        rows={QA19_SUPPLY_CHAIN_TRUST_SCALE}
        title="QA19 Supply Chain Trust Scale"
      />
    </div>
  );
}
