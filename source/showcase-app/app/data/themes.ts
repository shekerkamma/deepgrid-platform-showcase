// Curated answers for the questions Ask DeepGrid is asked most. A theme writes no copy of its own: it
// names the memorandum sections, slides and products that answer the question, and the engine quotes
// them from the GraphRAG index. Editing report-content.ts, slide-notes.json or products.json therefore
// changes the answer, and a renamed heading fails `npm run build:semantic` instead of going quiet.
//
// Routing: a keyword in the question selects a theme; failing that, the in-browser embedding of the
// question must be close to the theme (its title, lead and example questions in theme-examples.ts) and
// clearly closer than the runner-up. Both thresholds come from scripts/ask-routing-eval.json.

export interface Theme {
  title: string;
  tag: string;
  /** a canonical question: the prompt chip and the related-question link */
  ask: string;
  keywords: string[];
  /** memorandum section headings, matched from the start of the heading; the first one leads the answer */
  sections: string[];
  slides: number[];
  products: string[];
  /** a label in the knowledge graph to centre on */
  focus: string;
}

export const themes: Theme[] = [
  {
    title: 'One chip, fifteen products',
    tag: 'PORTFOLIO',
    ask: 'How do the fifteen products fit together?',
    keywords: ['fifteen products', '15 products', 'fit together', 'product lines', 'one chip', 'one die', 'whole portfolio', 'all the products'],
    sections: ['One die, fifteen products', '₹50,000 to ₹4 lakh, one common platform', 'Six buyer routes off one bill of materials'],
    slides: [1, 97],
    products: ['ad2', 'ad0', 'a100-4', 'dhumr'],
    focus: 'SoC2',
  },
  {
    title: 'SoC2: six chiplets on one 57 mm² die',
    tag: 'SILICON ARCHITECTURE',
    ask: 'What is the 28nm silicon architecture?',
    keywords: ['silicon architecture', '28nm', '28 nm', 'chiplet', 'soc2', '57 mm', '57mm', 'die', 'compute domain'],
    sections: ['Six chiplets, one 57', 'Two retrofit mirror towers'],
    slides: [31],
    products: ['chipset', 't100', 'd100'],
    focus: 'SoC2',
  },
  {
    title: 'The demand is legislated, not forecast',
    tag: 'WHY NOW · REGULATION',
    ask: 'Why is the demand real?',
    keywords: ['mandate', 'legislat', 'regulation', 'ais-162', 'cmvr', 'law', 'regulator', 'deadline'],
    sections: ['The demand is legislated, not forecast'],
    slides: [7],
    products: ['ad2', 'ad0', 'h100'],
    focus: 'Indian ADAS Mandates (AIS Standards)',
  },
  {
    title: 'What is already built',
    tag: 'TRACTION · PROOF',
    ask: 'What has DeepGrid already built?',
    keywords: ['already built', 'already done', 'traction', 'fpga', 'tapeout', 'taped out', 'prototype', 'validated', 'proof'],
    sections: ['Concept through validated silicon', 'The option the business buys you'],
    slides: [24],
    products: ['ad2', 'dhumr'],
    focus: 'SoC1.2 FPGA Prototype',
  },
  {
    title: 'The strategic choice: run A for B',
    tag: 'STRATEGY',
    ask: 'What is the recommended strategy?',
    keywords: ['strategy', 'strategic', 'recommend', 'tier-1', 'government wedge', 'psu', 'option a', 'licence-first', 'defence-first', 'silicon sprint'],
    sections: ['The company has a mandate it cannot yet serve', 'Run A for B, not A then B', 'Four questions that would change this recommendation'],
    slides: [],
    products: ['t100', 'dhumr'],
    focus: 'Option A: Government and PSU Wedge',
  },
  {
    title: 'The round and what it funds',
    tag: 'THE RAISE',
    ask: 'How much is DeepGrid raising, and what does it fund?',
    keywords: ['raise', 'raising', 'round', 'use of funds', 'funding', 'pre-money', 'valuation', 'equity', 'capital', '₹45', 'term sheet', 'do not fund'],
    sections: ['Released against silicon, not against the forecast', 'The round clears self-funding', 'Do not fund', 'Proceed'],
    slides: [],
    products: [],
    focus: 'Capital Release & Phased Sequence',
  },
  {
    title: 'The investment risks',
    tag: 'RISK & DILIGENCE',
    ask: 'What are the investment risks?',
    keywords: ['risk', 'risks', 'diligence', 'assumption', 'underwrit', 'what could go wrong', 'concern', 'red flag', 'disagree'],
    sections: ['Ten things to test', 'Four load-bearing assumptions', 'The scenario set tests the wrong variable'],
    slides: [],
    products: ['ad2', 'ad0'],
    focus: 'Staged Proving Ladder',
  },
  {
    title: 'The revenue ramp',
    tag: 'FINANCIALS',
    ask: 'How does revenue grow to FY2032?',
    keywords: ['revenue', 'ramp', 'fy2032', 'forecast', 'projection', 'ebitda', 'margin', 'break even', 'breakeven', '1,128'],
    sections: ['The ramp is gated by the chip'],
    slides: [97],
    products: ['ad2', 'ad0', 'a100-4'],
    focus: 'Four-Stage Tapeout NRE Structure',
  },
  {
    title: 'The company and its founders',
    tag: 'THE TEAM',
    ask: 'Who runs DeepGrid?',
    keywords: ['founder', 'founders', 'team', 'who runs', 'aravind', 'ayaz', 'leadership', 'ceo', 'management'],
    sections: ['An autonomous systems company that builds its own silicon', 'A commercial founder and a standing silicon architect'],
    slides: [],
    products: [],
    focus: 'Aravind Prasad G',
  },
];
