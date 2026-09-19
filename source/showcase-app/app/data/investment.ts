// Figures for the Investment view, read from the two published workbooks (public/downloads/showcase):
//   FM  = deepgrid-financial-model-v3-sept-2026.xlsx  (sheets: Use of Funds, Revenue Build, P&L, Cash Flow & Runway)
//   BP  = deepgrid-business-plan-v2.xlsx              (sheet: P&L)
// Milestones: Information Memorandum, June 2026, section 12 "18-month milestones post-raise".
// The two workbooks disagree on FY2032 revenue. Both are shown, each named; neither is picked.

export const round = {
  equity: 45,
  preMoney: 204,
  stake: '18.07%',
  debt: 10,
  total: 55,
};

// FM, Use of Funds (identical in BP). ₹ Cr of ₹55 Cr total.
export const useOfFunds = [
  {
    label: 'SoC2 tapeout NRE and IP',
    cr: 29.8,
    note: 'Equity. Phased: shared MPW blocks, full-die MPW, dedicated mask',
  },
  {
    label: 'Engineering',
    cr: 9.02,
    note: 'Equity. Chip, firmware and defence, about 18 months',
  },
  {
    label: 'AIS-162/188 certification and FPGA pilot',
    cr: 4.51,
    note: 'Equity. ARAI / ICAT and 100 pilot units',
  },
  {
    label: 'Working capital, BD and inventory',
    cr: 11.66,
    note: 'The ₹10 Cr CGTMSE loan plus the equity remainder',
  },
];

export const years = [
  'FY2027',
  'FY2028',
  'FY2029',
  'FY2030',
  'FY2031',
  'FY2032',
];
// ₹ Cr. FM Revenue Build "Total"; BP P&L "Revenue".
export const revenue = {
  fm: [1.7, 27.82, 115.38, 284.66, 594.3, 1128.45],
  bp: [6.0, 41.17, 144.73, 351.36, 731.55, 1387.95],
};
// FM P&L and Cash Flow & Runway, ₹ Cr.
export const ebitda = [-0.4, 2.25, 21.61, 68.87, 174.13, 387.88];
export const closingCash = [25.28, 11.35, 10.1, 32.53, 111.16, 313.58];

export const milestones = [
  {
    when: 'Months 1–3',
    title: 'MPW submission and FPGA pilot',
    items: [
      'GDS delivered to Muse / GSME, MPW phase 1 submitted',
      'FPGA firmware for the 100-unit pilot complete',
      'AD2 smart-truck fleet pilot launched',
    ],
  },
  {
    when: 'Months 3–6',
    title: 'First commercial revenue',
    items: [
      'AD2 fleet pilots earning revenue',
      'MCEME ₹88 L defence order in execution',
      'AIS-162 / AIS-188 submitted to ARAI / ICAT',
    ],
  },
  {
    when: 'Months 6–12',
    title: 'Silicon returns',
    items: [
      'TSMC 28 nm first silicon, bring-up begins',
      'OEM evaluation samples to Tata and Mahindra',
      'iDEX / DRDO engagement for the D100 programme',
    ],
  },
  {
    when: 'Months 12–18',
    title: 'ASIC revenue and Series A',
    items: [
      'Revenue from ASIC-based products begins',
      'First paying customers for the T100 AI licence',
      'Series A raise opened',
    ],
  },
];

export const risks = [
  {
    title: 'Concentration',
    text: 'AD2 and AD0 carry ₹720 Cr, 63.8% of FY2032 plan revenue, and sell to overlapping buyers.',
  },
  {
    title: 'Timing',
    text: 'Qualified silicon is planned for H1 2028. Until then the plan rests on the FPGA product and its channels.',
  },
  {
    title: 'Figures that disagree',
    text: 'FY2032 revenue is ₹1,128 Cr in the financial model and ₹1,388 Cr in the business plan. Tapeout cost and AD0 demand also differ between documents.',
  },
  {
    title: 'Qualification',
    text: 'Type approval, functional safety, OEM design-in time and installation capacity remain open dependencies.',
  },
];

export const documents = [
  [
    'deepgrid-information-memorandum-v2-aug-2026.pdf',
    'Information Memorandum v2',
    'Aug 2026',
    'PDF',
    '1.6 MB',
  ],
  [
    'deepgrid-information-memorandum-june-2026.pdf',
    'Information Memorandum',
    'Jun 2026',
    'PDF',
    '17 MB',
  ],
  [
    'deepgrid-investor-briefing-jul-2026.pdf',
    'Investor briefing',
    'Jul 2026',
    'PDF',
    '23 MB',
  ],
  [
    'deepgrid-financial-model-v3-sept-2026.xlsx',
    'Financial model v3',
    'Sep 2026',
    'Workbook',
    '32 KB',
  ],
  [
    'deepgrid-business-plan-v2.xlsx',
    'Business plan v2',
    '2026',
    'Workbook',
    '39 KB',
  ],
  [
    'deepgrid-bp1a-india-autonomous-trucking-plan.pdf',
    'BP1A: India autonomous trucking',
    '2026',
    'PDF',
    '415 KB',
  ],
  [
    'deepgrid-bp1b-usa-proposal.pdf',
    'BP1B: United States proposal',
    '2026',
    'PDF',
    '176 KB',
  ],
  [
    'deepgrid-icp-and-gtm-strategy-jul-2026.docx',
    'Customer profile and go-to-market',
    'Jul 2026',
    'Document',
    '3.2 MB',
  ],
  [
    'deepgrid-brief-shravan-mayookh.pdf',
    'Company brief',
    '2026',
    'PDF',
    '2.9 MB',
  ],
  [
    'deepgrid-product-portfolio-104-slides.pptx',
    'Product portfolio, 104 slides',
    '2026',
    'Deck',
    '56 MB',
  ],
] as const;
