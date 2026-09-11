// Single source of truth — the same JSON artifacts that power the published
// dossier. Nothing re-typed by hand; every value comes from the run JSONs.
import profRaw from './data/company-profiles.json';
import scoringRaw from './data/scoring.json';
import stratRaw from './data/strategy-sections.json';
import narRaw from './data/narrative.json';
import useCasesRaw from './data/use-cases.json';

export type Tier = 'P-ACT' | 'P-WARN' | 'P-ADJ';

export interface Company {
  id: string;
  name: string;
  tier: Tier;
  sells: string;
  value: string;
  posture: string;
  evidence: string;
  read: string;
  ai: [string, string][];
  detail: [string, string][];
  gaps: string[];
}

export interface Competitor {
  id: string;
  name: string;
  execution: number;
  access: number;
  leverage: number;
  score: number;
  tier: Tier;
  ev: string;
  arenas: Record<string, [string, string]>;
}

export const companies = (profRaw as any).companies as Company[];
export const competitors = (scoringRaw as any).competitors as Competitor[];
export const weights = (scoringRaw as any).weights as {
  execution: number;
  access: number;
  leverage: number;
};

export const silicon = (stratRaw as any).silicon as {
  sowhat: string;
  rows: [string, string, string, string, string][];
};

export const universe = (stratRaw as any).universe as {
  xlab: string;
  ylab: string;
  zones: [string, string, number, number, string][];
  players: [string, number, number, string, string][];
};

export const pyramid = (narRaw as any).pyramid as {
  governing_thought: string;
  supports: { claim: string; because: string; proof: string }[];
};
export const coreMessage = (narRaw as any).core_message as string;
export const scqa = (narRaw as any).scqa as {
  situation: string;
  complication: string;
  question: string;
  answer: string;
};

export const ARENAS = ['Government / PSU', 'OEM / Tier-1', 'Fleet / mining'] as const;
export const TIER_COLOR: Record<Tier, string> = {
  'P-ACT': '#E06767',
  'P-WARN': '#D7720B',
  'P-ADJ': '#04B3C7',
};
export const TIER_LABEL: Record<Tier, string> = {
  'P-ACT': 'Reaches brake actuation',
  'P-WARN': 'Warning only',
  'P-ADJ': 'Adjacent',
};

// ── DeepGrid's own product use cases (UC-01 … UC-06) ────────────────────────
export interface UseCase {
  id: string;
  short: string;
  arena: string;
  standard: string;
  rule: string;
  dates: string;
  title: string;
  challenge: string;
  solution: string;
  how: string[];
  stats: [string, string, string][];
  stack: string;
  systems: string;
  users: string;
  orgs: string;
  risks: string;
  evidence: string[];
  gate: string;
}
export const useCaseData = useCasesRaw as unknown as {
  subject: string;
  lens: string;
  bounding_statement: string;
  do_not_fund: string;
  sequencing: [string, string, string][];
  use_cases: UseCase[];
};
