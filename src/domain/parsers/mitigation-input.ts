import { RapLevel } from '../enums';
import type {
  MitigationParseError,
  MitigationParsedItem,
  MitigationParsedAssumption,
  MitigationParsedCountermeasure,
} from '../types';

const RAP_LEVEL_MAP: Record<string, RapLevel> = {
  basic: RapLevel.Basic,
  'enhanced-basic': RapLevel.EnhancedBasic,
  moderate: RapLevel.Moderate,
  high: RapLevel.High,
  'beyond high': RapLevel.BeyondHigh,
  'beyond-high': RapLevel.BeyondHigh,
};

export type MitigationParseOutput = {
  parsedItems: MitigationParsedItem[];
  parseErrors: MitigationParseError[];
  normalizedIds: string[];
};

function parseOne(rawItem: string, index: number): { item?: MitigationParsedItem; error?: MitigationParseError } {
  const trimmed = rawItem.trim();
  const match = trimmed.match(/^\{\s*([A-Za-z0-9]+)\s*(?::\s*([^}]+)\s*)?\}$/);

  if (!match) {
    return { error: { raw: rawItem, message: 'Malformed item syntax', index } };
  }

  const id = match[1].toUpperCase();
  const forcedRaw = match[2]?.trim();

  if (id.startsWith('A')) {
    const item: MitigationParsedAssumption = { kind: 'assumption', id, raw: trimmed };
    return { item };
  }

  if (id.startsWith('CM') || id.startsWith('C')) {
    let forcedMinimumRap: RapLevel | undefined;
    if (forcedRaw) {
      const mapped = RAP_LEVEL_MAP[forcedRaw.toLowerCase()];
      if (!mapped) {
        return { error: { raw: rawItem, message: `Invalid forced RAP level: ${forcedRaw}`, index } };
      }
      forcedMinimumRap = mapped;
    }

    const item: MitigationParsedCountermeasure = { kind: 'countermeasure', id, forcedMinimumRap, raw: trimmed };
    return { item };
  }

  return { error: { raw: rawItem, message: `Unsupported ID prefix: ${id}`, index } };
}

export function parseMitigationInput(rawInput: string): MitigationParseOutput {
  if (!rawInput.trim()) {
    return { parsedItems: [], parseErrors: [], normalizedIds: [] };
  }

  const chunks = rawInput
    .split(',')
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const parsedItems: MitigationParsedItem[] = [];
  const parseErrors: MitigationParseError[] = [];

  chunks.forEach((chunk, index) => {
    const result = parseOne(chunk, index);
    if (result.item) {
      parsedItems.push(result.item);
    }
    if (result.error) {
      parseErrors.push(result.error);
    }
  });

  return {
    parsedItems,
    parseErrors,
    normalizedIds: parsedItems.map((item) => item.id),
  };
}
