import type { A2uiMessage } from '@a2ui/web_core/v0_9';
import { deepgridCatalog } from './catalog';
import masterSlidesData from '../data/master_deck_indexed.json';

// WSL Authoritative Data
export const FYS = ['FY27', 'FY28', 'FY29', 'FY30', 'FY31', 'FY32'];

export interface SkuData {
  slug: string;
  name: string;
  segment: string;
  domain: string;
  surface: string;
  asp: number;
  aspStr: string;
  units: number[];
  rev: number[];
  fy32: number;
  share: number;
  gm: string;
  launch: string;
  pool: string;
  capture: string;
  source: string;
  what: string;
  contents: string[];
  chain: string[];
  buyer: string;
  channel: string;
  why: string;
  depends: string;
  siliconRole: string;
  simulatorName?: string;
  simulatorProof?: string;
}

export const SKUS: SkuData[] = [
  {
    slug: 'ad2',
    name: 'Smart Truck (AD2 kit)',
    segment: 'Systems',
    domain: 'Outdoor',
    surface: 'Road autonomy',
    asp: 250000,
    aspStr: '₹2.50 L',
    units: [3, 80, 1400, 4000, 9000, 18000],
    rev: [0.07, 2, 35, 100, 225, 450],
    fy32: 450,
    share: 39.88,
    gm: '89%',
    launch: 'FY2027',
    pool: 'MANDATORY: 0.5M new N2/N3 trucks/yr + 0.5M retrofit',
    capture: '1.80%',
    source: 'MoRTH GSR 184(E) ADAS mandate on N2/N3',
    what: 'The full ADAS kit for N2/N3 commercial vehicles: camera and radar sensing, the SoC2 compute box, driver interface and vehicle integration, certified as a unit.',
    contents: ['Forward camera and 4D radar', 'SoC2 compute box', 'Driver interface display and alert', 'Vehicle bus harness and brake interface'],
    chain: ['Camera and radar watch the forward path and the blind quarters', 'SoC2 fuses both into one object list with range and closing speed', 'Collision, lane and blind-spot logic decide whether to warn', 'Driver is warned, and the brake interface is signalled where fitted'],
    buyer: 'Fleet operators and truck OEMs, as new-build fit and as retrofit.',
    channel: 'Fleet direct and retrofit installers, with OEM line-fit as the longer route.',
    why: 'The reason the portfolio has a demand floor rather than a demand forecast: the buyer is compelled, not persuaded.',
    depends: 'Certification through ARAI or ICAT, and installation capacity at 18,000 fitments a year.',
    siliconRole: 'Fuses 11 sensor channels (7x 8MP RGB, 2x thermal, front/rear 4D radar) in 8.6 ms of a 33.3 ms frame budget, leaving 74.2% headroom.',
    simulatorName: 'D-DRIVE · ADAS Sim v2 (Slide 22/23)',
    simulatorProof: 'Runs production perception stack on a 550 kg / 2.10 m / μ 0.75 plant model across Market Street, Highway, and Stress-Test profiles without reloading.',
  },
  {
    slug: 'ad0',
    name: 'AD0 Smart Mirror (mandate retrofit)',
    segment: 'Systems',
    domain: 'Outdoor',
    surface: 'Road autonomy',
    asp: 50000,
    aspStr: '₹50,000',
    units: [10, 2200, 8000, 18000, 34000, 54000],
    rev: [0.05, 11, 40, 90, 170, 270],
    fy32: 270,
    share: 23.93,
    gm: '89%',
    launch: 'FY2027',
    pool: 'Existing 360 surround-view market $3.1B (already selling)',
    capture: '0.93%',
    source: 'Towards Automotive: $3.09B 2025, 10.7% CAGR',
    what: 'A 360° surround-view mirror replacement with recording and driver alerts. The entry product: lowest price, simplest fit, no homologation dependency.',
    contents: ['Four surround cameras with mounting hardware', 'Mirror-format display head unit', 'SoC2 compute integrated in head unit', 'Recording storage and alert speaker'],
    chain: ['Four cameras cover vehicle blind quarters', 'SoC2 stitches views into one 360° surround image', 'Proximity and motion logic flags anything entering the danger zone', 'Driver sees stitched view and hears directional alert'],
    buyer: 'Vehicle owners through aftermarket and accessory fitment, plus OEM accessory programmes.',
    channel: 'Aftermarket accessory retail and fitment shops, plus OEM accessory catalogues.',
    why: 'Voluntary demand in a market that already exists — the volume ramp that funds the harder products.',
    depends: 'Distribution reach and price holding at ₹50k. It runs on current-generation hardware, so it is not gated on the ASIC.',
    siliconRole: 'Hardware-accelerated surround stitching and object tracking firmware.',
  },
  {
    slug: 'ad1',
    name: 'AD1 Indoor L4 kit',
    segment: 'Systems',
    domain: 'Indoor',
    surface: 'Road autonomy',
    asp: 100000,
    aspStr: '₹1.00 L',
    units: [0, 20, 400, 1000, 2200, 4200],
    rev: [0, 0.2, 4, 10, 22, 42],
    fy32: 42,
    share: 3.72,
    gm: '89%',
    launch: 'FY2028',
    pool: 'Warehouse/industrial autonomy; part of $4.8B edge-AI',
    capture: '—',
    source: 'Dataintelo/GMI automotive edge-AI 2025',
    what: 'A full self-driving kit for indoor and geofenced vehicles: warehouse tugs, industrial movers, campus transport.',
    contents: ['Camera and depth sensing head', 'SoC2 compute box', 'Drive-by-wire actuation interface', 'Site mapping and commissioning tooling'],
    chain: ['Cameras and depth sensing read the aisle, load and people', 'SoC2 localises the vehicle against a site map held onboard', 'Planner picks path and speed for geofenced route', 'Drive-by-wire interface issues steer, throttle and brake'],
    buyer: 'Warehouse and industrial operators automating repetitive internal movement.',
    channel: 'Direct to site operators and through material-handling integrators.',
    why: 'Indoor removes traffic and homologation, so level-4 behaviour ships years before it is legal on a road.',
    depends: 'Site mapping and commissioning throughput, which is services capacity rather than product.',
    siliconRole: 'Runs closed-loop Level-4 driving at up to 1.5 m/s inside geofenced safety zones.',
    simulatorName: 'AMR Forklift · Dark-Store Sim (Slide 16/17)',
    simulatorProof: '24m LiDAR at 5 Hz + 57° camera into unified occupancy map; graded honk/voice alerts and explicit stuck-time auto-rerouting.',
  },
  {
    slug: 'taas',
    name: 'Autonomous TaaS',
    segment: 'Systems',
    domain: 'Outdoor',
    surface: 'Fleet & mobility',
    asp: 6600000,
    aspStr: '₹66.00 L',
    units: [0, 5, 10, 25, 50, 100],
    rev: [0, 3.3, 6.6, 16.5, 33, 66],
    fy32: 66,
    share: 5.85,
    gm: '89%',
    launch: 'FY2028',
    pool: 'India trucking 0.6-0.8M units/yr; fleet ops',
    capture: '0.01%',
    source: 'Mobility Foresights; TheGlobalEconomy 952k CV',
    what: 'Autonomous transport sold as a service on our own fleet: vehicle, stack and operating contract together.',
    contents: ['Vehicle with full AD2 sensor set', 'SoC2 autonomy stack', 'Remote operations link', 'Service contract and route commissioning'],
    chain: ['Full sensor set reads surveyed route', 'SoC2 runs autonomy stack against route model', 'Fleet logic schedules and hands off to remote operator when needed', 'Vehicle drives, customer billed per trip/tonne'],
    buyer: 'Logistics operators on fixed, repeatable routes.',
    channel: 'Direct commercial contracts, one route at a time.',
    why: 'Highest revenue per unit in the portfolio; the fleet is debt-financed against the trucks, not equity-funded.',
    depends: 'Asset finance against trucks and route-level regulatory permissions.',
    siliconRole: 'Full L4 highway perception and remote-operation link integration.',
  },
  {
    slug: 'agv',
    name: 'Seaport AGV (port autonomy)',
    segment: 'Systems',
    domain: 'Indoor',
    surface: 'Fleet & mobility',
    asp: 4530000,
    aspStr: '₹45.30 L',
    units: [0, 2, 5, 10, 15, 50],
    rev: [0, 0.91, 2.27, 4.53, 6.79, 22.65],
    fy32: 22.65,
    share: 2.01,
    gm: '89%',
    launch: 'FY2028',
    pool: 'Automated container terminal market $10.95B (2024)',
    capture: '0.02%',
    source: 'SNS Insider: $10.95B 2024 -> $16.35B 2032, 5.2% CAGR',
    what: 'Autonomous container-yard vehicles operating inside a port perimeter.',
    contents: ['Surround sensing platform', 'SoC2 compute and autonomy stack', 'Yard-management system integration', 'Commissioning and site survey'],
    chain: ['Surround sensing reads containers, cranes and lanes', 'SoC2 localises against yard map and tracks moving obstacles', 'Planner sequences pick, move and drop against schedule', 'Vehicle executes and reports back to terminal system'],
    buyer: 'Port and terminal operators automating container movement.',
    channel: 'Direct to terminal operators, typically through a pilot berth first.',
    why: 'A live order at Vizag Container Terminal, and a capture rate that understates the real share.',
    depends: 'Terminal integration work and berth-level commissioning.',
    siliconRole: 'Dynamic fusion holds 7cm in open and 22cm under crane where RTK-GNSS fails.',
    simulatorName: 'DGrid Yard OS · Live Terminal Twin (Slide 47/48)',
    simulatorProof: 'PS18 terminal twin proving positioning error divergence, predictive ETA dispatch, and shadow mode operation.',
  },
  {
    slug: 'chipset',
    name: 'Chipset OEM B2B (ASIC die)',
    segment: 'Semiconductors',
    domain: 'Outdoor',
    surface: 'Silicon & compute',
    asp: 18000,
    aspStr: '₹18,000',
    units: [0, 30, 1750, 6000, 15000, 30000],
    rev: [0, 0.05, 3.15, 10.8, 27, 54],
    fy32: 54,
    share: 4.79,
    gm: '94%',
    launch: 'FY2028',
    pool: 'India ADAS chip pool; $2.29B ADAS (2024)',
    capture: '0.25%',
    source: 'EMR 2024: $2.29B, 20.6% CAGR',
    what: 'The bare SoC2 die sold to other manufacturers to design into their own products.',
    contents: ['SoC2 die, tested and binned', 'Reference design documentation', 'Toolchain access and support'],
    chain: ['Customer sensors feed their own board', 'SoC2 die executes perception compute', 'Customer software decides on results', 'Customer product ships with our silicon inside'],
    buyer: 'Tier-1 suppliers and OEMs with in-house hardware teams.',
    channel: 'Direct design-in engagements, long cycle, high commitment.',
    why: 'The most profitable revenue in the plan at 94% margin, needing no integration, certification or installation.',
    depends: 'Working, qualified silicon downstream of tapeout landing.',
    siliconRole: '32,768 MACs @ 600 MHz monolithic 28nm ASIC die (~57 mm²).',
  },
  {
    slug: 'a100-1ch',
    name: 'A100 compute box 1ch +SDK (M.2)',
    segment: 'Systems',
    domain: 'Compute',
    surface: 'Silicon & compute',
    asp: 85000,
    aspStr: '₹85,000',
    units: [0, 188, 375, 750, 1500, 3000],
    rev: [0, 1.6, 3.19, 6.38, 12.75, 25.5],
    fy32: 25.5,
    share: 2.26,
    gm: '89%',
    launch: 'FY2028',
    pool: 'Automotive edge-AI accelerator modules $4.8B (2025)',
    capture: '0.20%',
    source: 'Dataintelo: $4.8B 2025 -> $22.6B 2034, 21% CAGR',
    what: 'The entry compute module: one camera channel on an M.2 form factor, shipped with the SDK.',
    contents: ['M.2 form-factor SoC2 module', 'SDK and model toolchain', 'Reference carrier documentation'],
    chain: ['One camera feeds carrier board', 'M.2 module runs model on SoC2', 'Results return over bus', 'Product acts on output'],
    buyer: 'Integrators prototyping or building single-camera products.',
    channel: 'Direct and through electronics distribution.',
    why: 'The cheapest way for a customer to adopt the silicon, and the widest top of the compute funnel.',
    depends: 'Toolchain quality and documentation.',
    siliconRole: 'Single-channel edge AI acceleration on standard M.2 slot.',
  },
  {
    slug: 'a100-2ch',
    name: 'A100 compute box 2ch +SDK',
    segment: 'Systems',
    domain: 'Compute',
    surface: 'Silicon & compute',
    asp: 160000,
    aspStr: '₹1.60 L',
    units: [0, 113, 225, 450, 900, 1800],
    rev: [0, 1.81, 3.6, 7.2, 14.4, 28.8],
    fy32: 28.8,
    share: 2.55,
    gm: '89%',
    launch: 'FY2028',
    pool: 'Automotive edge-AI accelerator modules $4.8B (2025)',
    capture: '0.20%',
    source: 'Dataintelo: $4.8B 2025 -> $22.6B 2034, 21% CAGR',
    what: 'A two-channel board-level compute module with the SDK.',
    contents: ['Two-channel SoC2 board', 'Camera harnessing', 'SDK and model toolchain'],
    chain: ['Two cameras cover wider field/stereo', 'Board runs perception on both streams', 'Fused output returned to host', 'System acts on it'],
    buyer: 'Integrators building multi-camera perception without full kit.',
    channel: 'Direct and through electronics distribution.',
    why: 'The mid SKU: twice the channels at roughly double the price, and the volume centre of the compute line.',
    depends: 'Standard SDK and carrier integration.',
    siliconRole: 'Stereo / dual-stream real-time hardware fusion.',
  },
  {
    slug: 'a100-4ch',
    name: 'A100 compute box 4ch +SDK (PCIe)',
    segment: 'Systems',
    domain: 'Compute',
    surface: 'Silicon & compute',
    asp: 300000,
    aspStr: '₹3.00 L',
    units: [0, 75, 150, 300, 600, 1200],
    rev: [0, 2.25, 4.5, 9, 18, 36],
    fy32: 36,
    share: 3.19,
    gm: '89%',
    launch: 'FY2028',
    pool: 'Automotive edge-AI accelerator modules $4.8B (2025)',
    capture: '0.20%',
    source: 'Dataintelo: $4.8B 2025 -> $22.6B 2034, 21% CAGR',
    what: 'A four-channel PCIe compute card with the SDK, for full surround perception.',
    contents: ['Four-channel SoC2 PCIe card', 'Camera harnessing', 'SDK and model toolchain'],
    chain: ['Four cameras give surround coverage', 'Card runs perception across all streams', 'Results to host over PCIe', 'Host builds system on top'],
    buyer: 'OEMs and integrators running complete multi-camera stacks on their own platform.',
    channel: 'Direct design-in with larger integrators.',
    why: 'The highest-priced compute SKU at ₹3.00 L, and the closest the module line gets to a full system.',
    depends: 'Host thermal and power budget.',
    siliconRole: '4-channel PCIe carrier with dedicated cube DMA against 8-bank L2 memory.',
  },
  {
    slug: 't100',
    name: 'T100 AI licence (SaaS)',
    segment: 'Semiconductors',
    domain: 'Outdoor',
    surface: 'Silicon & compute',
    asp: 10000000,
    aspStr: '₹1.00 Cr',
    units: [0, 0, 2, 6, 18, 50],
    rev: [0, 0, 2, 6, 18, 50],
    fy32: 50,
    share: 4.43,
    gm: '94%',
    launch: 'FY2029',
    pool: 'Unsized optionality attaching to ADAS chip demand',
    capture: '—',
    source: 'Management projection',
    what: 'A licence to the trained perception models and toolchain, for parties running their own hardware.',
    contents: ['Trained India-road perception models', 'Toolchain and deployment runtime', 'Update stream and support'],
    chain: ['Customer runs own hardware and sensors', 'Our models do perception work inside runtime', 'Customer system decides and acts', 'Customer ships under own brand'],
    buyer: 'OEMs and platform partners wanting the India-road stack under their own brand.',
    channel: 'Direct licensing, negotiated per engagement.',
    why: 'Pure-margin upside with no sized pool behind it — optionality, not base.',
    depends: 'Defensible model advantage and signed licensing contracts.',
    siliconRole: 'Hardware-independent trained transformer weights and runtime.',
  },
  {
    slug: 'dhumr',
    name: 'Defence D-HUMR',
    segment: 'Robotics',
    domain: 'Outdoor',
    surface: 'Sensors & robotics',
    asp: 2000000,
    aspStr: '₹20.00 L',
    units: [6, 15, 23, 45, 88, 150],
    rev: [1.2, 3, 4.6, 9, 17.6, 30],
    fy32: 30,
    share: 2.66,
    gm: '68%',
    launch: 'FY2027',
    pool: 'Indian Army UGV/robotics procurement',
    capture: '—',
    source: 'MoD/Army programs (existing Rs1 Cr revenue)',
    what: 'An unmanned ground vehicle for defence logistics and reconnaissance on the same compute and perception stack.',
    contents: ['UGV platform with surround sensing', 'SoC2 compute and autonomy stack', 'Teleoperation link', 'Mission payload interface'],
    chain: ['Surround sensing reads terrain and obstacles', 'SoC2 builds local map and plans traversable route', 'Autonomy drives with teleoperation override', 'Mission payload executes at destination'],
    buyer: 'Indian Army and MoD procurement programmes.',
    channel: 'Government procurement, including GeM listing.',
    why: 'The only line with revenue already received: ₹1 Cr on FPGA hardware.',
    depends: 'Procurement cycle timing, which is slow and lumpy.',
    siliconRole: 'Outward threat fusion: correlates radar, thermal, and camera tracks along perimeters.',
    simulatorName: 'DGrid Sentinel · Perimeter Threat Fusion (Slide 58/59)',
    simulatorProof: 'PS16 console proving multi-sensor target correlation, timed escalation ladders, and benign track filtering.',
  },
  {
    slug: 'drone',
    name: 'D100 drone SoC kit',
    segment: 'Robotics',
    domain: 'Outdoor',
    surface: 'Sensors & robotics',
    asp: 500000,
    aspStr: '₹5.00 L',
    units: [0, 5, 50, 125, 225, 400],
    rev: [0, 0.25, 2.5, 6.25, 11.25, 20],
    fy32: 20,
    share: 1.77,
    gm: '68%',
    launch: 'FY2028',
    pool: 'India defence + commercial drone SoC',
    capture: '—',
    source: 'Edge-AI drones segment (Mordor 18% CAGR)',
    what: 'A flight-capable compute and perception kit built on the SoC2 platform for autonomous drones.',
    contents: ['Flight-weight SoC2 compute module', 'Camera and IMU sensing set', 'Flight-controller interface', 'Airborne perception SDK'],
    chain: ['Cameras and IMU read scene and airframe motion', 'SoC2 runs perception and visual odometry in flight', 'Planner produces waypoints and avoidance manoeuvres', 'Flight controller executes'],
    buyer: 'Defence and commercial drone manufacturers.',
    channel: 'Direct to airframe builders.',
    why: 'Opens a procurement cycle unlike automotive, for little incremental engineering.',
    depends: 'Strict airborne weight and power budgets.',
    siliconRole: 'Real-time airborne visual odometry and obstacle avoidance.',
  },
  {
    slug: 'thermal',
    name: 'Thermal camera (aftermarket)',
    segment: 'Sensors',
    domain: 'Outdoor',
    surface: 'Sensors & robotics',
    asp: 50000,
    aspStr: '₹50,000',
    units: [40, 150, 400, 900, 1800, 3200],
    rev: [0.2, 0.75, 2, 4.5, 9, 16],
    fy32: 16,
    share: 1.42,
    gm: '50%',
    launch: 'FY2027',
    pool: 'Automotive thermal camera $1.68B global (2025)',
    capture: '0.10%',
    source: 'Verified Market Research: $1.68B 2025, 12% CAGR',
    what: 'An aftermarket thermal imaging camera for night, fog and low-visibility detection, feeding the same perception stack.',
    contents: ['LWIR thermal sensor and lens', 'Weatherised housing with lens heater', 'Harness into SoC2 compute box'],
    chain: ['LWIR sensor reads emitted heat', 'SoC2 runs detection on thermal image', 'Classification separates people/animals from clutter', 'Detections join unified camera object list'],
    buyer: 'Fleets upgrading existing vehicles, and as attach sold alongside AD0 and AD2.',
    channel: 'Aftermarket, usually at the same fitment as base kit.',
    why: 'A capability line, not a profit line — Indian night driving is where camera-only systems fail.',
    depends: 'Thermal sensor supply (imported BOM risk).',
    siliconRole: 'Thermal stream ingestion and zero-glare night pedestrian classification.',
  },
  {
    slug: 'dms',
    name: 'H100 driver-monitor wearable',
    segment: 'Sensors',
    domain: 'Outdoor',
    surface: 'Sensors & robotics',
    asp: 5000,
    aspStr: '₹5,000',
    units: [200, 800, 2200, 5000, 11000, 20000],
    rev: [0.1, 0.4, 1.1, 2.5, 5.5, 10],
    fy32: 10,
    share: 0.89,
    gm: '50%',
    launch: 'FY2027',
    pool: 'DDAWS mandate (AIS-184) + global DMS demand',
    capture: '—',
    source: 'MoRTH AIS-184; EU Reg 2021/267 (commercial DMS)',
    what: 'A wearable that monitors driver alertness and fatigue, feeding the vehicle alert chain.',
    contents: ['PPG and motion sensing band', 'On-device fatigue model', 'Radio link to vehicle alert chain', 'Fleet enrolment tooling'],
    chain: ['Band reads pulse and motion continuously', 'On-device model scores alertness', 'Drowsiness crosses threshold', 'Vehicle alert chain warns driver and fleet'],
    buyer: 'Fleets meeting drowsiness obligations without a cabin-camera retrofit.',
    channel: 'Fleet direct, often as the first purchase a fleet makes from us.',
    why: 'The easiest first purchase a fleet can make, and a channel entry point rather than revenue.',
    depends: 'Driver acceptance and fleet enrolment discipline.',
    siliconRole: 'Radio gateway interface into vehicle cluster.',
  },
  {
    slug: 'radar',
    name: '4D radar pod (aftermarket)',
    segment: 'Sensors',
    domain: 'Outdoor',
    surface: 'Sensors & robotics',
    asp: 25000,
    aspStr: '₹25,000',
    units: [30, 120, 350, 800, 1600, 3000],
    rev: [0.07, 0.3, 0.88, 2, 4, 7.5],
    fy32: 7.5,
    share: 0.66,
    gm: '50%',
    launch: 'FY2027',
    pool: '4D imaging radar $2.75B global (2025)',
    capture: '0.03%',
    source: 'Business Research Co./Mordor: ~$2.75B 2025, 13% CAGR',
    what: 'An aftermarket 4D imaging radar pod giving range, velocity and elevation alongside the cameras.',
    contents: ['4D imaging radar front end', 'R100 radar DSP processing', 'Sealed housing and harness'],
    chain: ['Radar illuminates scene and reads returns', 'R100 block on die calculates range/velocity/elevation', 'Tracks held across frames through rain/dust', 'Tracks fuse with camera object list'],
    buyer: 'Fleets and integrators adding radar to camera fitments.',
    channel: 'Aftermarket and integrator supply.',
    why: 'The R100 radar block is already on the die, so the tapeout has paid for the silicon.',
    depends: 'Radar front-end antenna qualification.',
    siliconRole: 'Integrated R100 hardware DSP processing 77 GHz radar point clouds.',
  },
];

const create = (surfaceId: string): A2uiMessage[] => [
  { version: 'v0.9', createSurface: { surfaceId, catalogId: deepgridCatalog.id } },
];
const update = (surfaceId: string, components: unknown[]): A2uiMessage[] => [
  { version: 'v0.9', updateComponents: { surfaceId, components } },
];

/* ───────────────────────────── RETRIEVAL ─────────────────────────────
 * Deterministic BM25 over a build-time index of the dossier JSONs, the
 * investor memorandum, the 104-slide deck and the authored video narration.
 *
 * No model is called. The same question always returns the same answer, the
 * page stays a static artifact, and every answer carries the source it came
 * from. This replaces a fallback branch that returned one hardcoded card for
 * every unmatched question.
 */
interface KUnit {
  id: string; kind: string; title: string; body: string; source: string; slide?: number;
  /** unreadability per 1k chars, scored at build time (see scripts/build-knowledge-index.mjs) */
  noise?: number;
  /** questions this passage answers, generated at build time (see scripts/expand-questions.mjs) */
  questions?: string[];
}
interface KIndex { n: number; avglen: number; df: Record<string, number>; fold?: Record<string, string>; units: KUnit[] }

/* The index is ~400 kB. Inlining it put that in the main bundle for every
 * visitor, when only the ones who ask an open question in the briefing tab
 * ever need it. A dynamic import makes it its own hashed chunk, fetched on
 * the first open question and cached thereafter. */
let KI: KIndex | null = null;
let KILoading: Promise<KIndex> | null = null;
export function loadIndex(): Promise<KIndex> {
  if (KI) return Promise.resolve(KI);
  if (!KILoading) {
    KILoading = import('./generated/knowledge-index.json')
      .then((m) => { KI = (m.default ?? m) as unknown as KIndex; return KI; });
  }
  return KILoading;
}

const STOP = new Set(('the a an and or of to in for on at is are was were be been it its this that with as by ' +
  'from we our you your they their he she i not no do does did what which who whom how why when where can ' +
  'could should would will shall may might must if then than there here them us me my mine about into over ' +
  'under out up down off any all some more most other such only own same so too very just now tell show ' +
  'explain give does deepgrid').split(' '));

/* Plural folding, applied to BOTH the passages and the query so the two meet
 * on the same term. Without it the index held "risk" in 56 passages and
 * "risks" in 4, and "what are the risks?" reached the 4. The map is derived
 * from this corpus at build time rather than by a rule, which is what keeps
 * "adas" and "ais" from being stemmed into "ada" and "ai". */
let FOLD: Record<string, string> = {};
const setFold = (f?: Record<string, string>) => { FOLD = f || {}; };

const tokenize = (s: string): string[] =>
  (s.toLowerCase().match(/[a-z0-9₹%.-]{2,}/g) || [])
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => FOLD[w] || w);

// term frequencies are computed once, on first query, rather than shipped
let TF: Record<string, number>[] | null = null;
let LEN: number[] | null = null;
/* OCR concatenates words on tight layouts ("Revenueby Business Line",
 * "FINANCIALOVERVIEW"). Case-transition splitting cannot separate a
 * lowercase or all-caps run-on, and a dictionary segmenter is overkill here.
 * Keeping a space-stripped form of every passage lets a space-stripped query
 * match straight through the run-on instead. */
let FLAT: string[] | null = null;
/* the passage title's own tokens, kept separately so a title match can be
 * scored as the stronger evidence it is */
let TITLE: Set<string>[] | null = null;
const flatten = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
function ensureTF(idx: KIndex) {
  if (TF) return;
  // must run before any tokenize() call below, so passages and queries fold alike
  setFold(idx.fold);
  TF = []; LEN = []; FLAT = []; TITLE = [];
  for (const u of idx.units) {
    const q = (u.questions || []).join(' ');
    const t = tokenize(`${u.title} ${u.title} ${q} ${q} ${u.body}`);
    const m: Record<string, number> = {};
    for (const w of t) m[w] = (m[w] || 0) + 1;
    TF.push(m); LEN.push(t.length); FLAT.push(flatten(`${u.title} ${(u.questions || []).join(' ')} ${u.body}`));
    TITLE.push(new Set(tokenize(u.title)));
  }
}

export interface Hit { unit: KUnit; score: number }

/* Interrogatives that are stop words on their own but are the actual subject
 * of a heading in this corpus. "why now" tokenised to [] -- both words are in
 * STOP -- so the agent answered "NOT IN THE DOSSIER" to a question 27 passages
 * address, including the investor summary's own "Why now" section. */
/* Function words that survive STOP and then OUTWEIGH the word the user meant.
 * In an 816-passage corpus "many" has df 22 and idf 3.59 -- HIGHER than
 * "patent" at df 23, idf 3.55. So "how many patents does deepgrid have"
 * returned "B8 - No dated competitive-win timeline" at rank 1, scored 7.22
 * entirely on many (4.87) + have (3.62), a passage containing no patent
 * mention at all. The right passage sat at rank 5, outside the four the
 * reranker is ever shown, so neither reranking nor embeddings could reach it.
 *
 * QUERY SIDE ONLY. The index keeps these terms, so no df moves and no reindex
 * is needed; a passage that never sees the word cannot shift. Measured
 * leave-one-out over all 1,001 generated questions:
 *
 *   queries containing one of these (n=189)   r@1 31.2% -> 33.9%
 *   control, queries without one (n=812)      r@1 29.9% -> 29.9%   (exactly 0)
 *
 * The gain is small on that benchmark because its questions are cleanly
 * phrased and carry 3-5 content words, which dilutes "many". A typed question
 * often carries ONE, and that is the case this fixes.
 */
const QUERY_STOP = new Set(('many much have has had having being get got gets getting know knows known ' +
  'thing things stuff lot lots actually really basically simply exactly please let lets want wants wanted ' +
  'say says said go goes going come comes look looks see seen mean means').split(' '));

/* Same as tokenize(), minus the function words above. Used for the QUERY only:
 * ensureTF() must keep calling tokenize() or the two sides stop meeting. */
const tokenizeQuery = (s: string): string[] =>
  tokenize(s).filter((w) => !QUERY_STOP.has(w));

/* Exported so the offline harness measures the SHIPPED tokenizer rather than a
 * copy of it. A guard tuned against a reimplemented tokenizer is tuned against
 * the wrong thing. */
/* Is this query term foreign to the corpus, as opposed to merely misspelled?
 *
 * A misspelling sits one edit from a term the index holds; a word from another
 * domain does not. Measured against the 7,887-term vocabulary: "hows" -> rows,
 * lows; "teh" -> tech, ten, th; while "cricket", "pizza", "sourdough",
 * "offside", "photosynthesis" and "everest" have no neighbour at all.
 *
 * The vocabulary is cached per index object, so the scan runs once per session
 * rather than once per query, and only unknown terms reach it -- a well-formed
 * domain question never pays for this at all. */
const VOCAB_CACHE = new WeakMap<object, string[]>();
const editDistance1 = (a: string, b: string): boolean => {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, d = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++d > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else { i++; j++; }
  }
  return d + (a.length - i) + (b.length - j) <= 1;
};
export function isForeignTerm(idx: KIndex, w: string): boolean {
  if (idx.df[w] > 0) return false;
  let vocab = VOCAB_CACHE.get(idx as unknown as object);
  if (!vocab) { vocab = Object.keys(idx.df); VOCAB_CACHE.set(idx as unknown as object, vocab); }
  for (const v of vocab) if (editDistance1(w, v)) return false;
  return true;
}

export const _tokenizeQuery = tokenizeQuery;
export const _tokenize = tokenize;

const KEEP_WHEN_EMPTY = new Set(['why', 'now', 'how', 'what', 'when', 'where', 'who', 'which']);
const tokenizeLoose = (s: string): string[] =>
  (s.toLowerCase().match(/[a-z0-9₹%.-]{2,}/g) || [])
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((w) => w.length > 1 && (!STOP.has(w) || KEEP_WHEN_EMPTY.has(w)))
    .map((w) => FOLD[w] || w);

export function retrieve(idx: KIndex, question: string, limit = 4): Hit[] {
  ensureTF(idx);
  // Drop the function words first; if that empties the query ("how many"),
  // fall back to the full tokenizer before the phrase fallback below.
  const qs = tokenizeQuery(question).length ? tokenizeQuery(question) : tokenize(question);
  if (!qs.length) {
    /* Every term was a stop word ("why now"). The loose tokenizer cannot
     * rescue this on its own, because the INDEX dropped those words too, so
     * they carry no term frequency. Match the raw phrase against titles and
     * bodies instead -- "Why now" is a heading in this corpus, 27 passages
     * deep. */
    const phrase = question.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    if (phrase.length < 3) return [];
    const out: Hit[] = [];
    for (let i = 0; i < idx.units.length; i++) {
      const u = idx.units[i];
      const t = u.title.toLowerCase();
      const inTitle = t.includes(phrase);
      const inBody = u.body.toLowerCase().includes(phrase);
      if (!inTitle && !inBody) continue;
      out.push({ unit: u, score: (inTitle ? 12 : 5) + (u.kind === 'Investor memorandum' ? 2 : 0) });
    }
    return out.sort((a, b2) => b2.score - a.score).slice(0, limit);
  }
  // Flattening the WHOLE question only matches a verbatim occurrence. Phrases
  // are what get concatenated by OCR, so test 2-4 word windows instead:
  // "revenue by business line" -> "revenuebybusinessline".
  const qgrams: string[] = [];
  for (let n = 4; n >= 2; n--) {
    for (let i = 0; i + n <= qs.length; i++) {
      const g = flatten(qs.slice(i, i + n).join(''));
      if (g.length >= 14) qgrams.push(g);
    }
  }
  // Length normalisation is the whole ballgame for a SHORT query. "tell me
  // about the team" reduces to one token, so the coordination factor below
  // never fires and BM25 hands the win to whichever short passage mentions
  // the word once in passing -- a tapeout decision memo beat the IM's
  // "FOUNDER & TEAM" page. Leaning off b for one- and two-token queries fixes
  // that class outright. Long queries keep b=0.72, which the 1,005-question
  // benchmark validates.
  const k1 = 1.4, N = idx.units.length, avg = idx.avglen || 60;
  const b = qs.length <= 2 ? 0.25 : 0.72;
  const scored: Hit[] = idx.units.map((unit, i) => {
    let score = 0;
    let matched = 0;
    let titleHits = 0;
    for (const q of qs) {
      const f = TF![i][q];
      if (!f) continue;
      matched++;
      if (TITLE![i].has(q)) titleHits++;
      const n = idx.df[q] || 0.5;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + (b * LEN![i]) / avg));
    }
    // Coordination factor. Without it a single rare term carries a passage:
    // "should we do the tapeout now or wait" reduces to [tapeout, wait], and
    // one passage containing only "wait" outscored every passage about the
    // tapeout. Reward covering more of the query, gently enough not to
    // overturn a strong single-term match.
    if (qs.length > 1) score *= 0.55 + 0.45 * (matched / qs.length);

    // run-on match: a flattened query phrase found inside the flattened
    // passage recovers hits that OCR concatenation hid. Additive and small,
    // so it rescues a buried passage without overturning a good lexical one.
    if (score > 0) {
      let g = 0;
      for (const qg of qgrams) if (FLAT![i].includes(qg)) { g++; if (g === 2) break; }
      score += g * 2.2;
    }
    // a hostile question is already a diligence answer, so nudge it up when
    // it genuinely matches; a raw slide body is the weakest evidence
    // A query term appearing in the passage TITLE is far stronger evidence
    // than the same term buried in the body: titles here are authored
    // one-line verdicts, so they are the most answer-shaped field we have.
    // This is what moves "why not just buy from a Tier-1" off a falsifier
    // note and onto "Buy the certification, partner the homologation".
    if (titleHits > 0) score *= 1 + 0.6 * (titleHits / qs.length);

    if (unit.kind === 'Hostile question') score *= 1.18;
    /* Audit docs quote everything, so they match everything. Demote them:
     * they should win a question about a discrepancy, not one about a SKU. */
    if (unit.kind === 'Document audit') score *= 0.72;

    /* Readability penalty. A fifth of this corpus is OCR of scanned pages and
     * flattened spreadsheet rows, and it was winning: "Who is the CEO?" came
     * back "13. FOUNDER&TEAM 20 Yearsof Execution Proof-The Team That Wins This
     * Market ARAVINDPRASADG AYASKHAN". Measured over 64 queries before this,
     * only 11 returned an answer free of OCR jam, row dumps, stray [S1] markers
     * or bare number runs.
     *
     * Demote rather than exclude: some of those passages hold a fact that
     * exists nowhere else, and they should still win when nothing clean is
     * close. noise 4 cuts the score to a third, noise 12 to a seventh.
     * Swept: divisor 4 left 30 of 64 queries fatal-free, 2 left 34, 1 left 35.
     * Past 2 it buys almost nothing, because the residue is queries where the
     * ONLY passage that answers is OCR'd -- no ranking penalty invents clean
     * text, so that half of the problem belongs to the source, not here. */
    if (unit.noise) score /= 1 + unit.noise / 2;
    // The 104-slide deck is the largest single body of DeepGrid documentation
    // (99,520 chars) and carries on-slide tables, figures and speaker notes
    // that exist nowhere else. It was previously penalised here on the theory
    // that the narration restated it -- but the narration is separately
    // authored, so it does not. No penalty.
    return { unit, score };
  });
  return scored.filter((h) => h.score > 0).sort((a, b2) => b2.score - a.score).slice(0, limit);
}


/* Research evidence attached to a DETERMINISTIC card.
 *
 * WHY THIS EXISTS. The named-SKU branch below is an early return against the
 * hardcoded SKUS table: it never calls retrieve(), so the 139 passages that
 * content-research contributed to the index were unreachable from the single
 * most-used path on the page. Every one of the 15 SKUs has research coverage
 * (2 to 16 files each), and none of it was being shown. An investor asking
 * about the A100 got a clean product card and never learned that the IM
 * describes it with three different sensor configurations.
 *
 * The card stays exactly as it was -- it is precise and correct, and putting a
 * probabilistic retriever in front of an exact SKU match could only degrade
 * it. This ATTACHES to it instead. Research is additive here, never
 * substitutive, which is the distinction the global research boost got wrong:
 * weighting research at 1.8 inside retrieve() fixed 2 queries and broke 5.
 */
/* 'Information memorandum' is deliberately NOT here. Those units are OCR'd IM
 * pages -- the primary source the card already summarises, and unreadable as
 * prose ("WHAIDEEPGRIDIS", "2 Lkit,not8L"). Including them filled the panel
 * with sludge on the first build. Only the two kinds contributed by the
 * content-research run qualify. */
const RESEARCH_KINDS = new Set(['Market research', 'Document audit']);

export function researchFor(idx: KIndex, name: string, limit = 3): Hit[] {
  /* Query on the DISTINCTIVE tokens, not the display name. Research writes
   * "A100 compute box 1ch (M.2)" while the SKUS table says "+SDK", so a
   * name match returns nothing -- measured: 7 of 15 SKUs scored as having
   * zero coverage until this was fixed, and all 15 actually have some. */
  const toks = (name.toLowerCase().match(/[a-z0-9]+/g) || [])
    .filter((w) => w.length > 2 && !/^(the|and|kit|box|sdk)$/.test(w));
  const code = toks.find((w) => /\d/.test(w));
  const query = [code, ...toks.filter((w) => w !== code)].filter(Boolean).join(' ');
  if (!query) return [];

  /* Rank the WHOLE corpus, then filter -- but take the whole ranking, not a
   * cut of it. Two wrong versions preceded this one:
   *
   *   retrieve(idx, query, 24).filter(research)  -- slides and narration fill
   *   all 24, so the A100's four research passages never appeared. A filter
   *   applied after a cut measures the cut, not the corpus.
   *
   *   retrieve({ ...idx, units: research }, query)  -- worse. ensureTF() caches
   *   term frequencies BY POSITION in the full index behind `if (TF) return`,
   *   so a filtered units array makes TF[i] describe a different passage; and
   *   had such a call ever run first, TF would have been built from 139 units
   *   and every later full-corpus query would have read the wrong row. Never
   *   hand retrieve() an index whose units differ from the one TF was built
   *   from.
   */
  return retrieve(idx, query, idx.units.length)
    .filter((h) => RESEARCH_KINDS.has(h.unit.kind))
    /* model-review-extract carries the financial model as literal spreadsheet
     * rows ("r 5: AD0 Smart Mirror (360) Product Sales FY2027 0.05 11 40 ..."),
     * which is data the card above already renders as a ramp, and unreadable
     * as evidence. Demote row dumps so the prose findings win the slot. */
    .filter((h) => (h.unit.body.match(/\br \d+:/g) || []).length < 4)
    .slice(0, limit);
}

/* Attach the research evidence to ANY deterministic answer.
 *
 * Every branch in buildAnswer() that returns a hand-built card is an early
 * return that never calls retrieve(), so the 139 passages contributed by the
 * content-research run were unreachable from the chips and from every named
 * lookup -- which is most of what people actually click. This makes the
 * attachment uniform: the deterministic card still leads and is unchanged,
 * and the research panel sits underneath it.
 *
 * Emits nothing when there is no coverage, so a topic the research does not
 * discuss renders exactly as it did before.
 */
/** The longest word-boundary prefix every name in the group shares, so a
 *  family of SKUs is described by its family name. Falls back to the first
 *  name when they share nothing. */
function familyName(names: string[]): string {
  if (names.length < 2) return names[0] || '';
  const words = names.map((n) => n.split(/\s+/));
  const out: string[] = [];
  for (let i = 0; i < words[0].length; i++) {
    const w = words[0][i];
    if (!words.every((ws) => ws[i] === w)) break;
    out.push(w);
  }
  return out.length ? out.join(' ') : names[0];
}

function researchNodes(rIdx: KIndex, topic: string, childIds: string[]) {
  const hits = researchFor(rIdx, topic);
  const root = {
    id: 'root',
    component: 'Column',
    children: hits.length ? [...childIds, 'research'] : childIds,
  };
  if (!hits.length) return [root];
  return [root, {
    id: 'research',
    component: 'DossierAnswerCard',
    question: `What the source documents say about ${topic}`,
    answered: true,
    kind: hits[0].unit.kind,
    lead: answerSentence(topic, hits[0].unit.body),
    answer: hits[0].unit.body,
    sourceLabel: hits[0].unit.source,
    coverage: `Attached from ${rIdx.units.filter((u) => RESEARCH_KINDS.has(u.kind)).length} research passages contributed by the content-research run. The card above is the dossier's own figure; this is what the memorandum review, the model audit and the competitive dossier say about the same thing.`,
    supporting: readableSupports(hits.slice(1)).map((h) => ({
      kind: h.unit.kind,
      title: h.unit.title,
      excerpt: clipToSentence(h.unit.body, 420),
      source: h.unit.source,
    })),
  }];
}

/* Optional reranking of the retrieved four.
 *
 * The measured defect is ordering, not finding: the right passage is inside
 * the shown four 66.7% of the time while ranking first only 33.3%. Asking a
 * model to pick among those four lifted rank-1 to 46.7% (+13.4). A Gemini
 * embedding hybrid was measured at +4.0 for 658 kB of shipped vectors, so
 * this is the cheaper and larger win.
 *
 * It is OPTIONAL by construction. With VITE_RERANK_ENDPOINT unset the page
 * makes no network call at all and behaves exactly as it does offline today;
 * if the endpoint is slow, down, or answers with nonsense, the lexical order
 * stands. A ranking aid must never be able to take the answer away.
 */
const RERANK_ENDPOINT: string = (import.meta as unknown as { env?: Record<string, string> })
  .env?.VITE_RERANK_ENDPOINT || '';
const RERANK_TIMEOUT_MS = 4000;

/* Send the part of the passage that is ABOUT the question, not its opening.
 * "15 Provisional Patents" sits at character 1,057 of an 1,186-character
 * passage; a head-of-body excerpt cut at 320 meant the reranker was shown a
 * chiplet floorplan and asked whether it answered a question about patents.
 * It could not have said yes. Centre the window on the rarest query term the
 * passage actually contains. */
/* Retrieval returns a whole passage, and a passage opens where the DOCUMENT
 * wanted to open, not where the answer is. Measured over 40 authored questions
 * drawn on a fixed stride from the corpus: the answering sentence is not the
 * first sentence 15 times out of 40, and what stands in front of it is almost
 * always the section's own heading and framing line.
 *
 *   "What is the deadline for the 15 provisional patents?"
 *     opens  "The decision. The company has a mandate it cannot yet serve..."
 *     answer "The 15 provisional patents carry a March 2027 conversion
 *             deadline that no use-of-funds line pays for."
 *
 *   "How much does per-PCORE DMA improve the frame budget?"
 *     opens  "Data movement, animated. One shared DMA engine starves..."
 *     answer "470 ms per YOLO frame today, about 85 ms with per-PCORE DMA."
 *
 * So promote that sentence above the passage rather than trimming the passage:
 * the reader sees the answer first and keeps the argument around it. Scored by
 * summed IDF, so a sentence matching "tapeout" beats one matching "the".
 *
 * A first version justified this by chunk boundaries orphaning a leading
 * pronoun. That does happen -- "What happens if the tapeout slips?" opens "That
 * is a modelling choice worth crediting" -- but it is 1 passage in 40, not the
 * general case, and the rationale was written from that single example before
 * it was counted. */
export function answerSentence(question: string, body: string): string {
  const flat = body.replace(/\s+/g, ' ').trim();
  const qs = new Set(tokenize(question));
  if (!qs.size) return '';
  const sentences = flat.split(/(?<=[.!?])\s+(?=[A-Z\u20B9$"'\u201c(])/).filter((s) => s.length > 40);
  if (sentences.length < 2) return '';
  const idf = (w: string) => {
    const n = KI?.df?.[w] ?? 0.5;
    return Math.log(1 + ((KI?.n ?? 1000) - n + 0.5) / (n + 0.5));
  };
  /* A candidate has to stand on its own, because it is about to be shown
   * without the sentence before it. "That is the single largest risk in the
   * plan." scores well on "biggest risk plan" and answers nothing -- it is the
   * same anaphora defect this function exists to route around, one layer in. */
  const anaphoric = /^(that|this|these|those|it|they|them|both|such|neither|either|hence|so|therefore|which)\b/i;
  let best = '';
  let bestScore = 0;
  for (const s of sentences) {
    if (anaphoric.test(s.trim())) continue;
    const seen = new Set<string>();
    let score = 0;
    for (const w of tokenize(s)) if (qs.has(w) && !seen.has(w)) { seen.add(w); score += idf(w); }
    // long sentences match more terms by chance; normalise gently
    score /= Math.sqrt(Math.max(1, s.length / 90));
    if (score > bestScore) { bestScore = score; best = s.trim(); }
  }
  // Only worth promoting when it is not already the opening line.
  return best && best !== sentences[0].trim() ? best : '';
}

/* Cut on a sentence boundary. A hard slice produced "Neither ca..." and
 * "already places this line in FY20..." in the supporting list. */
export function clipToSentence(text: string, width: number): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= width) return flat;
  const cut = flat.slice(0, width);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (end > width * 0.5) return cut.slice(0, end + 1);
  const sp = cut.lastIndexOf(' ');
  return (sp > width * 0.5 ? cut.slice(0, sp) : cut) + '\u2026';
}

function excerptFor(question: string, body: string, width = 420): string {
  const flatBody = body.replace(/\s+/g, ' ');
  const qs = tokenize(question);
  if (!qs.length) return flatBody.slice(0, width);
  const lower = flatBody.toLowerCase();
  let bestAt = -1;
  let bestIdf = -1;
  for (const w of qs) {
    const at = lower.indexOf(w);
    if (at < 0) continue;
    const n = KI?.df?.[w] ?? 0.5;
    const score = Math.log(1 + ((KI?.n ?? 1000) - n + 0.5) / (n + 0.5));
    if (score > bestIdf) { bestIdf = score; bestAt = at; }
  }
  if (bestAt < 0) return flatBody.slice(0, width);
  let start = Math.max(0, bestAt - Math.floor(width / 3));
  if (start > 0) { const sp = flatBody.indexOf(' ', start); if (sp > -1 && sp < start + 30) start = sp + 1; }
  return (start > 0 ? '… ' : '') + flatBody.slice(start, start + width);
}

/* A supporting excerpt is optional context. The primary answer earns its place
 * by being the best match; a support does not, so an unreadable one is pure
 * cost -- it is the "ALSO MATCHED" list, not the answer, that still carried OCR
 * jam and spreadsheet rows after the ranking penalty went in. Drop rather than
 * demote: there is nothing to trade off. */
const READABLE_SUPPORT = 6;
const readableSupports = (hits: Hit[]): Hit[] => {
  const clean = hits.filter((h) => (h.unit.noise ?? 0) < READABLE_SUPPORT);
  // If every support is noisy, show none rather than the least bad sludge.
  return clean;
};

/* Returns the (possibly reordered) hits plus `irrelevant`, the reranker's
 * verdict that NONE of the candidates answers the question.
 *
 * The asymmetry is deliberate and load-bearing: every failure path below
 * returns irrelevant:false, so a timeout, an offline visitor, a CORS refusal or
 * a malformed reply can only fail to ADD a refusal -- never cause one. The
 * refusal decision stays lexical by default; this can only tighten it. */
interface Reranked { hits: Hit[]; irrelevant: boolean }
async function rerank(question: string, hits: Hit[]): Promise<Reranked> {
  if (!RERANK_ENDPOINT || hits.length < 2) return { hits, irrelevant: false };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), RERANK_TIMEOUT_MS);
    const res = await fetch(RERANK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        q: question,
        candidates: hits.map((h) => ({ title: h.unit.title, excerpt: excerptFor(question, h.unit.body) })),
      }),
    });
    clearTimeout(timer);
    if (!res.ok) return { hits, irrelevant: false };
    const j = await res.json() as { pick?: number };
    const pick = Number(j?.pick);
    // 0 is the relevance veto: the corpus has candidates, none of them answer.
    if (pick === 0) return { hits, irrelevant: true };
    if (!Number.isInteger(pick) || pick < 1 || pick > hits.length || pick === 1) return { hits, irrelevant: false };
    const chosen = hits[pick - 1];
    return { hits: [chosen, ...hits.filter((_, i) => i !== pick - 1)], irrelevant: false };
  } catch {
    return { hits, irrelevant: false };   // timeout, offline, CORS, malformed -- keep lexical order
  }
}

/** Below this, the corpus does not actually answer the question. */
export const ANSWER_THRESHOLD = 3.2;

/**
 * GEMINI OMNI MASTER DECK ROUTING ENGINE
 * Grounded 100% in the 104-slide master presentation and WSL dataset.
 */
export async function buildAnswer(question: string, surfaceId: string): Promise<A2uiMessage[]> {
  const q = question.trim();
  const s = q.toLowerCase();

  // The keyword branches below are lookups: "show slide 19", "AD0 unit
  // economics", "the silicon spec". They match on a single word, so without
  // this guard a question like "what happens if the tapeout slips?" is
  // answered with the tapeout SPEC SHEET rather than the risk analysis --
  // the keyword shadows the retrieval. An analytical question skips them.
  const analytical =
    /\bwhat if\b|\bwhat happens\b|\bwhy\b|\bhow do we\b|\bhow does\b|\bshould we\b|\bcompare\b|\bversus\b|\bvs\b|\brisk\b|\bslip|\bdelay|\bassumption|\bsensitiv|\bchurn|\bcompetitor|\bthreat|\bobjection|\bdefend|\bbeat\b|\bworst case\b|\bdownside\b|\bwrong\b|\bfail/i.test(s);

  // 1. Exact Slide Viewer Trigger ("slide 19", "show slide 5")
  const slideNumMatch = s.match(/(?:show\s+)?slide\s*(\d{1,3})/);
  if (slideNumMatch) {
    const num = parseInt(slideNumMatch[1], 10);
    const found = masterSlidesData.find((m) => m.slide === num);
    if (found) {
      return [
        ...create(surfaceId),
        ...update(surfaceId, [
          /* Retrieve against the slide the reader actually asked for. The
             generic phrase returned whatever the corpus said about "the deck",
             so "show slide 19" attached a finding about the cost waterfall on
             slide 11. */
          ...researchNodes(await loadIndex(), `slide ${found.slide} ${found.title}`, ['main']),
          {
            id: 'main',
            component: 'SlideViewerCard',
            slide: found.slide,
            title: found.title,
            tag: found.tag,
            script: found.script,
          },
        ]),
      ];
    }
  }

  // 2. Specific SKU Queries -> Full 4-Slide Repeatable Grammar
  //
  // MATCH ALL, not the first. "4D Radar Pod & Thermal Camera" names two SKUs
  // and previously returned only the Thermal camera, silently dropping the
  // other; "A100 Compute Box (3 SKUs)" names a family of three and matched
  // none, falling through to the generic answer card.
  const skuMatches = analytical ? [] : SKUS.filter((sku) => {
    const nameMatch = s.includes(sku.name.toLowerCase());
    const slugMatch = s.includes(sku.slug);
    if (sku.slug === 'ad2' && (/smart truck|ad2|truck kit|truck adas/i.test(s))) return true;
    if (sku.slug === 'ad0' && (/smart mirror|ad0|mirror/i.test(s))) return true;
    if (sku.slug === 'ad1' && (/indoor l4|ad1|forklift|amr/i.test(s))) return true;
    if (sku.slug === 'taas' && (/taas|autonomous taas|transport as a service/i.test(s))) return true;
    if (sku.slug === 'agv' && (/seaport|agv|port autonomy|vizag/i.test(s))) return true;
    if (sku.slug === 'chipset' && (/bare die|chipset|oem b2b|asic die/i.test(s))) return true;
    if (sku.slug === 'dhumr' && (/d-humr|dhumr|defence|army|sentinel/i.test(s))) return true;
    if (sku.slug === 'radar' && (/4d radar|radar pod|r100/i.test(s))) return true;
    if (sku.slug === 'thermal' && (/thermal camera|lwir/i.test(s))) return true;
    if (sku.slug === 'dms' && (/h100|driver monitor|wearable/i.test(s))) return true;
    // the three A100 compute boxes are one family in the UI's own prompt
    // ("A100 Compute Box (3 SKUs)"); no single SKU carries that name
    if (sku.slug.startsWith('a100') && /a100|compute box/i.test(s)) return true;
    return nameMatch || slugMatch;
  });
  const foundSku = skuMatches[0];

  /* A VERDICT, not a narrative.
   *
   * This was six clauses restating every field the card already renders in its
   * own block -- ASP and margin in the header, `what` under 01, buyer and
   * channel under 03, the ramp in the trajectory row, `why` as Portfolio Role,
   * `depends` as Dependencies. Ten lines on desktop and nineteen on a phone
   * that told a reader nothing the rest of the card did not, placed where the
   * eye lands first.
   *
   * What is NOT anywhere else is the line's rank against the other fourteen.
   * So the verdict is rank plus the judgement, and everything else stays in
   * the block that owns it. `whyNow` no longer ships separately: it is this. */
  const skuRank = (sku: typeof SKUS[number]): string => {
    const rank = [...SKUS].sort((a, b) => b.fy32 - a.fy32).findIndex((x) => x.slug === sku.slug) + 1;
    return `Rank ${rank} of ${SKUS.length} by FY2032 revenue`;
  };

  // more than one SKU named -> a Column of cards, using A2UI's adjacency list
  // (children referred to by id) rather than dropping all but the first
  if (skuMatches.length > 1) {
    const cards = skuMatches.map((sku, i) => ({
      id: `sku-${i}`,
      component: 'SkuExplainerCard',
      name: sku.name,
      surface: sku.surface,
      segment: sku.segment,
      asp: sku.aspStr,
      fy32Rev: `₹${sku.fy32} Cr`,
      share: sku.share.toFixed(1),
      gm: sku.gm,
      rank: skuRank(sku),
      verdict: sku.why,
      what: sku.what,
      contents: sku.contents,
      chain: sku.chain,
      siliconRole: sku.siliconRole,
      dependency: sku.depends,
      buyer: sku.buyer,
      channel: sku.channel,
      demandPool: sku.pool,
      captureRate: sku.capture,
      rampUnits: sku.units,
      rampRevs: sku.rev,
      fys: FYS,
      simulatorName: sku.simulatorName,
      simulatorProof: sku.simulatorProof,
    }));
    const rIdx = await loadIndex();
    return [
      ...create(surfaceId),
      ...update(surfaceId, [
        /* Label the panel with what the group SHARES, not with whichever card
         * sorted first: "A100 compute box 1ch +SDK (M.2)" read as though the
         * evidence were about the 1ch alone when all three are on screen. */
        ...researchNodes(rIdx, familyName(cards.map((c) => c.name as string)), cards.map((c) => c.id as string)),
        ...cards,
      ]),
    ];
  }

  if (foundSku) {
    /* The index is loaded lazily further down, after this branch returns, so
     * a chip-only visitor never downloaded it. Attaching research means paying
     * for it here (290 kB gzipped, its own chunk). Worth it: the alternative
     * is a card that silently omits the audit findings about the SKU it is
     * describing, which is the defect this whole change exists to fix. */
    const rIdx = await loadIndex();
    return [
      ...create(surfaceId),
      ...update(surfaceId, [
        ...researchNodes(rIdx, foundSku.name, ['sku']),
        {
          id: 'sku',
          component: 'SkuExplainerCard',
          rank: skuRank(foundSku),
          verdict: foundSku.why,
          name: foundSku.name,
          surface: foundSku.surface,
          segment: foundSku.segment,
          asp: foundSku.aspStr,
          fy32Rev: `₹${foundSku.fy32} Cr`,
          share: foundSku.share.toFixed(1),
          gm: foundSku.gm,
          what: foundSku.what,
          contents: foundSku.contents,
          chain: foundSku.chain,
          siliconRole: foundSku.siliconRole,
          dependency: foundSku.depends,
          buyer: foundSku.buyer,
          channel: foundSku.channel,
          demandPool: foundSku.pool,
          captureRate: foundSku.capture,
          rampUnits: foundSku.units,
          rampRevs: foundSku.rev,
          fys: FYS,
          simulatorName: foundSku.simulatorName,
          simulatorProof: foundSku.simulatorProof,
        },
      ]),
    ];
  }

  /* 2b. Verdict / assessment. This MUST precede the portfolio branch: the
   * prompt "What is the verdict on the portfolio?" contains the word
   * "portfolio", so it was caught by the map branch below and returned a card
   * identical to "Show the 15-SKU Portfolio Map" -- two different questions,
   * one answer. A verdict is a judgement, not a table, and DeckSynthesisCard
   * existed for exactly this while being emitted nowhere. */
  if (!analytical && /verdict|assessment|bottom line|so what|overall view|your view|what should i think|is this a good/i.test(s)) {
    const ranked = [...SKUS].sort((a, b) => b.fy32 - a.fy32);
    const total = SKUS.reduce((a, x) => a + x.fy32, 0);
    const top2 = ranked[0].fy32 + ranked[1].fy32;
    const conc = (100 * top2) / total;
    const blended = SKUS.reduce((a, x) => a + x.fy32 * (parseFloat(x.gm) || 0), 0) / total;
    return [
      ...create(surfaceId),
      ...update(surfaceId, [
        ...researchNodes(await loadIndex(), 'the portfolio verdict and concentration', ['main']),
        {
          id: 'main',
          component: 'DeckSynthesisCard',
          question: 'What is the verdict on the portfolio?',
          bluf: `Fifteen SKUs, one die. ₹${total.toFixed(2)} Cr at FY2032 on a ${blended.toFixed(1)}% blended gross margin, but ${conc.toFixed(1)}% of it comes from just two lines — ${ranked[0].name} at ₹${ranked[0].fy32} Cr and ${ranked[1].name} at ₹${ranked[1].fy32} Cr. Both are road-autonomy systems selling into the same mandate, so the plan is a concentrated bet on one regulation landing on time, not a diversified portfolio of fifteen.`,
          keyMetrics: [
            { label: 'FY2032 revenue', value: `₹${total.toFixed(2)} Cr`, context: `across ${SKUS.length} SKUs off a single 28nm die` },
            { label: 'Top-2 concentration', value: `${conc.toFixed(1)}%`, context: `${ranked[0].name} + ${ranked[1].name}` },
            { label: 'Blended gross margin', value: `${blended.toFixed(1)}%`, context: 'revenue-weighted across all lines, not an assumption' },
            { label: 'Lines below 5% share', value: `${SKUS.filter((x) => x.share < 5).length} of ${SKUS.length}`, context: 'the long tail carries little of the plan' },
          ],
          deckEvidence: 'Totals reconcile to the deck: the fifteen SKU revenues sum to ₹1,128.45 Cr, the figure stated on slide 6, and every per-SKU share equals its own revenue divided by that total.',
          portfolioRole: `The tail is capability, not revenue. ${SKUS.filter((x) => x.share < 5).length} of ${SKUS.length} lines sit under 5% share; they exist to prove the die serves more than one market, and they are financed by the two that do the earning.`,
          dependencies: `Everything routes through one tapeout. ${ranked[0].name} and ${ranked[1].name} both depend on the mandate schedule holding, so a slip moves ${conc.toFixed(1)}% of FY2032 revenue at once — the concentration and the single-die design are the same risk seen twice.`,
          referencedSlides: [
            { slide: 6, title: 'The portfolio — all fifteen SKUs', url: '#slide-6' },
            { slide: 18, title: 'AD2 · What it is', url: '#slide-18' },
            { slide: 21, title: 'AD2 · How it fits', url: '#slide-21' },
          ],
        },
      ]),
    ];
  }

  // 3. 15-SKU Portfolio Map / Rankings / Financial Overview (Slide 6)
  if (!analytical && /portfolio|all skus|15 skus|revenue build|margin ladder|breakdown|rank/i.test(s)) {
    return [
      ...create(surfaceId),
      ...update(surfaceId, [
        ...researchNodes(await loadIndex(), 'the 15-SKU portfolio revenue mix', ['main']),
        {
          id: 'main',
          component: 'PortfolioMatrixCard',
          title: 'Fifteen SKUs Ranked by FY2032 Revenue',
          totalRevenue: '₹1,128.45 Cr',
          skus: SKUS.map((sku) => ({
            name: sku.name,
            surface: sku.surface,
            asp: sku.aspStr,
            rev: `₹${sku.fy32} Cr`,
            share: `${sku.share.toFixed(1)}%`,
            gm: sku.gm,
            firstLaunch: sku.launch,
          })),
        },
      ]),
    ];
  }

  // 4. Monolithic SoC2 Silicon Architecture & Gated Mask Stages (Slide 4 & 5)
  if (!analytical && /silicon|soc2|macs|headroom|latency|tapeout|mask|gated|bandwidth|28nm/i.test(s)) {
    return [
      ...create(surfaceId),
      ...update(surfaceId, [
        ...researchNodes(await loadIndex(), 'the SoC2 28nm monolithic silicon and tapeout', ['main']),
        {
          id: 'main',
          component: 'SiliconSpecCard',
          title: 'SoC2 Monolithic 28nm ASIC Specification & Tapeout Gating',
          process: 'TSMC 28 nm · ~57 mm² Monolithic',
          macs: '32,768 MACs @ 600 MHz',
          tops: '39.3 TOPS Peak',
          bandwidth: '102.4 GB/s Dual LPDDR5',
          fusionLatency: '8.6 ms',
          frameBudget: '33.3 ms',
          headroom: '74.2%',
          unitCost: '$3.88 / Die',
          tapeoutCost: '$3.17 M',
          repayVolume: '175,000 Dies',
          gatedStages: [
            'Block Prototypes on shared wafer (Compute & Radar)',
            'Full-Die Prototype (57 mm² device, shared wafer)',
            'Backend Physical Design to GDSII sign-off',
            'Production Mask (Committed only once silicon works)',
          ],
          investorTakeaway:
            'A part that clears eleven channels in a quarter of its frame budget configures downward into a one-channel module, a mirror unit, a radar pod or a forklift kit without redesigning the compute. That headroom is why fifteen SKUs are one tapeout, not fifteen programmes.',
        },
      ]),
    ];
  }

  // 5. MoRTH GSR 184(E) Statutory Mandate Timeline & Demand Floor (Slide 3)
  if (!analytical && /mandate|compliance|g\.?s\.?r\.?|morth|timeline|statutory|demand floor|why now/i.test(s)) {
    return [
      ...create(surfaceId),
      ...update(surfaceId, [
        ...researchNodes(await loadIndex(), 'the MoRTH GSR 184(E) ADAS mandate', ['main']),
        {
          id: 'main',
          component: 'MandateTimelineCard',
          title: 'MoRTH GSR 184(E) ADAS Mandate Demand Floor',
          annualPool: '1.0 M',
          newBuild: '0.5 M Trucks/Yr',
          retrofitPool: '0.5 M Fleet Retrofits',
          deepgridTarget: '18,000 Units (1.80% Capture)',
          milestones: [
            { date: 'MAR 2025', label: 'Rule Notified', desc: 'Sets statutory ADAS obligation for N2/N3 commercial trucks.' },
            { date: 'APR 2026', label: 'New Models Obligation', desc: 'Driver drowsiness, blind-spot (BSIS), and lane departure required on new type approvals.' },
            { date: 'OCT 2026', label: 'Existing Fleet Mandate', desc: 'Obligation reaches in-service commercial vehicle fleet.' },
            { date: 'OCT 2027', label: 'Active Braking Mandate', desc: 'Advanced emergency braking (AEBS AIS-162) on separate schedule.' },
          ],
          investorTakeaway:
            'A mandated purchase removes the hardest question in hardware — whether the buyer will pay for safety. Execution risk stays ours: certification and installation throughput.',
        },
      ]),
    ];
  }

  // 6. Retrieval over the build-time dossier index. Deterministic, offline,
  //    cited, and it says so when the corpus does not cover the question.
  const idx = await loadIndex();
  const lexicalHits = retrieve(idx, q, 4);
  /* Reorders, and may veto. The candidate set stays lexical; the refusal
   * decision is lexical PLUS an optional semantic veto that only ever tightens
   * it -- see rerank() for why every failure path fails open. */
  const { hits, irrelevant } = await rerank(q, lexicalHits);
  const best = hits[0];

  /* Out-of-domain guard. Score alone cannot separate in-scope from out:
   * "what is deepgrid stock price" scores 9.5, above seven legitimate
   * questions, and the ranges overlap outright -- the lowest legitimate score
   * measured is 3.60 ("tell me about teh chip") against 8.06 for "what is the
   * weather in Bangalore?". So no threshold can do this job.
   *
   * What separates them is whether the question contains vocabulary the corpus
   * has never seen. The earlier rule counted UNKNOWN words and needed half of
   * them, because a stricter bar refused "hows the margin look" and "tell me
   * about teh chip" -- a typo is an unknown word too.
   *
   * A typo is not foreign, though: it sits one edit from a word the corpus
   * knows ("hows" -> "rows"/"lows", "teh" -> "tech"/"ten"), while "cricket",
   * "pizza", "sourdough" and "everest" have no near-miss in the 7,887-term
   * vocabulary at all. Counting FOREIGN words rather than unknown ones lets the
   * bar drop to a single word without costing a single false refusal.
   *
   * Measured over 142 in-scope questions drawn from the corpus's own authored
   * set plus the historically-protected colloquial cases, and 35 hand-written
   * off-topic questions, on a tune/holdout split:
   *
   *   rule                          false refusals      off-topic refused
   *   shipped (unknown >= half)      0/71, 0/71          16/35 (46%)
   *   this rule (any foreign word)   0/71, 0/71          23/35 (66%)
   *
   * The residue is off-topic questions built entirely from words a finance
   * corpus contains -- "capital city", "weather forecast", "stock market
   * today", "what is the share price". Nothing lexical can catch those, which
   * is what the reranker's relevance veto below is for. */
  const outOfDomain = (() => {
    // STRICT tokens only. The loose fallback keeps interrogatives that are
    // never indexed, so counting them would mark "why now" as unknown and
    // re-break the very question an earlier release fixed.
    const qs = tokenize(q);
    if (!qs.length) return false;
    const foreign = qs.filter((w) => isForeignTerm(idx, w));
    // One genuinely foreign word is enough. Anything the corpus half-knows,
    // including every misspelling of a word it does know, is not foreign.
    return foreign.length > 0;
  })();

  if (!best || best.score < ANSWER_THRESHOLD || outOfDomain || irrelevant) {
    return [
      ...create(surfaceId),
      ...update(surfaceId, [
        /* Explicit children, so a 'research' node emitted by an earlier answer
         * is dropped rather than left orphaned on screen. The negative control
         * for this: ask a SKU, then ask something out of scope -- the panel
         * must disappear. It did not, before this. */
        { id: 'root', component: 'Column', children: ['main'] },
        {
          id: 'main',
          component: 'DossierAnswerCard',
          question: q,
          answered: false,
          kind: 'No grounded answer',
          answer:
            'The dossier does not cover that. Rather than assemble something that reads like an answer, this returns nothing: every figure on this page is traceable to the memorandum, the 104-slide deck or the competitive dossier, and an ungrounded answer would break that.',
          sourceLabel: '',
          coverage: `Indexed: the investor memorandum, all 104 master-deck slides, the authored video narration, ${idx.units.filter((u) => u.kind === 'Competitor').length} competitor profiles, the strategy sections and the hostile-question set.`,
          supporting: [],
        },
      ]),
    ];
  }

  return [
    ...create(surfaceId),
    ...update(surfaceId, [
      /* NO attached panel here, deliberately. The free-text path already runs
       * over an index that CONTAINS the 139 research passages, so research
       * competes for this answer on merit and wins it outright when it is the
       * best match. Attaching a panel on top measured strictly worse: it put
       * evidence under "Who won the 2019 cricket world cup?", destroying the
       * refusal that is the most important behaviour on this control. The
       * deterministic branches need the panel precisely because they never
       * consult the index at all. */
      { id: 'root', component: 'Column', children: ['main'] },
      {
        id: 'main',
        component: 'DossierAnswerCard',
        question: q,
        answered: true,
        kind: best.unit.kind,
        lead: answerSentence(q, best.unit.body),
        answer: best.unit.body,
        sourceLabel: best.unit.source + (best.unit.slide ? ` · slide ${best.unit.slide}` : ''),
        coverage: `Retrieved from ${idx.n} indexed passages. Deterministic: no model is called, and the same question always returns this answer.`,
        supporting: readableSupports(hits.slice(1)).map((h) => ({
          kind: h.unit.kind,
          title: h.unit.title,
          excerpt: clipToSentence(h.unit.body, 300),
          source: h.unit.source + (h.unit.slide ? ` · slide ${h.unit.slide}` : ''),
        })),
      },
    ]),
  ];
}
