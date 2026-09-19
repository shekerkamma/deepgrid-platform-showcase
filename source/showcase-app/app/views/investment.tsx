'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Download, Minus, Plus } from 'lucide-react';
import { SectionHead, type Go } from '../shared';
import { reportHtml } from '../report-content';
import UseCases from '../use-cases';
import Related from '../related';
import {
  round,
  useOfFunds,
  years,
  revenue,
  ebitda,
  closingCash,
  milestones,
  risks,
  documents,
} from '../data/investment';

// Investment: the round and where it goes, the revenue ramp from both workbooks, the eighteen
// months the money buys, what to test, and the documents behind every figure. The full
// memorandum stays one click away.

export const chapters = [
  ['', 'Investment overview'],
  ['summary', 'Executive summary'],
  ['business', 'Business'],
  ['technology', 'Technology'],
  ['usecases', 'Use cases'],
  ['choice', 'Strategy & economics'],
  ['numbers', 'Financials & risks'],
];

const cr = (n: number) =>
  '₹' +
  n.toLocaleString('en-IN', { maximumFractionDigits: n < 100 ? 1 : 0 }) +
  ' Cr';

export default function Investment({
  chapter,
  usecase,
  params,
  setChapter,
  update,
  go,
}: {
  chapter: string;
  usecase: string;
  params: URLSearchParams;
  setChapter: (id: string) => void;
  update: (c: Record<string, string | undefined>, replace?: boolean) => void;
  go: Go;
}) {
  const report = !!chapter;
  return (
    <section
      className={'page-wrap investment-page' + (report ? ' has-chapter' : '')}
    >
      <SectionHead
        title="The round, what it buys, and what to test"
        copy="A pre-Series A raise to take SoC2 from a working FPGA to qualified silicon. Every figure below comes from a document you can download at the end of the page."
      />

      <section
        className="inv-block inv-round"
        aria-labelledby="inv-round-title"
      >
        <div className="inv-round-figures">
          <h2 id="inv-round-title" className="sr-only">
            The round
          </h2>
          <dl>
            <div>
              <dt>Equity</dt>
              <dd className="num">{cr(round.equity)}</dd>
            </div>
            <div>
              <dt>Pre-money</dt>
              <dd className="num">{cr(round.preMoney)}</dd>
            </div>
            <div>
              <dt>Investor stake</dt>
              <dd className="num">{round.stake}</dd>
            </div>
            <div>
              <dt>CGTMSE loan</dt>
              <dd className="num">{cr(round.debt)}</dd>
            </div>
          </dl>
        </div>
        <div className="inv-funds">
          <h3>Where the ₹55&nbsp;Cr goes</h3>
          <div
            className="funds-bar"
            role="img"
            aria-label={useOfFunds
              .map((u) => `${u.label} ${cr(u.cr)}`)
              .join(', ')}
          >
            {useOfFunds.map((u, i) => (
              <span
                key={u.label}
                className={'seg seg-' + i}
                style={{ flexGrow: u.cr }}
              />
            ))}
          </div>
          <ol className="funds-legend">
            {useOfFunds.map((u, i) => (
              <li key={u.label}>
                <i className={'seg seg-' + i} aria-hidden="true" />
                <span>
                  <strong>{u.label}</strong>
                  <small>{u.note}</small>
                </span>
                <span className="num">
                  {cr(u.cr)}
                  <small>{Math.round((u.cr / round.total) * 100)}%</small>
                </span>
              </li>
            ))}
          </ol>
          <p className="ov-source">
            Source: Financial model v3, Use of Funds. The business plan carries
            the same allocation.
          </p>
        </div>
      </section>

      <section className="inv-block" aria-labelledby="inv-ramp-title">
        <header className="inv-head">
          <h2 id="inv-ramp-title">Revenue ramp, as two documents state it</h2>
          <p>
            The financial model and the business plan agree on the shape and
            disagree on the size. The site&rsquo;s product figures follow the
            financial model. EBITDA turns positive in FY2028 and cash bottoms at{' '}
            {cr(closingCash[2])} in FY2029 without drawing the loan.
          </p>
        </header>
        <RampChart />
        <div
          className="table-scroll"
          tabIndex={0}
          aria-label="Revenue, EBITDA and closing cash by year"
        >
          <table className="compare-table inv-table">
            <thead>
              <tr>
                <th scope="col">₹ Cr</th>
                {years.map((y) => (
                  <th scope="col" className="num" key={y}>
                    {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Revenue, financial model', revenue.fm],
                ['Revenue, business plan', revenue.bp],
                ['EBITDA, financial model', ebitda],
                ['Closing cash, financial model', closingCash],
              ].map(([label, row]) => (
                <tr key={label as string}>
                  <th scope="row">{label as string}</th>
                  {(row as number[]).map((v, i) => (
                    <td className="num" key={i}>
                      {v.toLocaleString('en-IN', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ov-source">
          Management projections. Financial model v3 (September 2026): Revenue
          Build, P&amp;L, Cash Flow &amp; Runway. Business plan v2: P&amp;L.
        </p>
      </section>

      <section className="inv-block" aria-labelledby="inv-ms-title">
        <header className="inv-head">
          <h2 id="inv-ms-title">What the next eighteen months deliver</h2>
          <p>
            The milestones the memorandum commits to after the raise. The
            tapeout money itself is paid in four stages, and each can be
            withheld if the one before it fails.
          </p>
        </header>
        <ol className="inv-milestones">
          {milestones.map((m) => (
            <li key={m.when}>
              <p className="num">{m.when}</p>
              <h3>{m.title}</h3>
              <ul>
                {m.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className="ov-source">
          Source: Information Memorandum, June 2026, section 12.
        </p>
      </section>

      <section className="inv-block inv-risks" aria-labelledby="inv-risk-title">
        <header className="inv-head">
          <h2 id="inv-risk-title">What diligence should test</h2>
        </header>
        <ul>
          {risks.map((r) => (
            <li key={r.title}>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="inv-block" aria-labelledby="inv-docs-title">
        <header className="inv-head">
          <h2 id="inv-docs-title">The documents behind the figures</h2>
        </header>
        <ul className="inv-docs">
          {documents.map(([file, title, date, type, size]) => (
            <li key={file}>
              <a href={'./downloads/showcase/' + file} download>
                <span>
                  <strong>{title}</strong>
                  <small>{date}</small>
                </span>
                <span className="num">
                  {type} · {size}
                </span>
                <Download size={16} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="report-toggle">
        <div>
          <h3>The full investment memorandum</h3>
          <p>
            Business, technology, markets, strategic choices, economics and
            risk, chapter by chapter.
          </p>
        </div>
        <button
          className="primary"
          onClick={() => setChapter(report ? '' : 'summary')}
          aria-expanded={report}
        >
          {report ? 'Close the memorandum' : 'Read the memorandum'}{' '}
          {report ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </div>
      {report && (
        <>
          <nav className="chapter-navigation" aria-label="Memorandum chapters">
            {chapters.slice(1).map(([id, title]) => (
              <button
                key={id}
                onClick={() => setChapter(id)}
                aria-current={chapter === id ? 'page' : undefined}
              >
                {title}
              </button>
            ))}
          </nav>
          {chapter === 'usecases' ? (
            <UseCases
              go={go}
              selected={usecase}
              onSelect={(id) => {
                update({ usecase: id || undefined }, false);
                requestAnimationFrame(() =>
                  document
                    .querySelector('.usecase-explorer')
                    ?.scrollIntoView({ block: 'start' }),
                );
              }}
              onProducts={(category) =>
                go(
                  'portfolio?category=' +
                    encodeURIComponent(category) +
                    '&from=' +
                    encodeURIComponent('investment?' + params.toString()),
                )
              }
            />
          ) : (
            <InvestmentRecord
              chapter={chapter}
              onChapter={setChapter}
              go={go}
            />
          )}
        </>
      )}
    </section>
  );
}

// A line chart of both revenue series, labelled at the line ends rather than with a legend.
function RampChart() {
  const W = 1100,
    H = 340,
    L = 52,
    R = 200,
    T = 14,
    B = 34;
  const max = 1400,
    x = (i: number) => L + (i * (W - L - R)) / (years.length - 1),
    y = (v: number) => T + (1 - v / max) * (H - T - B);
  const path = (s: number[]) =>
    s
      .map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1))
      .join(' ');
  return (
    <figure className="ramp-chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Revenue FY2027 to FY2032: financial model rises to ₹1,128 Cr, business plan to ₹1,388 Cr"
      >
        {[0, 350, 700, 1050, 1400].map((g) => (
          <g key={g}>
            <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} className="grid" />
            <text x={L - 10} y={y(g) + 4} textAnchor="end" className="tick">
              {g.toLocaleString('en-IN')}
            </text>
          </g>
        ))}
        {years.map((yr, i) => (
          <text
            key={yr}
            x={x(i)}
            y={H - 10}
            textAnchor="middle"
            className="tick"
          >
            {yr.replace('FY20', 'FY')}
          </text>
        ))}
        <path d={path(revenue.bp)} className="line bp" />
        <path d={path(revenue.fm)} className="line fm" />
        {revenue.fm.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={3} className="dot fm" />
        ))}
        <text x={W - R + 10} y={y(revenue.bp[5]) + 4} className="end bp">
          ₹1,388 Cr business plan
        </text>
        <text x={W - R + 10} y={y(revenue.fm[5]) + 4} className="end fm">
          ₹1,128 Cr financial model
        </text>
      </svg>
    </figure>
  );
}

// The memorandum as published carries em dashes, film posters that open on a cover card claiming "proven on hardware",
// no caption tracks, and a small rendering stretched to the column. Tidy it as it is shown, never in the source:
// its masthead h1 becomes an h2; a lone dash marking an empty cell becomes an en dash, any other em dash a comma; each film takes the poster and the
// reviewed captions the Demonstrations page uses; an image never grows past its own width.
function tidy(html: string) {
  return html
    // the page has its own h1; the memorandum's masthead title sits beneath it
    .replace(/<h1(\b[^>]*)>/g, '<h2$1>')
    .replace(/<\/h1>/g, '</h2>')
    .replace(/>\s*&mdash;\s*</g, '>&ndash;<')
    .replace(/\s*&mdash;\s*/g, ', ')
    .replace(/,\s*([.;:!?)])/g, '$1')
    .replace(
      /(<video\b[^>]*?)poster="[^"]*\/media\/([a-z]+)-poster\.png"([^>]*>)/g,
      (_, a: string, id: string, b: string) =>
        `${a}poster="./images/posters/${id}.webp"${b}<track kind="captions" src="./media/captions/${id}.vtt" srclang="en" label="English">`,
    )
    .replace(
      /<img\b([^>]*?)width="(\d+)"/g,
      (_, a: string, w: string) =>
        `<img${a}style="max-width:${w}px" width="${w}"`,
    );
}

function InvestmentRecord({
  chapter,
  onChapter,
  go,
}: {
  chapter: string;
  onChapter: (id: string) => void;
  go: Go;
}) {
  const [html, setHtml] = useState('');
  useEffect(() => {
    const doc = new DOMParser().parseFromString(tidy(reportHtml), 'text/html');
    setHtml(
      chapter === 'summary'
        ? [
            doc.querySelector('.masthead')?.outerHTML,
            doc.querySelector('.summary')?.outerHTML,
          ]
            .filter(Boolean)
            .join('')
        : doc.getElementById(chapter)?.outerHTML || '',
    );
  }, [chapter]);
  const i = chapters.findIndex((c) => c[0] === chapter);
  return (
    <div className="record-reader">
      <article
        className="source-report"
        onClick={(e) => {
          const a = (e.target as HTMLElement).closest('a');
          const h = a?.getAttribute('href');
          if (h?.startsWith('#') && chapters.some((c) => c[0] === h.slice(1))) {
            e.preventDefault();
            onChapter(h.slice(1));
          }
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Related
        item={'memo:' + chapter}
        go={go}
        title="This chapter across the site"
        level={2}
      />
      <nav className="record-pagination" aria-label="Memorandum chapters">
        {i > 1 && (
          <button onClick={() => onChapter(chapters[i - 1][0])}>
            <ArrowLeft size={16} />
            {chapters[i - 1][1]}
          </button>
        )}
        {i < chapters.length - 1 && (
          <button onClick={() => onChapter(chapters[i + 1][0])}>
            {chapters[i + 1][1]}
            <ArrowRight size={16} />
          </button>
        )}
      </nav>
    </div>
  );
}
