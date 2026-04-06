import type {
  ActivationRule,
  AttackStepDefinition,
  AttackStepGroup,
  AttackStepQualityFlags,
  EaseFactorSet,
  QuestionConditionGroup,
} from '../types';

const BASE_EASE_BY_GROUP: Record<AttackStepGroup, EaseFactorSet> = {
  General: { elapsedTime: 2, expertise: 3, knowledgeOfToe: 3, windowOfOpportunity: 2, equipment: 3 },
  Connectivity: { elapsedTime: 4, expertise: 4, knowledgeOfToe: 5, windowOfOpportunity: 3, equipment: 4 },
  Communication: { elapsedTime: 5, expertise: 4, knowledgeOfToe: 6, windowOfOpportunity: 4, equipment: 4 },
  Physical: { elapsedTime: 9, expertise: 6, knowledgeOfToe: 5, windowOfOpportunity: 9, equipment: 7 },
  Lifecycle: { elapsedTime: 10, expertise: 6, knowledgeOfToe: 7, windowOfOpportunity: 6, equipment: 7 },
  'Supply Chain': { elapsedTime: 19, expertise: 8, knowledgeOfToe: 9, windowOfOpportunity: 10, equipment: 9 },
};

const inferredLiteralGap: AttackStepQualityFlags = {
  missingWorkbookLiteral: true,
  partiallyInferred: true,
  needsParityReview: true,
  estimatedFromWorkbookContext: true,
};

function condition(questionId: string, expected: string | string[]): QuestionConditionGroup {
  return { conditions: [{ questionId, operator: Array.isArray(expected) ? 'in' : 'equals', value: expected }] };
}

function inactiveRule(id: string, questionId: string, expected: string | string[], reasonText: string): ActivationRule {
  return { id, reasonCode: `${questionId}-constraint`, reasonText, when: condition(questionId, expected) };
}

function makeStep(
  id: number,
  group: AttackStepGroup,
  title: string,
  description: string,
  overrides: Partial<AttackStepDefinition> = {},
): AttackStepDefinition {
  const attackStepId = `AS${id}`;
  return {
    id: attackStepId,
    workbookOrder: id,
    title,
    description,
    group,
    sourceSheet: 'Attack Steps',
    inactiveWhen: [],
    preconditions: [],
    proposedCountermeasureIds: [],
    proposedAssumptionIds: [],
    additionalAssumptionIds: [],
    linkedDamageScenarioHints: {
      sourceQuestionIds: ['QI11', 'QI12', 'QI13', 'QI14', 'QI15', 'QI16'],
      categories: ['C', 'I', 'A', 'F'],
      scenarioLabels: [],
      notes: 'Default inferred mapping from manipulation-oriented impact questions.',
    },
    baseEase: BASE_EASE_BY_GROUP[group],
    annexTags: [],
    workbookNotes: 'Workbook literal for this AS is not embedded in the repository snapshot; mapped from QA/QI context.',
    rationale: 'Transcription is workbook-oriented but still pending literal parity review.',
    qualityFlags: inferredLiteralGap,
    ...overrides,
  };
}

export const ATTACK_STEPS_CATALOG: AttackStepDefinition[] = [
  makeStep(1, 'General', 'Abuse default exposed functionality', 'Attacker abuses reachable default features to perform unauthorized actions.', {
    proposedCountermeasureIds: ['CM1', 'CM2a'],
    proposedAssumptionIds: ['A22'],
    linkedDamageScenarioHints: { sourceQuestionIds: ['QI14', 'QI15', 'QI16'], categories: ['I', 'F'], scenarioLabels: ['Manipulated operational disturbance'], notes: 'Generic abuse flows to manipulated-operation damages.' },
  }),
  makeStep(2, 'Connectivity', 'Remote network entry via wireless exposure', 'Attacker reaches product through wireless-reachable connectivity and attempts unauthorized access.', {
    inactiveWhen: [inactiveRule('as2-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'), inactiveRule('as2-qa5-no', 'QA5', 'no', 'Wireless connectivity not available (QA5 = No).'), inactiveRule('as2-qa13-no', 'QA13', 'no', 'Wireless gateway linkage not present (QA13 = No).')],
    proposedCountermeasureIds: ['CM3', 'CM4'],
    proposedAssumptionIds: ['A21'],
    linkedDamageScenarioHints: { sourceQuestionIds: ['QI7', 'QI8', 'QI14', 'QI15'], categories: ['A', 'I'], scenarioLabels: ['Operating environment disturbance', 'Customer asset/network access (major disturbance)'], notes: 'Wireless connectivity attack vectors primarily map to availability/integrity disturbance scenarios.' },
  }),
  makeStep(3, 'Communication', 'Manipulate peer-to-peer protocol exchange', 'Attacker manipulates traffic or protocol states in point-to-point communications.', { proposedCountermeasureIds: ['CM5'], proposedAssumptionIds: ['A30'] }),
  makeStep(4, 'Communication', 'Spoof protocol participant identity', 'Attacker forges protocol identities to inject unauthorized commands or data.', { proposedCountermeasureIds: ['CM5', 'CM6'], proposedAssumptionIds: ['A30'] }),
  makeStep(5, 'Connectivity', 'Compromise local-network service exposure', 'Attacker abuses services exposed on local or adjacent networks.', {
    inactiveWhen: [inactiveRule('as5-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')],
    proposedCountermeasureIds: ['CM3', 'CM7'],
  }),
  makeStep(6, 'Connectivity', 'Exploit Internet/mobile edge channel', 'Attacker leverages direct Internet/mobile connectivity of the TOE.', {
    inactiveWhen: [inactiveRule('as6-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')],
    proposedCountermeasureIds: ['CM8', 'CM9'],
    preconditions: ['QA6 = yes'],
  }),
  makeStep(7, 'Connectivity', 'Abuse exposed network services', 'Attacker abuses services actively offered to other network entities.', {
    inactiveWhen: [inactiveRule('as7-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')],
    proposedCountermeasureIds: ['CM7'],
    preconditions: ['QA7 = yes'],
  }),
  makeStep(8, 'Connectivity', 'Wireless interception and command replay', 'Attacker intercepts and replays wireless exchanges to trigger unintended behavior.', {
    inactiveWhen: [inactiveRule('as8-qa5-no', 'QA5', 'no', 'Wireless connectivity not available (QA5 = No).'), inactiveRule('as8-qa13-no', 'QA13', 'no', 'Wireless gateway linkage not present (QA13 = No).')],
    proposedCountermeasureIds: ['CM10'],
  }),
  makeStep(9, 'Connectivity', 'Gateway pivot across connected networks', 'Attacker pivots through gateway function into another network segment.', {
    inactiveWhen: [inactiveRule('as9-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'), inactiveRule('as9-qa2-no', 'QA2', 'no', 'Gateway role not present (QA2 = No).')],
    proposedCountermeasureIds: ['CM11'],
    linkedDamageScenarioHints: { sourceQuestionIds: ['QI8', 'QI15'], categories: ['I'], scenarioLabels: ['Customer asset/network access (critical disturbance)'], notes: 'Gateway pivot directly links to customer-network attack scenarios.' },
  }),
  makeStep(10, 'Connectivity', 'Misuse configuration interface access', 'Attacker abuses available configuration interfaces to change security-relevant settings.', {
    inactiveWhen: [inactiveRule('as10-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')],
    preconditions: ['QA8 = yes'],
    proposedCountermeasureIds: ['CM12'],
  }),
  makeStep(11, 'Connectivity', 'Abuse routable stack exposure', 'Attacker targets reachable routable stack components and protocol parsers.', {
    inactiveWhen: [inactiveRule('as11-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')],
    preconditions: ['QA9 = yes'],
    proposedCountermeasureIds: ['CM8', 'CM13'],
  }),
  makeStep(12, 'Connectivity', 'Inject malicious local removable media payload', 'Attacker uses local external system media (USB/SD/RFID) to introduce malicious payloads.', {
    inactiveWhen: [inactiveRule('as12-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'), inactiveRule('as12-qa10a-no', 'QA10a', 'no', 'Local external system interface unavailable (QA10a = No).')],
    proposedCountermeasureIds: ['CM14'],
  }),
  makeStep(13, 'Connectivity', 'Compromise gateway-mediated local network path', 'Attacker leverages logical local-network linkage via gateway for unauthorized access.', {
    inactiveWhen: [inactiveRule('as13-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'), inactiveRule('as13-qa12-no', 'QA12', 'no', 'Logical local network linkage unavailable (QA12 = No).')],
    proposedCountermeasureIds: ['CM11'],
  }),
  makeStep(14, 'Connectivity', 'Manipulate trust of adjacent connected nodes', 'Attacker compromises adjacent connected devices and uses established trust relationships.', {
    inactiveWhen: [inactiveRule('as14-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')],
    proposedAssumptionIds: ['A31'],
  }),
  makeStep(15, 'Connectivity', 'Remote abuse over direct Internet uplink', 'Attacker targets the product over direct mobile/Internet uplink paths.', {
    inactiveWhen: [inactiveRule('as15-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'), inactiveRule('as15-qa6-no', 'QA6', 'no', 'Direct Internet/mobile uplink unavailable (QA6 = No).')],
    proposedCountermeasureIds: ['CM8', 'CM15'],
  }),
  makeStep(16, 'Connectivity', 'Exploit weak service hardening on connected interface', 'Attacker exploits insufficient hardening/authentication on connected service interfaces.', {
    inactiveWhen: [inactiveRule('as16-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')],
    proposedCountermeasureIds: ['CM7', 'CM12'],
  }),
  makeStep(17, 'Connectivity', 'Abuse protocol parsing on connected channel', 'Attacker sends malformed traffic on connected channels to trigger parser failures.', {
    inactiveWhen: [inactiveRule('as17-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).')],
    proposedCountermeasureIds: ['CM13'],
  }),
  makeStep(18, 'Physical', 'Unauthorized software update through interface', 'Attacker performs unauthorized update through available update interface.', {
    inactiveWhen: [inactiveRule('as18-qa11a-no', 'QA11a', 'no', 'Update interface not available (QA11a = No).')],
    preconditions: ['QA11a = yes'],
    proposedCountermeasureIds: ['CM16'],
  }),
  makeStep(19, 'Physical', 'Downgrade firmware via update process abuse', 'Attacker abuses update flow to install older vulnerable firmware.', {
    inactiveWhen: [inactiveRule('as19-qa11a-no', 'QA11a', 'no', 'Update interface not available (QA11a = No).')],
    proposedCountermeasureIds: ['CM16', 'CM17'],
  }),
  makeStep(20, 'Physical', 'Tamper update package authenticity checks', 'Attacker circumvents integrity/authenticity controls on update packages.', {
    inactiveWhen: [inactiveRule('as20-qa11a-no', 'QA11a', 'no', 'Update interface not available (QA11a = No).')],
    proposedCountermeasureIds: ['CM17'],
  }),
  makeStep(21, 'Physical', 'Physical enclosure tampering at accessible installation', 'Attacker tampers with the product enclosure at physically accessible locations.', {
    inactiveWhen: [inactiveRule('as21-qa14-no', 'QA14', 'no', 'Product not installed in physically accessible location (QA14 = No).')],
    proposedCountermeasureIds: ['CM18'],
  }),
  makeStep(22, 'Physical', 'Access internal debug pads from physical exposure', 'Attacker gains access to internal pads/ports by physical opening and probing.', {
    inactiveWhen: [inactiveRule('as22-qa14-no', 'QA14', 'no', 'Product not installed in physically accessible location (QA14 = No).')],
    proposedCountermeasureIds: ['CM18', 'CM19'],
  }),
  makeStep(23, 'Physical', 'Inject malicious signals on public physical bus', 'Attacker injects malicious traffic on physically exposed/public bus connections.', {
    inactiveWhen: [inactiveRule('as23-qa14-no', 'QA14', 'no', 'Product not installed in physically accessible location (QA14 = No).')],
    preconditions: ['QA16 = yes'],
    proposedCountermeasureIds: ['CM20'],
  }),
  makeStep(24, 'Physical', 'Bypass physical tamper evidence and seals', 'Attacker bypasses tamper evidence or equivalent anti-tamper controls.', { proposedCountermeasureIds: ['CM18'] }),
  makeStep(25, 'Lifecycle', 'Exploit enabled debug interfaces in production', 'Attacker uses enabled debug/development interface left accessible in production.', {
    inactiveWhen: [inactiveRule('as25-qa17-no', 'QA17', 'no', 'Debug/development interface not available (QA17 = No).')],
    proposedCountermeasureIds: ['CM21'],
  }),
  makeStep(26, 'Lifecycle', 'Escalate privileges via engineering interface', 'Attacker escalates privileges using engineering service channels.', {
    inactiveWhen: [inactiveRule('as26-qa17-no', 'QA17', 'no', 'Debug/development interface not available (QA17 = No).')],
    proposedCountermeasureIds: ['CM21', 'CM22'],
  }),
  makeStep(27, 'Physical', 'Exploit public cable exposure for direct physical injection', 'Attacker manipulates publicly exposed cables to influence product behavior.', {
    inactiveWhen: [inactiveRule('as27-qa14-no', 'QA14', 'no', 'Product not installed in physically accessible location (QA14 = No).'), inactiveRule('as27-qa16-no', 'QA16', 'no', 'Public physical connection exposure absent (QA16 = No).')],
    proposedCountermeasureIds: ['CM20'],
  }),
  makeStep(28, 'Communication', 'Manipulate command channel timing or sequencing', 'Attacker manipulates timing/sequencing in communication channel to induce unsafe behavior.', {
    proposedCountermeasureIds: ['CM5'],
    linkedDamageScenarioHints: { sourceQuestionIds: ['QI10', 'QI14'], categories: ['I'], scenarioLabels: ['Manipulation safety impact (potential danger)'], notes: 'Sequencing manipulations mostly impact integrity/safety scenarios.' },
  }),
  makeStep(29, 'Communication', 'Exploit IP stack reachable protocol endpoint', 'Attacker exploits reachable protocol endpoint on IP/routable stack.', {
    inactiveWhen: [inactiveRule('as29-qa9-no', 'QA9', 'no', 'Routable/IP protocol stack unavailable (QA9 = No).')],
    proposedCountermeasureIds: ['C32'],
    proposedAssumptionIds: ['A22'],
  }),
  makeStep(30, 'Communication', 'Replay remote command transactions', 'Attacker replays remote command transactions to trigger unauthorized state transitions.', {
    proposedCountermeasureIds: ['CM5', 'CM6'],
    additionalAssumptionIds: ['A30'],
  }),
  makeStep(31, 'Connectivity', 'Pivot from gateway role to customer network attack', 'Attacker leverages gateway adjacency to move laterally into customer network assets.', {
    inactiveWhen: [inactiveRule('as31-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'), inactiveRule('as31-qa2-no', 'QA2', 'no', 'Gateway role not present (QA2 = No).')],
    linkedDamageScenarioHints: { sourceQuestionIds: ['QI15', 'QI8'], categories: ['I'], scenarioLabels: ['Customer asset/network access (critical disturbance)'], notes: 'Explicit gateway-to-customer-network linkage.' },
  }),
  makeStep(32, 'Communication', 'Abuse trust in remote backend messages', 'Attacker abuses weak trust model for backend-originated messages.', { preconditions: ['QA10b = yes'], proposedCountermeasureIds: ['CM23'] }),
  makeStep(33, 'Communication', 'Compromise third-party Internet external system channel', 'Attacker compromises Internet external system communication and injects malicious payload.', {
    inactiveWhen: [inactiveRule('as33-qa10b-no', 'QA10b', 'no', 'Internet external system communication absent (QA10b = No).')],
    proposedCountermeasureIds: ['CM23', 'CM24'],
  }),
  makeStep(34, 'Connectivity', 'Hijack remote cloud command/control session', 'Attacker hijacks cloud command/control sessions to issue unauthorized operations.', {
    inactiveWhen: [inactiveRule('as34-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'), inactiveRule('as34-qa10b-no', 'QA10b', 'no', 'Internet external system communication absent (QA10b = No).')],
    proposedCountermeasureIds: ['CM24'],
  }),
  makeStep(35, 'Connectivity', 'Manipulate cloud-synchronized configuration state', 'Attacker manipulates remotely synchronized configuration states.', {
    inactiveWhen: [inactiveRule('as35-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'), inactiveRule('as35-qa10b-no', 'QA10b', 'no', 'Internet external system communication absent (QA10b = No).')],
    proposedCountermeasureIds: ['CM24', 'CM12'],
  }),
  makeStep(36, 'Connectivity', 'Abuse remote telemetry channel for data exfiltration', 'Attacker abuses remote telemetry channel to exfiltrate product or environment data.', {
    inactiveWhen: [inactiveRule('as36-qa1-no', 'QA1', 'no', 'Connectivity is disabled (QA1 = No).'), inactiveRule('as36-qa10b-no', 'QA10b', 'no', 'Internet external system communication absent (QA10b = No).')],
    proposedCountermeasureIds: ['CM23'],
    linkedDamageScenarioHints: { sourceQuestionIds: ['QI1', 'QI2', 'QI3', 'QI11', 'QI12'], categories: ['C'], scenarioLabels: ['Personal data disclosure (significant)', 'OEM IP exposure (high innovation)'], notes: 'External exfiltration channels map to confidentiality scenarios.' },
  }),
  makeStep(37, 'Lifecycle', 'Compromise software in insecure production process', 'Attacker injects malicious software during insecure production/manufacturing lifecycle.', {
    inactiveWhen: [inactiveRule('as37-qa18-secure', 'QA18', ['internal-access-control', 'internal-it-requirements', 'internal-validated', 'certified-production', 'software-cicd-pipeline', 'software-internal-audit', 'software-iso-certified'], 'Secure production posture selected, reducing this path relevance (QA18).')],
    proposedCountermeasureIds: ['CM25'],
    qualityFlags: { ...inferredLiteralGap, unresolvedLinkingGap: true },
  }),
  makeStep(38, 'Supply Chain', 'Compromise software through untrusted supply chain partner', 'Attacker compromises supplier artifact or update package before OEM integration.', {
    inactiveWhen: [inactiveRule('as38-qa19-trusted', 'QA19', ['trusted-with-updates', 'trusted-no-updates'], 'Trusted supply-chain posture selected (QA19).')],
    proposedCountermeasureIds: ['CM26'],
    baseEase: { elapsedTime: 19, expertise: 8, knowledgeOfToe: 11, windowOfOpportunity: 10, equipment: 9 },
    qualityFlags: { ...inferredLiteralGap, unresolvedLinkingGap: true },
  }),
  makeStep(39, 'Lifecycle', 'Compromise maintenance process for malicious servicing', 'Attacker abuses maintenance/service lifecycle to introduce malicious changes.', {
    preconditions: ['QA11b = yes'],
    proposedCountermeasureIds: ['CM27'],
  }),
  makeStep(40, 'Lifecycle', 'Exploit absence of planned field update functionality', 'Attacker benefits from missing field-update capability that prevents remediation deployment.', {
    inactiveWhen: [{ id: 'as40-qa11b-not-no', reasonCode: 'QA11b-constraint', reasonText: 'AS40 is relevant only when field updates are not planned (QA11b = No).', when: { conditions: [{ questionId: 'QA11b', operator: 'notEqualsOrMissing', value: 'no' }] } }],
    proposedAssumptionIds: ['A38'],
    linkedDamageScenarioHints: { sourceQuestionIds: ['QI6', 'QI7', 'QI9', 'QI10', 'QI14', 'QI16'], categories: ['A', 'I', 'F'], scenarioLabels: ['Operating environment critical disturbance', 'Manipulated product contractual penalties (critical)'], notes: 'No-update condition increases persistence of safety/availability/financial impacts.' },
  }),
  makeStep(41, 'General', 'Combined multi-vector campaign against product ecosystem', 'Attacker chains several vectors across connectivity, lifecycle and physical channels.', {
    proposedCountermeasureIds: ['CM1', 'CM8', 'CM25'],
    proposedAssumptionIds: ['A45'],
    linkedDamageScenarioHints: { sourceQuestionIds: ['QI1', 'QI2', 'QI6', 'QI7', 'QI10', 'QI14', 'QI16'], categories: ['C', 'I', 'A', 'F'], scenarioLabels: ['Critical environmental damage from availability impact', 'Manipulation safety impact (life-threatening)'], notes: 'Composite step, broad impact envelope.' },
  }),
];
