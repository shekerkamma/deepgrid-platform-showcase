// Content for the Overview chapters. Every date and figure is from a source document, named beside it.
// Regulatory dates: G.S.R. 834(E) of 11 Nov 2025 as amended by G.S.R. 862(E), gazetted 21 Nov 2025
// (knowledge/sources/markdown/gsr-834-862-gazette.md, the notified text, not trade press).
// Company dates and figures: the June 2026 Information Memorandum, section 8 "Proof of execution"
// and section 12 "Transaction structure", and the financial model's use of funds.

export const lawRows = [
  {
    system: 'Emergency braking and stability',
    short: 'AEBS + VSF',
    standard: 'AIS-162',
    newModels: '1 Jan 2027',
    allModels: '1 Oct 2027',
  },
  {
    system: 'Lane departure warning',
    short: 'LDWS',
    standard: 'AIS-188',
    newModels: '1 Oct 2027',
    allModels: '1 Jan 2028',
  },
  {
    system: 'Driver drowsiness and attention warning',
    short: 'DDAWS',
    standard: 'AIS-184',
    newModels: '1 Oct 2027',
    allModels: '1 Jan 2028',
  },
  {
    system: 'Blind spot information',
    short: 'BSIS',
    standard: 'AIS-186',
    newModels: '1 Oct 2027',
    allModels: '1 Jan 2028',
  },
  {
    system: 'Moving-off information',
    short: 'MOIS',
    standard: 'AIS-187',
    newModels: '1 Oct 2027',
    allModels: '1 Jan 2028',
  },
];

// Months are counted from November 2025 (0). `at` places the event on the shared axis; `when` is
// the date as the source states it, so a quarter stays a quarter.
export const clockStart = { year: 2025, month: 11 };
export const clockEnd = 32; // July 2028
export const month = (y: number, m: number) =>
  (y - clockStart.year) * 12 + (m - clockStart.month);

export const lawEvents = [
  {
    at: month(2025, 11),
    when: 'Nov 2025',
    what: 'Rules notified in the Gazette',
  },
  {
    at: month(2027, 1),
    when: '1 Jan 2027',
    what: 'Emergency braking on new truck and bus models',
  },
  {
    at: month(2027, 10),
    when: '1 Oct 2027',
    what: 'Braking on every model. Warnings on new models',
  },
  {
    at: month(2028, 1),
    when: '1 Jan 2028',
    what: 'All four warning systems on every model',
  },
];

export const siliconEvents = [
  {
    at: month(2026, 2),
    when: 'Q1 2026',
    what: 'FPGA validated at 40 fps. First defence revenue',
  },
  {
    at: month(2026, 8),
    when: 'Q3 2026',
    what: 'FPGA kit ships. 100-unit fleet pilot',
  },
  {
    at: month(2026, 11),
    when: 'Q4 2026',
    what: 'First 28 nm silicon from TSMC',
  },
  {
    at: month(2028, 4),
    when: 'H1 2028',
    what: 'Qualified silicon',
  },
];

// The gap runs from the first compliance date to qualified silicon; the bridge is the FPGA product,
// shipping from Q3 2026, which the strategy memo calls "run A for B".
export const gap = { from: month(2027, 1), to: month(2028, 4) };
export const bridgeFrom = month(2026, 8);

export const proof = [
  {
    figure: '40',
    unit: 'fps',
    label: 'YOLOv11n on an Artix-7 FPGA, 24.8 ms latency',
    note: 'Measured on hardware, not simulated',
  },
  {
    figure: '15',
    unit: 'patents',
    label: 'Provisional filings, March 2026',
    note: 'Batch-dispatch firmware, 12-bit radar, health processor',
  },
  {
    figure: '130',
    unit: 'nm',
    label: 'Earlier tapeout completed at SkyWater',
    note: 'Six RTL designs now tapeout-ready for 28 nm',
  },
  {
    figure: '96.7',
    unit: '%',
    label: 'Predicted yield on the contracted 28 nm shuttle',
    note: 'Muse / GSME multi-project wafer, 79-day fab cycle',
  },
];

// Evidence plates for "It already runs": frames from DeepGrid's own demonstrator films and the
// DG32 tape-in record. The films are software simulations and are labelled so; DG32 is a design
// record, not a measurement of silicon.
export const proofPlates = [
  {
    img: 'ddrive',
    title: 'D-Drive perception',
    note: 'Camera, radar and LiDAR fused on a market street. Software demonstrator.',
    href: 'film?v=ddrive',
    alt: 'Frame from the D-Drive demonstrator: a car on a road with its planner view and perception panel',
  },
  {
    img: 'sentinel',
    title: 'Sentinel threat fusion',
    note: 'Tracks correlated along a perimeter fence. Software demonstrator.',
    href: 'film?v=sentinel',
    alt: 'Frame from the Sentinel demonstrator: a perimeter map with sensor coverage cones and active tracks',
  },
  {
    img: 'forklift',
    title: 'Warehouse autonomy',
    note: 'LiDAR and camera guiding a forklift down a rack aisle. Software demonstrator.',
    href: 'film?v=forklift',
    alt: 'Frame from the forklift demonstrator: an autonomous forklift in a warehouse aisle with a LiDAR overlay',
  },
  {
    img: 'dg32-tapein',
    title: 'DG32-LITE at 130\u00a0nm',
    note: 'Separate DG32 programme. Tape-in design record, not evidence of fabricated SoC2 silicon.',
    href: 'https://shekerkamma.github.io/deepgrid-dr-silicon/',
    alt: 'DG32-LITE tape-in block diagram: a QFN-64 package outline with a 2.9 by 4.5 mm core block, 44 pads and 18 blocks on the bus',
  },
] as const;
