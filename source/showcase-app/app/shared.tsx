'use client';
import {
  Cpu,
  Radio,
  ScanLine,
  ShieldCheck,
  Activity,
  Thermometer,
} from 'lucide-react';
import products from './products.json';

// Pieces every view shares: the product list, the site's sections, the six compute domains,
// the brand mark and the page header. Views import from here rather than from page.tsx.

export { products };
export type Product = (typeof products)[number];
export type Go = (hash: string, replace?: boolean) => void;

export const navigation = [
  // named for what each section covers for the business, not for its format; the route ids stay, so links hold
  ['overview', 'The opportunity'],
  ['portfolio', 'Product lines'],
  ['silicon', 'Silicon platform'],
  ['film', 'Demonstrations'],
  ['slides', 'Portfolio narrative'],
  ['investment', 'Investment case'],
  ['briefing', 'Diligence Q&A'],
] as const;

export const groups = [
  'All products',
  'Road Autonomy',
  'Silicon & Compute',
  'Fleet & Mobility',
  'Sensors & Robotics',
];

// The six compute domains on SoC2. `carries` names the business each domain serves, from the
// memorandum's die card (figure 5 of the June 2026 IM). Names are the memorandum's (IM v2, page 15); the Technology
// story's domain pills and the product pages use the same names, and scripts/check-tech-story.mjs holds them to it.
export const domains = [
  {
    code: 'A100',
    name: 'AI / ADAS processor',
    type: 'NPU',
    Icon: Cpu,
    desc: 'Parallel perception for camera feeds and edge-AI workloads. The core compute in every AD kit.',
    carries: ['ad2', 'ad0', 'ad1', 'a100-1', 'a100-2', 'a100-4'],
  },
  {
    code: 'R100',
    name: 'Radar DSP',
    type: 'DSP',
    Icon: Radio,
    desc: 'Dedicated hardware DSP for radar point clouds. Replaces the third-party radar processor.',
    carries: ['radar'],
  },
  {
    code: 'T100',
    name: 'Edge AI, thermal and LiDAR',
    type: 'AI',
    Icon: ScanLine,
    desc: 'India-tuned perception for thermal and LiDAR, and a licensable AI software stack.',
    carries: ['t100', 'thermal'],
  },
  {
    code: 'D100',
    name: 'Defence secure compute',
    type: 'SEC',
    Icon: ShieldCheck,
    desc: 'Lockstep RISC-V, AES-256 and ECC SRAM for defence, humanoid and drone systems.',
    carries: ['dhumr', 'd100'],
  },
  {
    code: 'S100',
    name: 'SDV and vehicle gateway',
    type: 'GW',
    Icon: Activity,
    desc: 'Vehicle gateway, CAN FD, telematics and over-the-air updates for fleets.',
    carries: ['taas', 'agv'],
  },
  {
    code: 'H100',
    name: 'Health AI processor',
    type: 'HLT',
    Icon: Thermometer,
    desc: 'Driver fatigue and health monitoring at under a milliwatt.',
    carries: ['h100'],
  },
] as const;

// A figure never breaks from its unit at a line end: "8.6 ms", "57 mm²", "39.3 TOPS", "₹45 Cr".
export const nb = (s: string) =>
  s.replace(
    /(\d)\s+(ms|s|MHz|GHz|mm²|mm|nm|TOPS|PFLOPS|GB\/s|TB\/s|GB|MB|W|fps|Cr|L|K|M|MACs?|tiles|cores|units|%)(?![\w²])/g,
    '$1\u00a0$2',
  );

export const productById = (id: string) => products.find((p) => p.id === id);

export function Brand() {
  return (
    <>
      <span className="brand-mark">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="wordmark">
        deepgrid<span>SEMI</span>
      </span>
    </>
  );
}

export function SectionHead({
  title,
  copy,
  kicker,
}: {
  title: string;
  copy: string;
  kicker?: string;
}) {
  return (
    <header className="section-head">
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <h1>{title}</h1>
      </div>
      <p>{copy}</p>
    </header>
  );
}

// Five DeepGrid scene renders. They are concept art, not photographs of shipped hardware, so every
// place that shows one says so. Each is published at 1376 and 760 px (public/images/scenes/).
export const scenes = {
  truck: {
    alt: 'Concept render of a DeepGrid-liveried truck on a wet highway at dusk, a camera-mirror display beside the cab',
    place: 'Highways',
    line: 'Road Autonomy',
  },
  port: {
    alt: 'Concept render of a container terminal at dusk with autonomous haulers and cranes traced in tracking overlays',
    place: 'Seaports and yards',
    line: 'Fleet & Mobility',
  },
  warehouse: {
    alt: 'Concept render of an autonomous forklift in a warehouse aisle, its LiDAR beams sweeping the racks',
    place: 'Warehouses and plants',
    line: 'Road Autonomy',
  },
  defence: {
    alt: 'Concept render of a border surveillance tower seen from an operator cabin, with tracked targets on the glass',
    place: 'Borders and bases',
    line: 'Sensors & Robotics',
  },
  die: {
    alt: 'Concept render of the DeepGrid SoC2 package on a circuit board, marked 28 nm and 39.3 TOPS',
    place: 'The chip',
    line: 'Silicon & Compute',
  },
} as const;
export type SceneId = keyof typeof scenes;

export function Scene({
  id,
  className = '',
  sizes = '(min-width: 900px) 50vw, 100vw',
  eager = false,
}: {
  id: SceneId;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  const base = './images/scenes/' + id;
  return (
    <img
      className={'scene-img ' + className}
      src={base + '-1376.webp'}
      srcSet={base + '-760.webp 760w, ' + base + '-1376.webp 1376w'}
      sizes={sizes}
      alt={scenes[id].alt}
      width={1376}
      height={768}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
