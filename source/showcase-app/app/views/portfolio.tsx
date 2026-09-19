'use client';
import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpDown, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  SectionHead,
  Scene,
  groups,
  products,
  type Product,
  type SceneId,
} from '../shared';

// One concept render per product line, shown as the line's banner.
const lineScene: Record<string, SceneId> = {
  'Road Autonomy': 'truck',
  'Silicon & Compute': 'die',
  'Fleet & Mobility': 'port',
  'Sensors & Robotics': 'defence',
};
import briefs from '../data/product-briefs.json';

// Products: the fifteen lines as cards to browse or as a table to compare. Cards carry no
// imagery: the simulator screenshots that used to sit on them were cropped slide captures that
// said nothing about the product. The dossier shows the product's own source slide instead.

// "₹2,50,000" and "₹66.00 L" both become rupees, so the table can sort by price.
const rupees = (s: string) => {
  const n = parseFloat(s.replace(/[₹,\s]/g, ''));
  return /L$/.test(s.trim()) ? n * 1e5 : /Cr$/.test(s.trim()) ? n * 1e7 : n;
};
const firstSentence = (s: string) => s.split(/(?<=[.!?])\s+/)[0];

type SortKey = 'revenue' | 'price' | 'margin' | 'first' | 'name';
const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  revenue: (a, b) => b.revenueNum - a.revenueNum,
  price: (a, b) => rupees(b.price) - rupees(a.price),
  margin: (a, b) => parseFloat(b.margin) - parseFloat(a.margin),
  first: (a, b) => a.firstRevenue.localeCompare(b.firstRevenue),
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function Portfolio({
  category,
  query,
  layout,
  setCategory,
  setQuery,
  setLayout,
  clear,
  open,
}: {
  category: string;
  query: string;
  layout: string;
  setCategory: (v: string) => void;
  setQuery: (v: string) => void;
  setLayout: (v: string) => void;
  clear: () => void;
  open: (p: Product) => void;
}) {
  const [sort, setSort] = useState<SortKey>('revenue');
  const visible = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (category === 'All products' || p.category === category) &&
            `${p.id} ${p.name} ${p.category} ${p.description}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort(
          layout === 'table'
            ? sorters[sort]
            : (a, b) =>
                groups.indexOf(a.category) - groups.indexOf(b.category) ||
                b.revenueNum - a.revenueNum,
        ),
    [category, query, layout, sort],
  );
  const count = (g: string) =>
    g === 'All products'
      ? products.length
      : products.filter((p) => p.category === g).length;
  const total = products.reduce((s, p) => s + p.revenueNum, 0);
  const shareOf = (g: string) =>
    Math.round(
      (products
        .filter((p) => p.category === g)
        .reduce((s, p) => s + p.revenueNum, 0) /
        total) *
        100,
    );
  const th = (key: SortKey, label: string, num = true) => (
    <th
      scope="col"
      className={num ? 'num' : ''}
      aria-sort={
        sort === key
          ? key === 'name' || key === 'first'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
    >
      <button onClick={() => setSort(key)}>
        {label}
        <ArrowUpDown size={13} aria-hidden="true" />
      </button>
    </th>
  );

  return (
    <section className="page-wrap">
      <SectionHead
        title="Fifteen products, one die"
        copy="Four product lines on the same silicon. Open a product for what it is used for, the product running in its films and slides, how it makes money, and the documents behind every figure."
      />
      <div className="filter-line">
        <Tabs value={category} onValueChange={(v) => setCategory(String(v))}>
          <TabsList className="filters">
            {groups.map((g) => (
              <TabsTrigger value={g} key={g}>
                {g}
                <span className="filter-count">{count(g)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="mobile-picker">
          <Select
            value={category}
            onValueChange={(v) => setCategory(String(v))}
          >
            <SelectTrigger aria-label="Product category">
              <SelectValue>{category}</SelectValue>
            </SelectTrigger>
            <SelectContent className="ux-select-menu">
              {groups.map((g) => (
                <SelectItem key={g} value={g}>
                  {g} ({count(g)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="filter-row">
          <label className="search">
            <Search size={16} aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a product…"
              aria-label="Find a product"
              name="product-search"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <div className="layout-toggle" role="group" aria-label="Layout">
            {[
              ['cards', 'Cards'],
              ['table', 'Compare'],
            ].map(([id, label]) => (
              <button
                key={id}
                aria-pressed={layout === id}
                onClick={() => setLayout(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="results-line" aria-live="polite">
        <span>
          {visible.length} of {products.length} products
          {category !== 'All products'
            ? ` · ${category} · ${shareOf(category)}% of FY2032 plan revenue`
            : ''}
        </span>
        {(query || category !== 'All products') && (
          <button onClick={clear}>Clear filters</button>
        )}
      </div>

      {layout === 'table' ? (
        <div
          className="table-scroll"
          tabIndex={0}
          aria-label="Product comparison"
        >
          <table className="compare-table">
            <thead>
              <tr>
                {th('name', 'Product', false)}
                <th scope="col">Segment</th>
                {th('price', 'Listed price')}
                {th('revenue', 'FY2032 revenue')}
                <th scope="col" className="num">
                  Share
                </th>
                {th('margin', 'Gross margin')}
                {th('first', 'First revenue')}
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <th scope="row">
                    <button className="row-link" onClick={() => open(p)}>
                      {p.name}
                    </button>
                  </th>
                  <td>{p.category}</td>
                  <td className="num">{p.price}</td>
                  <td className="num">{p.revenue}</td>
                  <td className="num">{p.share}</td>
                  <td className="num">{p.margin}</td>
                  <td className="num">{p.firstRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="product-lines">
          {groups
            .filter(
              (g) =>
                g !== 'All products' && visible.some((p) => p.category === g),
            )
            .map((g) => {
              const line = (
                briefs.lines as Record<
                  string,
                  { lead: string; total: string; share: string }
                >
              )[g];
              const members = visible.filter((p) => p.category === g);
              return (
                <section
                  className="product-line"
                  key={g}
                  aria-labelledby={'line-' + g.replace(/\W+/g, '-')}
                >
                  {lineScene[g] && (
                    <figure className="product-line-scene">
                      <Scene
                        id={lineScene[g]}
                        sizes="(min-width: 1200px) 1140px, 100vw"
                      />
                      <figcaption>Concept render</figcaption>
                    </figure>
                  )}
                  <header className="product-line-head">
                    <h2 id={'line-' + g.replace(/\W+/g, '-')}>{g}</h2>
                    {line && (
                      <p className="num product-line-figure">
                        {line.total} FY2032 · {line.share} of plan
                      </p>
                    )}
                    {line && <p className="product-line-lead">{line.lead}</p>}
                  </header>
                  <div className="product-grid catalog-list">
                    {members.map((p) => {
                      const b = (
                        briefs.products as Record<
                          string,
                          {
                            useCases: { title: string }[];
                            films: string[];
                            slides: number[];
                          }
                        >
                      )[p.id];
                      return (
                        <button
                          className="product-card"
                          key={p.id}
                          onClick={() => open(p)}
                        >
                          <span className="product-meta">
                            {p.category}
                            <span className="num">{p.id.toUpperCase()}</span>
                          </span>
                          <h3>{p.name}</h3>
                          <p>{firstSentence(p.description)}</p>
                          {b?.useCases.length ? (
                            <p className="card-usecases">
                              <span>Used for</span>{' '}
                              {b.useCases.map((u) => u.title).join(' · ')}
                            </p>
                          ) : null}
                          <dl>
                            <div>
                              <dt>Listed price</dt>
                              <dd className="num">{p.price}</dd>
                            </div>
                            <div>
                              <dt>FY2032 revenue</dt>
                              <dd className="num">{p.revenue}</dd>
                            </div>
                            <div>
                              <dt>Gross margin</dt>
                              <dd className="num">{p.margin}</dd>
                            </div>
                          </dl>
                          <span className="open-product">
                            <span>
                              Open product{' '}
                              <ArrowRight size={16} aria-hidden="true" />
                            </span>
                            <span className="card-media num">
                              {[
                                b?.films.length
                                  ? `${b.films.length} film${b.films.length > 1 ? 's' : ''}`
                                  : '',
                                b?.slides.length
                                  ? `${b.slides.length} slides`
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </div>
      )}
      {!visible.length && (
        <div className="empty-result">
          <Search aria-hidden="true" />
          <h3>No products match your search.</h3>
          <button className="text-link" onClick={clear}>
            Clear filters <ArrowRight size={16} />
          </button>
        </div>
      )}
      <p className="disclaimer">
        Prices, volumes, revenues and margins are management projections, not
        audited results or guaranteed outcomes.
      </p>
    </section>
  );
}
