import { RapLevel } from '../enums';
import type { CountermeasureDefinition, EaseFactorSet } from '../types';

type CmSeed = {
  id: string;
  name: string;
  reference: string;
  stakeholder: string;
  type: CountermeasureDefinition['type'];
  description: string;
  easeDelta: EaseFactorSet;
  forcedMinimumRap?: RapLevel | null;
  annexMappings: string[];
  configFlags?: Partial<CountermeasureDefinition['configFlags']>;
  workbookNotes?: string;
  tags?: string[];
  activeByTemplate?: boolean;
  defaultSelected?: boolean;
};

const DEFAULT_FLAGS: CountermeasureDefinition['configFlags'] = {
  requiresOemConfiguration: false,
  incompleteInTemplate: false,
  needsManualEaseValues: false,
  dependsOnProductCapabilities: false,
  affectsOutputText: false,
};

const cm = (seed: CmSeed): CountermeasureDefinition => ({
  id: seed.id,
  name: seed.name,
  reference: seed.reference,
  stakeholder: seed.stakeholder,
  type: seed.type,
  description: seed.description,
  easeDelta: seed.easeDelta,
  forcedMinimumRap: seed.forcedMinimumRap ?? null,
  annexMappings: seed.annexMappings,
  configFlags: { ...DEFAULT_FLAGS, ...seed.configFlags },
  sourceSheet: 'Countermeasures',
  workbookNotes: seed.workbookNotes,
  tags: seed.tags,
  activeByTemplate: seed.activeByTemplate,
  defaultSelected: seed.defaultSelected,
});

export const COUNTERMEASURES_CATALOG: CountermeasureDefinition[] = [
  cm({ id: 'CM1', name: 'Network segmentation and filtering', reference: 'IEC 62443-3-3 SR 3.1', stakeholder: 'Integrator', type: 'Baseline', description: 'Segment and filter traffic to reduce exposure.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['a', 'c'], tags: ['network'] }),
  cm({ id: 'CM2a', name: 'OEM-specific SDL governance', reference: 'Template TODO', stakeholder: 'Manufacturer', type: 'Additional', description: 'OEM-specific SDL control set requiring tenant/project configuration.', easeDelta: { elapsedTime: 0, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 0, equipment: 0 }, annexMappings: ['b'], configFlags: { requiresOemConfiguration: true, incompleteInTemplate: true, needsManualEaseValues: true, affectsOutputText: true }, workbookNotes: 'Template marks this control as OEM-specific TODO; ease values must be configured by project.', tags: ['sdl', 'oem'] }),
  cm({ id: 'CM2b', name: 'Secure coding standard enforcement', reference: 'IEC 62443-4-1', stakeholder: 'Manufacturer', type: 'Additional', description: 'Enforce secure coding standards and review gates.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 0, equipment: 0 }, forcedMinimumRap: RapLevel.EnhancedBasic, annexMappings: ['b', 'k'], tags: ['sdl'] }),
  cm({ id: 'CM3', name: 'Secure boot', reference: 'IEC 62443-4-2', stakeholder: 'Manufacturer', type: 'CM', description: 'Ensure only signed trusted firmware can boot.', easeDelta: { elapsedTime: 2, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 1 }, forcedMinimumRap: RapLevel.Moderate, annexMappings: ['f', 'g'] }),
  cm({ id: 'CM4', name: 'Runtime integrity protection', reference: 'IEC 62443-4-2', stakeholder: 'Manufacturer', type: 'CM', description: 'Detect and prevent runtime code tampering.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['f'] }),
  cm({ id: 'CM5', name: 'Strong authentication and lockout', reference: 'OWASP ASVS 2.1', stakeholder: 'Developer', type: 'CM', description: 'Harden authentication and lockout mechanisms.', easeDelta: { elapsedTime: 2, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 2, equipment: 0 }, forcedMinimumRap: RapLevel.Moderate, annexMappings: ['e', 'f'] }),
  cm({ id: 'CM6', name: 'Role-based access control', reference: 'IEC 62443-3-3 SR 1', stakeholder: 'Developer', type: 'CM', description: 'Implement RBAC to constrain privileges.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['f', 'h'] }),
  cm({ id: 'CM7', name: 'Mutual authentication for interfaces', reference: 'IEC 62443-3-3 SR 1.2', stakeholder: 'Developer', type: 'CM', description: 'Mutual authentication across product interfaces.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['e', 'f'] }),
  cm({ id: 'CM8', name: 'Encrypted communication channels', reference: 'IEC 62443-3-3 SR 3.1', stakeholder: 'Developer', type: 'CM', description: 'Protect communication confidentiality and integrity.', easeDelta: { elapsedTime: 1, expertise: 0, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['e', 'h'] }),
  cm({ id: 'CM10', name: 'Physical tamper protection', reference: 'IEC 62443-4-2', stakeholder: 'Manufacturer', type: 'CM', description: 'Use tamper-resistant/tamper-evident product design.', easeDelta: { elapsedTime: 2, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 1 }, annexMappings: ['j'] }),
  cm({ id: 'CM11', name: 'Rate limiting for service interfaces', reference: 'OWASP ASVS 4.3', stakeholder: 'Developer', type: 'CM', description: 'Reduce feasibility of automated service abuse.', easeDelta: { elapsedTime: 1, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 2, equipment: 0 }, annexMappings: ['e'] }),
  cm({ id: 'CM12', name: 'Session management hardening', reference: 'OWASP ASVS 3.2', stakeholder: 'Developer', type: 'CM', description: 'Prevent session fixation and hijacking.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['f'] }),
  cm({ id: 'CM14', name: 'Credential vaulting', reference: 'NIST SP 800-57', stakeholder: 'Operator', type: 'Additional', description: 'Store credentials and keys in managed secure vaults.', easeDelta: { elapsedTime: 2, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['h'], configFlags: { dependsOnProductCapabilities: true } }),
  cm({ id: 'CM15', name: 'Secure secret provisioning', reference: 'NIST SP 800-193', stakeholder: 'Manufacturer', type: 'CM', description: 'Provision secrets securely during manufacturing.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 0, equipment: 0 }, annexMappings: ['d', 'h'] }),
  cm({ id: 'CM16', name: 'Signed configuration bundles', reference: 'IEC 62443-4-2', stakeholder: 'Developer', type: 'CM', description: 'Protect configuration integrity with signatures.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['f'] }),
  cm({ id: 'CM17', name: 'Secure diagnostics mode', reference: 'IEC 62443-4-2', stakeholder: 'Service', type: 'Additional', description: 'Require controlled secure procedure for diagnostics mode.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['j'] }),
  cm({ id: 'CM18', name: 'Audit logging with integrity', reference: 'IEC 62443-3-3 SR 6', stakeholder: 'Operator', type: 'CM', description: 'Provide protected audit logs for security events.', easeDelta: { elapsedTime: 0, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['k'] }),
  cm({ id: 'CM19', name: 'Incident response runbooks', reference: 'ISO/IEC 27035', stakeholder: 'Operator', type: 'Additional', description: 'Maintain response runbooks for cyber incidents.', easeDelta: { elapsedTime: 0, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['k', 'l'], configFlags: { affectsOutputText: true } }),
  cm({ id: 'CM20', name: 'Security patch process', reference: 'ISO/IEC 30111', stakeholder: 'Manufacturer', type: 'CM', description: 'Operate patch process with defined response timelines.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 0, equipment: 0 }, forcedMinimumRap: RapLevel.EnhancedBasic, annexMappings: ['l'] }),
  cm({ id: 'CM21', name: 'Vulnerability disclosure program', reference: 'ISO/IEC 29147', stakeholder: 'Manufacturer', type: 'Additional', description: 'Provide coordinated vulnerability disclosure channel.', easeDelta: { elapsedTime: 0, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 0, equipment: 0 }, annexMappings: ['l'], configFlags: { affectsOutputText: true } }),
  cm({ id: 'CM22', name: 'Hardening checklist at delivery', reference: 'IEC 62443-4-2', stakeholder: 'Integrator', type: 'Baseline', description: 'Deliver installation hardening checklist.', easeDelta: { elapsedTime: 1, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['a', 'm'], defaultSelected: true }),
  cm({ id: 'CM23', name: 'Backup and restore strategy', reference: 'IEC 62443-3-3 SR 7.3', stakeholder: 'Operator', type: 'Additional', description: 'Use tested backup and restore procedures.', easeDelta: { elapsedTime: 0, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['g', 'm'] }),
  cm({ id: 'CM24', name: 'Fail-safe behavior validation', reference: 'IEC 61508', stakeholder: 'Manufacturer', type: 'Additional', description: 'Validate fail-safe behavior for abnormal conditions.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['g', 'j'], configFlags: { dependsOnProductCapabilities: true } }),
  cm({ id: 'CM25', name: 'Segregated admin interfaces', reference: 'IEC 62443-3-3 SR 1', stakeholder: 'Integrator', type: 'CM', description: 'Separate administrative interfaces from user-facing interfaces.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['e', 'f'] }),
  cm({ id: 'CM26', name: 'Brute-force protection controls', reference: 'OWASP ASVS 2.2', stakeholder: 'Developer', type: 'CM', description: 'Mitigate brute-force over routable interfaces.', easeDelta: { elapsedTime: 2, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 2, equipment: 0 }, forcedMinimumRap: RapLevel.EnhancedBasic, annexMappings: ['e'] }),
  cm({ id: 'CM27', name: 'Signed update package validation', reference: 'ISO/IEC 30111', stakeholder: 'Manufacturer', type: 'CM', description: 'Verify signatures and integrity of update packages.', easeDelta: { elapsedTime: 2, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, forcedMinimumRap: RapLevel.Moderate, annexMappings: ['f', 'l'] }),
  cm({ id: 'CM28', name: 'Supply chain tamper checks', reference: 'ISO 28000', stakeholder: 'Manufacturer', type: 'Additional', description: 'Perform tamper checks during logistics and receiving.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['d'], configFlags: { dependsOnProductCapabilities: true } }),
  cm({ id: 'C0', name: 'Documented security policy baseline', reference: 'CRA Annex I', stakeholder: 'Manufacturer', type: 'Default', description: 'Define baseline policy set used by QuBA outputs.', easeDelta: { elapsedTime: 0, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 0, equipment: 0 }, annexMappings: ['m'], configFlags: { affectsOutputText: true }, defaultSelected: true }),
  cm({ id: 'C3', name: 'Secure credential storage', reference: 'IEC 62443-4-2', stakeholder: 'Developer', type: 'CM', description: 'Use secure storage primitives for credentials.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 0, equipment: 0 }, annexMappings: ['h'] }),
  cm({ id: 'C13', name: 'Secure decommissioning guidance', reference: 'CRA Annex I', stakeholder: 'Manufacturer', type: 'Additional', description: 'Provide secure decommissioning and disposal guidance.', easeDelta: { elapsedTime: 0, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 0, equipment: 0 }, annexMappings: ['m'], configFlags: { affectsOutputText: true } }),
  cm({ id: 'C15', name: 'Tamper-resistant casing', reference: 'IEC 62443-4-2', stakeholder: 'Manufacturer', type: 'CM', description: 'Increase effort required for physical tampering.', easeDelta: { elapsedTime: 2, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 1 }, annexMappings: ['j'] }),
  cm({ id: 'C17', name: 'Secure key rotation mechanism', reference: 'NIST SP 800-57', stakeholder: 'Developer', type: 'CM', description: 'Support secure key rotation and revocation.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['h'] }),
  cm({ id: 'C20', name: 'Mutual TLS for backend channels', reference: 'RFC 8446', stakeholder: 'Developer', type: 'CM', description: 'Use mTLS for backend and cloud channels.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['e', 'h'] }),
  cm({ id: 'C21', name: 'API schema validation', reference: 'OWASP API Security', stakeholder: 'Developer', type: 'CM', description: 'Strict schema validation for incoming payloads.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['f'] }),
  cm({ id: 'C24', name: 'Recovery mode hardening', reference: 'IEC 62443-4-2', stakeholder: 'Manufacturer', type: 'CM', description: 'Protect recovery paths against unauthorized use.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['g', 'j'], configFlags: { dependsOnProductCapabilities: true } }),
  cm({ id: 'C27', name: 'Signed update validation', reference: 'ISO/IEC 30111', stakeholder: 'Manufacturer', type: 'CM', description: 'Validate software updates using signature verification.', easeDelta: { elapsedTime: 2, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, forcedMinimumRap: RapLevel.Moderate, annexMappings: ['e', 'f'] }),
  cm({ id: 'C29', name: 'Update rollback protection', reference: 'NIST SP 800-193', stakeholder: 'Manufacturer', type: 'CM', description: 'Prevent downgrade/rollback to vulnerable versions.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['f', 'l'] }),
  cm({ id: 'C30', name: 'Configuration integrity attestation', reference: 'IEC 62443-4-2', stakeholder: 'Integrator', type: 'CM', description: 'Provide configuration integrity attestation at runtime.', easeDelta: { elapsedTime: 1, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 0, equipment: 0 }, annexMappings: ['f'] }),
  cm({ id: 'C32', name: 'Rate limiting for authentication endpoints', reference: 'OWASP ASVS 2.1', stakeholder: 'Developer', type: 'CM', description: 'Limit brute-force attempts on authentication interfaces.', easeDelta: { elapsedTime: 2, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 2, equipment: 0 }, forcedMinimumRap: RapLevel.EnhancedBasic, annexMappings: ['g'] }),
  cm({ id: 'C33', name: 'Security baseline telemetry', reference: 'CRA Annex I', stakeholder: 'Operator', type: 'Additional', description: 'Collect baseline telemetry for security-relevant states.', easeDelta: { elapsedTime: 0, expertise: 1, knowledgeOfToe: 0, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['k'], configFlags: { affectsOutputText: true } }),
  cm({ id: 'C34', name: 'Operator hardening checklist acknowledgment', reference: 'CRA Annex I', stakeholder: 'Operator', type: 'Additional', description: 'Capture operator acknowledgment of hardening checklist.', easeDelta: { elapsedTime: 0, expertise: 0, knowledgeOfToe: 0, windowOfOpportunity: 0, equipment: 0 }, annexMappings: ['m'], configFlags: { affectsOutputText: true } }),
  cm({ id: 'C35', name: 'Credential misuse anomaly detection', reference: 'MITRE ATT&CK', stakeholder: 'Operator', type: 'Additional', description: 'Detect anomalous credential usage patterns.', easeDelta: { elapsedTime: 0, expertise: 1, knowledgeOfToe: 1, windowOfOpportunity: 1, equipment: 0 }, annexMappings: ['k'] }),
];
