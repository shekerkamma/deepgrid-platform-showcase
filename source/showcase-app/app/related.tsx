'use client';
import relations from './data/relations.json';
import { navigation, type Go } from './shared';

// "Related across the site": for one item (a slide, a film, a Silicon platform chapter, a chapter of the investment
// case, a use case), the items in other sections that are about the same thing, grouped by section under the section's
// own name. The links come from app/data/relations.json (scripts/build-relations.mjs), which stores every link both
// ways, so whatever this block shows, the other item shows back.

type Node = { label: string; hash: string; detail?: string };
const nodes = relations.nodes as Record<string, Node>;
const edges = relations.edges as Record<string, Record<string, { t?: number }>>;
const section = (view: string) =>
  navigation.find((n) => n[0] === view)?.[1] || view;
const GROUPS: [string, string][] = [
  ['product', section('portfolio')],
  ['tech', section('silicon')],
  ['film', section('film')],
  ['memo', section('investment')],
  ['usecase', section('investment') + ': use cases'],
  ['slide', section('slides')],
];
const clock = (t: number) =>
  `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export function relatedTo(item: string, exclude: string[] = []) {
  const out = Object.entries(edges[item] || {}).filter(
    ([k]) => !exclude.includes(k.split(':')[0]) && !exclude.includes(k),
  );
  return GROUPS.map(([kind, title]) => ({
    kind,
    title,
    links: out
      .filter(([k]) => k.split(':')[0] === kind)
      .map(([k, e]) => {
        const n = nodes[k];
        // a moment of the narrated walkthrough opens the film at that second
        const at = k === 'film:master' && e.t != null ? e.t : undefined;
        return {
          key: k,
          label:
            at != null
              ? `${n.label.replace(/[.]$/, '')}, from ${clock(at)}`
              : n.label,
          detail: n.detail,
          hash: at != null ? `${n.hash}&t=${at}` : n.hash,
        };
      })
      .sort((a, b) =>
        kind === 'slide'
          ? Number(a.key.split(':')[1]) - Number(b.key.split(':')[1])
          : 0,
      ),
  })).filter((g) => g.links.length);
}

export default function Related({
  item,
  go,
  exclude = [],
  title = 'Related across the site',
  level = 3,
}: {
  item: string;
  go: Go;
  exclude?: string[];
  title?: string;
  level?: 2 | 3;
}) {
  const groups = relatedTo(item, exclude);
  if (!groups.length) return null;
  const H = level === 2 ? 'h2' : 'h3',
    G = level === 2 ? 'h3' : 'h4';
  return (
    <aside className="related" aria-label={title}>
      <H className="related-title">{title}</H>
      <div className="related-groups">
        {groups.map((g) => (
          <section key={g.kind} className={'related-group is-' + g.kind}>
            <G>{g.title}</G>
            <ul>
              {g.links.map((l) => (
                <li key={l.key}>
                  <a
                    href={'#' + l.hash}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.hash);
                    }}
                  >
                    <strong>{l.label}</strong>
                    {l.detail && g.kind !== 'slide' && (
                      <small>{l.detail}</small>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}
