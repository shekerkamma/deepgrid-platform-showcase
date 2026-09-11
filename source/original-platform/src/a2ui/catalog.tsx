import React from 'react';
import { z } from 'zod';
import { Catalog, type ComponentApi } from '@a2ui/web_core/v0_9';
import { BASIC_FUNCTIONS } from '@a2ui/web_core/v0_9/basic_catalog';
import {
  Column,
  Row,
  Text,
  createComponentImplementation,
  type ReactComponentImplementation,
} from '@a2ui/react/v0_9';

// ─────────────────────────────────────────────────────────────────────────────
// 1. SkuExplainerCard — 4-Slide Repeatable Institutional SKU Grammar (A, B, C, D)
// ─────────────────────────────────────────────────────────────────────────────
const SkuExplainerCardApi = {
  name: 'SkuExplainerCard',
  schema: z.object({
    name: z.string(),
    surface: z.string(),
    segment: z.string(),
    asp: z.string(),
    fy32Rev: z.string(),
    share: z.string(),
    gm: z.string(),
    rank: z.string(),
    verdict: z.string(),
    what: z.string(),
    contents: z.array(z.string()),
    chain: z.array(z.string()),
    siliconRole: z.string(),
    dependency: z.string(),
    buyer: z.string(),
    channel: z.string(),
    demandPool: z.string(),
    captureRate: z.string(),
    rampUnits: z.array(z.number()),
    rampRevs: z.array(z.number()),
    fys: z.array(z.string()),
    simulatorName: z.string().optional(),
    simulatorProof: z.string().optional(),
  }).strict(),
} satisfies ComponentApi;

/* Thousands separators. The trajectory row printed raw counts -- 1400, 4000,
 * 9000, 18000 -- beside revenue that was correctly formatted as ₹450 Cr, in the
 * most scannable element on the card. Indian digit grouping is deliberate: the
 * whole dossier is in ₹ Cr and lakh. */
const num = (n: number): string => new Intl.NumberFormat('en-IN').format(n);

export const SkuExplainerCard = createComponentImplementation(SkuExplainerCardApi, ({ props }) => (
  <div className="b-card" style={{ border: '1px solid var(--rule)', borderTop: '3px solid var(--copper)', padding: '24px', background: 'var(--surface)' }}>
    {/* Header. Three columns, because the old two-column header left ~430px of
        the 1,072px card empty between the headline and the price -- and the
        verdict, which is the one thing on this card that is not repeated in a
        block below, had nowhere to sit but a paragraph nobody read. */}
    <div className="sku-head" style={{ marginBottom: '16px', borderBottom: '1px solid var(--rule)', paddingBottom: '14px' }}>
      <div className="sku-head-id">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', color: 'var(--copper)', fontFamily: 'var(--mono)', fontSize: '10px', padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>
            {String(props.surface)} · {String(props.segment)}
          </span>
          <span style={{ color: 'var(--green)', fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {String(props.gm)} Gross Margin
          </span>
        </div>
        <h3 style={{ fontSize: '1.45rem', margin: 0, color: 'var(--ink)', textWrap: 'balance' }}>{String(props.name)}</h3>
      </div>

      <div className="sku-verdict">
        <div style={{ fontFamily: 'var(--mono)', fontSize: '9.5px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '4px' }}>
          {String(props.rank)}
        </div>
        <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.5, color: 'var(--ink)', maxWidth: 'none' }}>
          {String(props.verdict)}
        </p>
      </div>

      <div className="sku-head-price">
        <div style={{ fontFamily: 'var(--mono)', fontSize: '1.35rem', color: 'var(--ink)', fontWeight: 500, whiteSpace: 'nowrap' }}>{String(props.asp)}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>{String(props.fy32Rev)} · {String(props.share)}% of total</div>
      </div>
    </div>

    {/* Section A: What it is */}
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--copper)', fontWeight: 600 }}>01</span>
        <h4 style={{ margin: 0, fontSize: '11.5px', color: 'var(--copper)', textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: 'var(--mono)' }}>What It Is & Physical Form</h4>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: 'var(--ink-mid)', lineHeight: 1.5 }}>{String(props.what)}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px' }}>
        {(props.contents as unknown as string[]).map((item, idx) => (
          <div key={idx} style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '7px 10px', fontSize: '12px', color: 'var(--ink-muted)' }}>
            <span style={{ color: 'var(--copper)', fontFamily: 'var(--mono)', fontWeight: 600, marginRight: '6px' }}>0{idx + 1}</span> {String(item)}
          </div>
        ))}
      </div>
    </div>

    {/* Section B: How it works (4-Stage Signal Chain) */}
    <div style={{ marginBottom: '18px', background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--cyan-text)', fontWeight: 600 }}>02</span>
        <h4 style={{ margin: 0, fontSize: '11.5px', color: 'var(--cyan-text)', textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: 'var(--mono)' }}>Signal Pipeline (Sense → Compute → Decide → Act)</h4>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '6px', marginBottom: '10px' }}>
        {(props.chain as unknown as string[]).map((step, idx) => {
          const labels = ['SENSE', 'COMPUTE', 'DECIDE', 'ACT'];
          return (
            <div key={idx} style={{ background: 'var(--surface)', border: '1px solid var(--rule)', padding: '8px 10px' }}>
              <div style={{ color: 'var(--copper)', fontSize: '9.5px', fontFamily: 'var(--mono)', letterSpacing: '.08em', marginBottom: '3px' }}>STAGE {idx + 1}: {labels[idx]}</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-mid)', lineHeight: 1.4 }}>{String(step)}</div>
            </div>
          );
        })}
      </div>
      {props.siliconRole && (
        <div style={{ fontSize: '12px', color: 'var(--ink-muted)', borderTop: '1px solid var(--rule)', paddingTop: '8px' }}>
          <strong style={{ color: 'var(--ink)' }}>SoC2 Execution Role:</strong> {String(props.siliconRole)}
        </div>
      )}
    </div>

    {/* Section C: Target Buyer & TAM */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
      <div style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '12px' }}>
        <h4 style={{ margin: '0 0 6px', fontSize: '10.5px', color: 'var(--ink-muted)', textTransform: 'uppercase', fontFamily: 'var(--mono)', letterSpacing: '.08em' }}>Target Buyer & Channel</h4>
        <p style={{ margin: '0 0 4px', fontSize: '12.5px', color: 'var(--ink)' }}><strong>Buyer:</strong> {String(props.buyer)}</p>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-muted)' }}><strong>Channel:</strong> {String(props.channel)}</p>
      </div>
      <div style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '12px' }}>
        <h4 style={{ margin: '0 0 6px', fontSize: '10.5px', color: 'var(--ink-muted)', textTransform: 'uppercase', fontFamily: 'var(--mono)', letterSpacing: '.08em' }}>Demand Pool & TAM Capture</h4>
        <p style={{ margin: '0 0 4px', fontSize: '12.5px', color: 'var(--copper)' }}><strong>Demand Pool:</strong> {String(props.demandPool)}</p>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-muted)' }}><strong>FY32 Capture Rate:</strong> {String(props.captureRate)}</p>
      </div>
    </div>

    {/* Section D: 6-Year Ramp */}
    <div style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '14px', marginBottom: props.simulatorName ? '14px' : 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '10.5px', color: 'var(--copper)', textTransform: 'uppercase', fontFamily: 'var(--mono)', letterSpacing: '.08em' }}>FY27–FY32 Financial & Volume Trajectory</h4>
        <span style={{ fontSize: '10.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)' }}>Direct-Labelled Projection</span>
      </div>
      
      {/* 6-Year Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '10px' }}>
        {(props.fys as unknown as string[]).map((fy, idx) => (
          <div key={idx} style={{ background: 'var(--surface)', padding: '6px 4px', border: '1px solid var(--rule)' }}>
            <div style={{ fontSize: '9.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)' }}>{String(fy)}</div>
            <div style={{ fontSize: '11.5px', fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--ink)' }}>{num(Number((props.rampUnits as unknown as number[])[idx]))}</div>
            <div style={{ fontSize: '10.5px', fontFamily: 'var(--mono)', color: 'var(--copper)' }}>₹{num(Number((props.rampRevs as unknown as number[])[idx]))} Cr</div>
          </div>
        ))}
      </div>

      <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--flag)' }}>
        <strong>Dependencies:</strong> {String(props.dependency)}
      </p>
    </div>

    {/* Section E: Live Demonstrator (Optional) */}
    {props.simulatorName && (
      <div style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule-strong)', padding: '12px', marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ background: 'var(--rule-strong)', color: 'var(--ink)', fontFamily: 'var(--mono)', fontSize: '9px', padding: '1px 5px', textTransform: 'uppercase' }}>SIMULATOR</span>
          <strong style={{ color: 'var(--ink)', fontSize: '12px' }}>{String(props.simulatorName)}</strong>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.45 }}>{String(props.simulatorProof)}</p>
      </div>
    )}
  </div>
));

// ─────────────────────────────────────────────────────────────────────────────
// 2. PortfolioMatrixCard — 15-SKU Ranked Portfolio (Slide 6)
// ─────────────────────────────────────────────────────────────────────────────
const PortfolioMatrixCardApi = {
  name: 'PortfolioMatrixCard',
  schema: z.object({
    title: z.string(),
    totalRevenue: z.string(),
    skus: z.array(z.object({
      name: z.string(),
      asp: z.string(),
      rev: z.string(),
      share: z.string(),
      gm: z.string(),
      surface: z.string(),
      firstLaunch: z.string(),
    })),
  }).strict(),
} satisfies ComponentApi;

export const PortfolioMatrixCard = createComponentImplementation(PortfolioMatrixCardApi, ({ props }) => (
  <div className="b-card" style={{ border: '1px solid var(--rule)', borderTop: '3px solid var(--copper)', padding: '24px', background: 'var(--surface)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--rule)', paddingBottom: '12px' }}>
      <div>
        <span style={{ color: 'var(--copper)', fontFamily: 'var(--mono)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.12em' }}>MASTER DECK · SLIDE 06</span>
        <h3 style={{ fontSize: '1.35rem', margin: '2px 0 0', color: 'var(--ink)' }}>{String(props.title)}</h3>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '1.35rem', color: 'var(--copper)', fontWeight: 500 }}>{String(props.totalRevenue)}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10.5px', color: 'var(--ink-muted)' }}>FY2032 Group Revenue</div>
      </div>
    </div>

    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)', color: 'var(--ink-muted)', fontFamily: 'var(--mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            <th style={{ padding: '8px 6px' }}>SKU Product Line</th>
            <th style={{ padding: '8px 6px' }}>Surface</th>
            <th style={{ padding: '8px 6px' }}>Unit ASP</th>
            <th style={{ padding: '8px 6px' }}>FY32 Rev</th>
            <th style={{ padding: '8px 6px' }}>Share</th>
            <th style={{ padding: '8px 6px' }}>GM</th>
            <th style={{ padding: '8px 6px' }}>Launch</th>
          </tr>
        </thead>
        <tbody>
          {(props.skus as unknown as Array<{ name: string; surface: string; asp: string; rev: string; share: string; gm: string; firstLaunch: string }>).map((sku, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid var(--rule)' }}>
              <td style={{ padding: '8px 6px', color: 'var(--ink)', fontWeight: 500 }}>{sku.name}</td>
              <td style={{ padding: '8px 6px', color: 'var(--ink-muted)' }}>{sku.surface}</td>
              <td style={{ padding: '8px 6px', fontFamily: 'var(--mono)', color: 'var(--ink)' }}>{sku.asp}</td>
              <td style={{ padding: '8px 6px', fontFamily: 'var(--mono)', color: 'var(--copper)', fontWeight: 500 }}>{sku.rev}</td>
              <td style={{ padding: '8px 6px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)' }}>{sku.share}</td>
              <td style={{ padding: '8px 6px', fontFamily: 'var(--mono)', color: 'var(--green)', fontWeight: 500 }}>{sku.gm}</td>
              <td style={{ padding: '8px 6px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)' }}>{sku.firstLaunch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

// ─────────────────────────────────────────────────────────────────────────────
// 3. SiliconSpecCard — Monolithic SoC2 Silicon Architecture (Slide 5 & 4)
// ─────────────────────────────────────────────────────────────────────────────
const SiliconSpecCardApi = {
  name: 'SiliconSpecCard',
  schema: z.object({
    title: z.string(),
    process: z.string(),
    macs: z.string(),
    tops: z.string(),
    bandwidth: z.string(),
    fusionLatency: z.string(),
    frameBudget: z.string(),
    headroom: z.string(),
    unitCost: z.string(),
    tapeoutCost: z.string(),
    repayVolume: z.string(),
    gatedStages: z.array(z.string()),
    investorTakeaway: z.string(),
  }).strict(),
} satisfies ComponentApi;

export const SiliconSpecCard = createComponentImplementation(SiliconSpecCardApi, ({ props }) => (
  <div className="b-card" style={{ border: '1px solid var(--rule)', borderTop: '3px solid var(--copper)', padding: '24px', background: 'var(--surface)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--rule)', paddingBottom: '12px' }}>
      <div>
        <span style={{ color: 'var(--copper)', fontFamily: 'var(--mono)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.12em' }}>MASTER DECK · SLIDE 04 & 05</span>
        <h3 style={{ fontSize: '1.35rem', margin: '2px 0 0', color: 'var(--ink)' }}>{String(props.title)}</h3>
      </div>
      <div style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', color: 'var(--copper)', padding: '3px 8px', fontFamily: 'var(--mono)', fontSize: '10.5px' }}>
        {String(props.headroom)} Frame Margin
      </div>
    </div>

    {/* Metric Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '18px' }}>
      <div style={{ background: 'var(--surface-sunk)', padding: '10px 12px', border: '1px solid var(--rule)' }}>
        <div style={{ fontSize: '9.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>PROCESS & DIE</div>
        <div style={{ fontSize: '13px', fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--ink)' }}>{String(props.process)}</div>
      </div>
      <div style={{ background: 'var(--surface-sunk)', padding: '10px 12px', border: '1px solid var(--rule)' }}>
        <div style={{ fontSize: '9.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>COMPUTE MATRIX</div>
        <div style={{ fontSize: '13px', fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--copper)' }}>{String(props.macs)} ({String(props.tops)})</div>
      </div>
      <div style={{ background: 'var(--surface-sunk)', padding: '10px 12px', border: '1px solid var(--rule)' }}>
        <div style={{ fontSize: '9.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>MEMORY BANDWIDTH</div>
        <div style={{ fontSize: '13px', fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--ink)' }}>{String(props.bandwidth)}</div>
      </div>
      <div style={{ background: 'var(--surface-sunk)', padding: '10px 12px', border: '1px solid var(--rule)' }}>
        <div style={{ fontSize: '9.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>11-CH FUSION TIME</div>
        <div style={{ fontSize: '13px', fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--green)' }}>{String(props.fusionLatency)} / {String(props.frameBudget)}</div>
      </div>
      <div style={{ background: 'var(--surface-sunk)', padding: '10px 12px', border: '1px solid var(--rule)' }}>
        <div style={{ fontSize: '9.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>UNIT DIE COST</div>
        <div style={{ fontSize: '13px', fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--ink)' }}>{String(props.unitCost)} (@ {String(props.repayVolume)})</div>
      </div>
      <div style={{ background: 'var(--surface-sunk)', padding: '10px 12px', border: '1px solid var(--rule)' }}>
        <div style={{ fontSize: '9.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>PROGRAMME COST</div>
        <div style={{ fontSize: '13px', fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--ink)' }}>{String(props.tapeoutCost)}</div>
      </div>
    </div>

    {/* 4 Gated Stages */}
    <div style={{ marginBottom: '16px' }}>
      <h4 style={{ color: 'var(--ink-muted)', fontSize: '10.5px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 8px' }}>4 Gated Stages to Production Mask</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px' }}>
        {(props.gatedStages as unknown as string[]).map((st, i) => (
          <div key={i} style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '8px 10px', fontSize: '12px', color: 'var(--ink-mid)' }}>
            <span style={{ color: 'var(--copper)', fontFamily: 'var(--mono)', fontWeight: 600, marginRight: '6px' }}>Stage {i + 1}:</span> {String(st)}
          </div>
        ))}
      </div>
    </div>

    <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', borderLeft: '2px solid var(--copper)', paddingLeft: '12px', fontStyle: 'italic' }}>
      "{String(props.investorTakeaway)}"
    </div>
  </div>
));

// ─────────────────────────────────────────────────────────────────────────────
// 4. MandateTimelineCard — MoRTH GSR 184(E) Demand Floor (Slide 3)
// ─────────────────────────────────────────────────────────────────────────────
const MandateTimelineCardApi = {
  name: 'MandateTimelineCard',
  schema: z.object({
    title: z.string(),
    annualPool: z.string(),
    newBuild: z.string(),
    retrofitPool: z.string(),
    deepgridTarget: z.string(),
    milestones: z.array(z.object({
      date: z.string(),
      label: z.string(),
      desc: z.string(),
    })),
    investorTakeaway: z.string(),
  }).strict(),
} satisfies ComponentApi;

export const MandateTimelineCard = createComponentImplementation(MandateTimelineCardApi, ({ props }) => (
  <div className="b-card" style={{ border: '1px solid var(--rule)', borderTop: '3px solid var(--green)', padding: '24px', background: 'var(--surface)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--rule)', paddingBottom: '12px' }}>
      <div>
        <span style={{ color: 'var(--green)', fontFamily: 'var(--mono)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.12em' }}>MASTER DECK · SLIDE 03</span>
        <h3 style={{ fontSize: '1.35rem', margin: '2px 0 0', color: 'var(--ink)' }}>{String(props.title)}</h3>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '1.35rem', color: 'var(--green)', fontWeight: 500 }}>{String(props.annualPool)}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10.5px', color: 'var(--ink-muted)' }}>Annual Scope (Trucks/Yr)</div>
      </div>
    </div>

    {/* Metric Bar */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
      <div style={{ background: 'var(--surface-sunk)', padding: '10px 12px', border: '1px solid var(--rule)' }}>
        <div style={{ fontSize: '9.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)' }}>NEW BUILD OEM ANNUALLY</div>
        <div style={{ fontSize: '13.5px', fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--ink)' }}>{String(props.newBuild)}</div>
      </div>
      <div style={{ background: 'var(--surface-sunk)', padding: '10px 12px', border: '1px solid var(--rule)' }}>
        <div style={{ fontSize: '9.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)' }}>IN-SERVICE RETROFIT POOL</div>
        <div style={{ fontSize: '13.5px', fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--ink)' }}>{String(props.retrofitPool)}</div>
      </div>
      <div style={{ background: 'var(--surface-sunk)', padding: '10px 12px', border: '1px solid var(--rule)' }}>
        <div style={{ fontSize: '9.5px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)' }}>DEEPGRID FY32 TARGET</div>
        <div style={{ fontSize: '13.5px', fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--copper)' }}>{String(props.deepgridTarget)}</div>
      </div>
    </div>

    {/* Timeline Steps */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '16px' }}>
      {(props.milestones as unknown as Array<{ date: string; label: string; desc: string }>).map((m, i) => (
        <div key={i} style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '10px 12px' }}>
          <div style={{ color: 'var(--green)', fontSize: '10.5px', fontFamily: 'var(--mono)', fontWeight: 600, marginBottom: '2px' }}>{m.date}</div>
          <div style={{ color: 'var(--ink)', fontSize: '12.5px', fontWeight: 500, marginBottom: '4px' }}>{m.label}</div>
          <div style={{ color: 'var(--ink-muted)', fontSize: '11.5px', lineHeight: 1.4 }}>{m.desc}</div>
        </div>
      ))}
    </div>

    <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', borderLeft: '2px solid var(--green)', paddingLeft: '12px', fontStyle: 'italic' }}>
      "{String(props.investorTakeaway)}"
    </div>
  </div>
));

// ─────────────────────────────────────────────────────────────────────────────
// 5. DeckSynthesisCard — Institutional Deck Synthesis
// ─────────────────────────────────────────────────────────────────────────────
const DeckSynthesisCardApi = {
  name: 'DeckSynthesisCard',
  schema: z.object({
    question: z.string(),
    bluf: z.string(),
    keyMetrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
      context: z.string(),
    })),
    deckEvidence: z.string(),
    portfolioRole: z.string(),
    dependencies: z.string(),
    referencedSlides: z.array(z.object({
      slide: z.number(),
      title: z.string(),
      url: z.string(),
    })),
  }).strict(),
} satisfies ComponentApi;

export const DeckSynthesisCard = createComponentImplementation(DeckSynthesisCardApi, ({ props }) => (
  <div className="b-card" style={{ border: '1px solid var(--rule)', borderTop: '3px solid var(--copper)', padding: '24px', background: 'var(--surface)' }}>
    {/* Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--rule)', paddingBottom: '12px' }}>
      <div>
        <span style={{ color: 'var(--copper)', fontFamily: 'var(--mono)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.12em' }}>
          INSTITUTIONAL DECK INTELLIGENCE
        </span>
        <h3 style={{ fontSize: '1.3rem', margin: '2px 0 0', color: 'var(--ink)' }}>{String(props.question)}</h3>
      </div>
      <div style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '3px 8px', fontFamily: 'var(--mono)', fontSize: '10.5px', color: 'var(--ink-muted)' }}>
        104 Slides Grounded
      </div>
    </div>

    {/* BLUF Box */}
    <div style={{ background: 'var(--surface-sunk)', borderLeft: '3px solid var(--copper)', padding: '12px 14px', marginBottom: '16px' }}>
      <h4 style={{ color: 'var(--copper)', fontSize: '10.5px', fontFamily: 'var(--mono)', textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '.08em' }}>Executive Takeaway (BLUF)</h4>
      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-mid)', lineHeight: 1.5 }}>{String(props.bluf)}</p>
    </div>

    {/* Verified Key Metrics */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '16px' }}>
      {(props.keyMetrics as unknown as Array<{ label: string; value: string; context: string }>).map((km, i) => (
        <div key={i} style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '10px 12px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--ink-muted)', marginBottom: '2px' }}>{km.label}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '1.25rem', color: 'var(--ink)', fontWeight: 500, marginBottom: '2px' }}>{km.value}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)', lineHeight: 1.35 }}>{km.context}</div>
        </div>
      ))}
    </div>

    {/* Detailed Evidence & Implications */}
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '14px' }}>
      <div style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '12px' }}>
        <h4 style={{ color: 'var(--ink)', fontSize: '10.5px', fontFamily: 'var(--mono)', textTransform: 'uppercase', margin: '0 0 6px' }}>Technical Grounding</h4>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-mid)', lineHeight: 1.5 }}>{String(props.deckEvidence)}</p>
      </div>
      <div style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '12px' }}>
        <h4 style={{ color: 'var(--copper)', fontSize: '10.5px', fontFamily: 'var(--mono)', textTransform: 'uppercase', margin: '0 0 6px' }}>Dependencies</h4>
        <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--ink-mid)', lineHeight: 1.5 }}><strong>Role:</strong> {String(props.portfolioRole)}</p>
        <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--flag)', lineHeight: 1.45 }}><strong>Depends on:</strong> {String(props.dependencies)}</p>
      </div>
    </div>

    {/* Cited Master Slides */}
    {props.referencedSlides && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--rule)', paddingTop: '10px' }}>
        <span style={{ fontSize: '10.5px', color: 'var(--ink-muted)', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>Referenced Slides:</span>
        {(props.referencedSlides as unknown as Array<{ slide: number; title: string; url: string }>).map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: '11.5px', color: 'var(--copper)', textDecoration: 'none', background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '2px 8px', fontFamily: 'var(--mono)' }}>
            Slide {s.slide}: {s.title} ↗
          </a>
        ))}
      </div>
    )}
  </div>
));

// ─────────────────────────────────────────────────────────────────────────────
// 6. SlideViewerCard — Exact Slide Inspector
// ─────────────────────────────────────────────────────────────────────────────
const SlideViewerCardApi = {
  name: 'SlideViewerCard',
  schema: z.object({
    slide: z.number(),
    title: z.string(),
    tag: z.string().optional(),
    script: z.string(),
  }).strict(),
} satisfies ComponentApi;

export const SlideViewerCard = createComponentImplementation(SlideViewerCardApi, ({ props }) => (
  <div className="b-card" style={{ border: '1px solid var(--rule)', display: 'grid', gridTemplateColumns: 'minmax(280px, 1.1fr) 1fr', gap: '18px', background: 'var(--surface)' }}>
    <div style={{ background: 'var(--surface-sunk)', overflow: 'hidden', border: '1px solid var(--rule)', alignSelf: 'start' }}>
      <img
        /* The site is served from /content-ideas/deepgrid-platform/, and vite is
           configured with base './'. An absolute '/slides/...' therefore resolved
           against the DOMAIN root and 404'd on every slide: "show slide 19"
           rendered a broken image beside the text. Probe:
             /slides/slide_19.png                              -> 404
             /content-ideas/deepgrid-platform/slides/slide_19.png -> 200 */
        src={`${import.meta.env.BASE_URL}slides/slide_${String(props.slide).padStart(2, '0')}.png`}
        alt={`Slide ${props.slide}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', color: 'var(--copper)', fontFamily: 'var(--mono)', fontSize: '10px', padding: '2px 6px', textTransform: 'uppercase' }}>
          SLIDE {String(props.slide).padStart(2, '0')}
        </span>
        {/* `tag` in master_deck_indexed.json is authoring metadata -- values like
            "carried · old block 19" -- so editorial bookkeeping is filtered out
            rather than shown to an investor. */}
        {props.tag && !/^(carried|old block|new|moved|dupe|cut)\b|old block/i.test(String(props.tag))
          && <span style={{ color: 'var(--ink-muted)', fontSize: '11.5px', fontFamily: 'var(--mono)' }}>{String(props.tag)}</span>}
      </div>
      <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px', color: 'var(--ink)' }}>{String(props.title)}</h3>
      
      {/* The raw slide text used to sit here, in a scrolling grey pane beside
          the slide image. It was the flattened OCR of the very picture next to
          it, footer and page number included. The image is the slide; the
          narration below is what the image cannot say. The dump was neither. */}

      <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5, fontStyle: 'italic', borderLeft: '2px solid var(--copper)', paddingLeft: '10px' }}>
        "{String(props.script)}"
      </div>
    </div>
  </div>
));

// ─────────────────────────────────────────────────────────────────────────────
// The Catalog
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
/* Source passages are markdown flattened into one string, so the panel was
 * printing list bullets inline as stray hyphens -- "...= 1.8% - On the sheet's
 * dominant basis: ..." reads as a run-on sentence with punctuation damage. It
 * also let a lone straight quote through before "TAM.
 *
 * This is deliberately not a markdown library: the corpus only ever produces
 * three shapes -- a leading "- " bullet, **bold**, and prose -- and pulling a
 * parser into the bundle to handle three shapes would cost more than it earns. */
const smartQuotes = (s: string): string =>
  s.replace(/"([^"]*)"/g, '\u201c$1\u201d').replace(/(\w)'(\w)/g, '$1\u2019$2');

const inlineBold = (s: string, k: string): React.ReactNode[] =>
  smartQuotes(s).split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <b key={`${k}-b${i}`} style={{ color: 'var(--ink)' }}>{part}</b>
      : <React.Fragment key={`${k}-t${i}`}>{part}</React.Fragment>);

const PassageBody: React.FC<{ text: string; size?: string; color?: string }> =
  ({ text, size = '14.5px', color = 'var(--ink)' }) => {
  // split on a bullet that begins a line OR follows sentence-ending punctuation
  const parts = String(text).split(/\s+-\s+(?=[A-Z0-9"\u201c])/g).map((s) => s.trim()).filter(Boolean);
  const [lead, ...bullets] = parts;
  return (
    <>
      <p style={{ margin: 0, fontSize: size, lineHeight: 1.62, color, maxWidth: 'none' }}>
        {inlineBold(lead, 'lead')}
      </p>
      {bullets.length > 0 && (
        <ul style={{ margin: '10px 0 0', paddingLeft: '18px', display: 'grid', gap: '6px' }}>
          {bullets.map((bp, i) => (
            <li key={i} style={{ fontSize: size, lineHeight: 1.55, color, maxWidth: 'none' }}>
              {inlineBold(bp, `b${i}`)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

// 6. DossierAnswerCard — retrieval answer with its citation
// ─────────────────────────────────────────────────────────────────────────────
const DossierAnswerCardApi = {
  name: 'DossierAnswerCard',
  schema: z.object({
    question: z.string(),
    answered: z.boolean(),
    kind: z.string(),
    lead: z.string().optional(),
    answer: z.string(),
    sourceLabel: z.string(),
    coverage: z.string(),
    supporting: z.array(z.object({
      kind: z.string(),
      title: z.string(),
      excerpt: z.string(),
      source: z.string(),
    })),
  }).strict(),
} satisfies ComponentApi;

export const DossierAnswerCard = createComponentImplementation(DossierAnswerCardApi, ({ props }) => {
  const answered = Boolean(props.answered);
  const supporting = (props.supporting ?? []) as { kind: string; title: string; excerpt: string; source: string }[];
  return (
    <div className="b-card" style={{ border: '1px solid var(--rule)', borderTop: `3px solid ${answered ? 'var(--copper)' : 'var(--rule-strong)'}`, padding: '24px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', marginBottom: '14px', borderBottom: '1px solid var(--rule)', paddingBottom: '12px' }}>
        <div>
          <span style={{ color: answered ? 'var(--copper)' : 'var(--ink-muted)', fontFamily: 'var(--mono)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.12em' }}>
            {answered ? 'Grounded answer' : 'Not in the dossier'}
          </span>
          <h3 style={{ fontSize: '1.22rem', margin: '3px 0 0', color: 'var(--ink)', fontFamily: 'var(--serif)' }}>{String(props.question)}</h3>
        </div>
        {answered && (
          <span style={{ background: 'var(--surface-sunk)', border: '1px solid var(--rule)', padding: '3px 9px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink-mid)', whiteSpace: 'nowrap' }}>
            {String(props.kind)}
          </span>
        )}
      </div>

      {/* The answering sentence, lifted out of the passage. A chunk begins
          where the document was cut, so its first line is often a back-reference
          ("That is a modelling choice worth crediting...") while the sentence
          the reader asked for sits fifth. Promote it; keep the passage under it
          so the argument around it survives. */}
      {props.lead ? (
        <>
          <p style={{
            margin: '0 0 14px', fontSize: '16.5px', lineHeight: 1.5, color: 'var(--ink)',
            fontFamily: 'var(--serif)', maxWidth: 'none',
            borderLeft: '3px solid var(--copper)', paddingLeft: '14px',
          }}>
            {String(props.lead)}
          </p>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '9.5px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: '6px' }}>
            In the passage it came from
          </span>
        </>
      ) : null}
      <PassageBody text={String(props.answer)} size={props.lead ? '13.5px' : '14.5px'} color={props.lead ? 'var(--ink-mid)' : 'var(--ink)'} />

      {answered && String(props.sourceLabel) && (
        <p style={{ margin: '10px 0 0', fontFamily: 'var(--mono)', fontSize: '10.5px', letterSpacing: '.06em', color: 'var(--copper)' }}>
          Source · {String(props.sourceLabel)}
        </p>
      )}

      {supporting.length > 0 && (
        <div style={{ marginTop: '18px', borderTop: '1px solid var(--rule)', paddingTop: '14px' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: '10px' }}>
            Also matched
          </span>
          <div style={{ display: 'grid', gap: '10px' }}>
            {supporting.map((sup, i) => (
              <div key={i} style={{ borderLeft: '2px solid var(--rule-strong)', paddingLeft: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ink-muted)' }}>{sup.kind}</span>
                  <b style={{ fontSize: '12.5px', color: 'var(--ink)' }}>{sup.title}</b>
                </div>
                <div style={{ margin: '3px 0 0' }}>
                  <PassageBody text={sup.excerpt} size="12.5px" color="var(--ink-mid)" />
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '9.5px', color: 'var(--ink-muted)' }}>{sup.source}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ margin: '16px 0 0', paddingTop: '10px', borderTop: '1px solid var(--rule)', fontFamily: 'var(--mono)', fontSize: '10px', lineHeight: 1.5, color: 'var(--ink-muted)' }}>
        {String(props.coverage)}
      </p>
    </div>
  );
});

export const deepgridCatalog = new Catalog<ReactComponentImplementation>(
  'https://deepgrid.local/catalogs/v0_9/catalog.json',
  [
    SkuExplainerCard,
    PortfolioMatrixCard,
    SiliconSpecCard,
    MandateTimelineCard,
    DeckSynthesisCard,
    DossierAnswerCard,
    SlideViewerCard,
    Text,
    Column,
    Row
  ],
  BASIC_FUNCTIONS,
);
