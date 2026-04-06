import type { AssumptionDefinition } from '../types';

export const ASSUMPTIONS_CATALOG: AssumptionDefinition[] = [
  {
    id: 'A17',
    name: 'Secure deployment environment',
    reference: 'QuBA-A17',
    stakeholder: 'Integrator',
    description: 'The deployment environment enforces baseline hardening controls.',
    status: 'default',
    annexMappings: ['a', 'c'],
  },
  {
    id: 'A18',
    name: 'Secure production process',
    reference: 'QuBA-A18',
    stakeholder: 'Manufacturer',
    description: 'Secure production practices are applied and verified.',
    status: 'conditional',
    annexMappings: ['b', 'd'],
  },
  {
    id: 'A22',
    name: 'Credential management policy',
    reference: 'QuBA-A22',
    stakeholder: 'Operator',
    description: 'Strong credential rotation and lockout policy in operation.',
    status: 'potentialAdditional',
    annexMappings: ['f', 'g'],
  },
  {
    id: 'A30',
    name: 'Physical access restrictions',
    reference: 'QuBA-A30',
    stakeholder: 'Operator',
    description: 'Physical access to the product is controlled and monitored.',
    status: 'activeByTemplate',
    annexMappings: ['h'],
  },
];
