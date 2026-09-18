// Example questions for each curated theme (app/data/themes.ts), keyed by exact theme title. They are
// embedded with the index, and a theme scores the best of its own text and these, so a reworded question
// can still reach it. Written after scripts/ask-routing-eval.json; never copy eval questions here.
// `npm run build:semantic` fails if a theme has fewer than 3 or an entry names no theme.
export const THEME_EXAMPLES: Record<string, string[]> = {
  'One chip, fifteen products': [
    'How are all the DeepGrid products related?',
    'What is the product portfolio?',
    'How can one chip become so many products?',
    'What range of prices does the platform cover?',
    'Which buyers does each product line reach?',
  ],
  'SoC2: six chiplets on one 57 mm² die': [
    'Explain the chip design',
    'What are the compute domains on the SoC?',
    'What process node is the chip built on?',
    'How big is the die?',
    'What is the architecture of the DeepGrid silicon?',
  ],
  'The demand is legislated, not forecast': [
    'Which Indian regulations require ADAS on commercial vehicles?',
    'When do the AEBS rules come into force?',
    'Why now for this company?',
    'Is demand driven by regulation?',
    'Which standards create the need for these systems?',
  ],
  'What is already built': [
    'What has the team shipped so far?',
    'Does the perception stack already run on hardware?',
    'Has the chip been taped out?',
    'What revenue exists before the ASIC?',
    'What stage is the technology at?',
  ],
  'The strategic choice: run A for B': [
    'What are the strategic options for the company?',
    'Should DeepGrid lead with government buyers or Tier-1 suppliers?',
    'What is the recommended path to market?',
    'How does the company survive until volume silicon?',
    'Why not just sprint to the tapeout?',
  ],
  'The round and what it funds': [
    'How much money is being raised?',
    'What is the pre-money valuation?',
    'What is the use of proceeds?',
    'What will the capital not be spent on?',
    'How is the investment released against milestones?',
  ],
  'The investment risks': [
    'What are the key risks?',
    'What should diligence test?',
    'Which assumptions does the plan depend on?',
    'What are the red flags in the materials?',
    'Where are the numbers inconsistent?',
  ],
  'The revenue ramp': [
    'What is the FY2032 revenue plan?',
    'How does revenue grow over time?',
    'When does the company break even?',
    'Which products drive revenue?',
    'What are the financial projections?',
  ],
  'The company and its founders': [
    'Who are the founders?',
    'Tell me about the leadership team',
    'Who leads silicon architecture?',
    'Where is the company based and how many people work there?',
    'What experience does the management have?',
  ],
};
