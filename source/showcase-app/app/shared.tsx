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
  ['overview', 'Overview'],
  ['portfolio', 'Products'],
  ['silicon', 'Technology'],
  ['briefing', 'Ask DeepGrid'],
  ['film', 'Videos'],
  ['slides', 'Slide deck'],
  ['investment', 'Investment'],
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
