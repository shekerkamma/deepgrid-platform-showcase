# Source for both published DeepGrid pages

Two different DeepGrid sites are live, built from two different projects. Both sources are
now in this folder, and both were verified against the bytes actually being served.

| Live page | Build | Source here |
| --- | --- | --- |
| `https://shekerkamma.github.io/deepgrid-platform-showcase/` | Next.js 16 on Vite via `vinext`, static export | `showcase-app/` |
| `https://shekerkamma.github.io/content-ideas/deepgrid-platform/` | Vite 6 + React SPA | `original-platform/` |

The compiled showcase sits at this repository's root. The second page is served from the
`gh-pages` branch of the separate `shekerkamma/content-ideas` repository, under
`deepgrid-platform/`; this folder holds its source but does not publish it.

An earlier revision of this file said the exact Next.js project was missing. It was not
missing, only unsearched: it lives in a Codex Desktop worktree rather than in the Windows
project folder that had been checked. See `showcase-app/PROVENANCE.md` for where it was
found and how it was verified.

## showcase-app — the project that builds the root of this repository

Recovered 2026-09-12 from the Codex Desktop thread "Rebuild DeepGrid page with Three.js".
Verified by rebuilding it: the 1.05 MB application chunk `page-CpcG7uxT.js` and the
stylesheet `index.BDV_nuBL.css` both reproduce byte-identical to the files published at
the repository root. Full evidence, and the one expected source of hash churn, are in
`showcase-app/PROVENANCE.md`.

```sh
cd source/showcase-app
npm ci            # Node 22.13+, 24.18.1 used for verification
npm run dev       # vinext dev server
npm run build     # writes dist/client
```

Content lives in `app/`. `page.tsx` is the whole page; `products.json`, `use-cases.json`,
`slide-notes.json` and `report-content.ts` hold the product, use-case, slide and briefing
copy; `silicon.tsx` is the Three.js silicon view. `components/ui/` is stock shadcn.

### Publishing a change

```sh
node source/scripts/publish-showcase.mjs --base /deepgrid-platform-showcase --out .
```

The build emits every script and stylesheet under an absolute `/_next/` prefix, which a
GitHub Pages project site cannot serve. The script rebuilds, copies `dist/client` over the
generated files at the target, rewrites that prefix to the given base path, writes
`.nojekyll`, and fails if any script or stylesheet the entry document references is absent
on disk. That last check matters because a missing chunk renders a blank page with no
server error. Image and slide references are already relative and are left alone.

Pass `--skip-build` to stage an existing `dist/client`. Use
`--base /content-ideas/deepgrid-platform --out <path>` to target the other page's base
path.

## original-platform — the project that builds the content-ideas page

Recovered from `D:\New folder\Antigravity-test\deepgrid-platform`. Confirmed as the source
of the live page: its `dist/assets/index-7KvvxUUq.js` is byte-identical
(`5885f02dd355e54dc1d1567fde591b7607633c8c`) to the file served at
`https://shekerkamma.github.io/content-ideas/deepgrid-platform/assets/index-7KvvxUUq.js`.

```sh
cd source/original-platform
npm ci            # Node 22.12+
npm run dev
npm run build     # writes dist/
```

### Set VITE_RERANK_ENDPOINT or you will not reproduce the live bundle

```sh
VITE_RERANK_ENDPOINT=https://deepgrid-rerank.shekerkamma.workers.dev npm run build
```

The briefing reranker is injected at build time and defaults to empty. Build without
it and you get a working page with a bundle 1,027 bytes smaller, no network call, and
lexical ordering only. `src/a2ui/engine.ts` documents that degradation as deliberate:
a ranking aid must never be able to take the answer away. Nothing else in the project
names the endpoint, so an unset variable produces a correct-looking build that is not
the published one. The Worker itself is defined in `wrangler.toml` and `proxy/`.

Rebuilt on 2026-09-12 under Node 24.18.1 with that variable set, from the copy in this
repository:

- `assets/index-Czj8W0QI.css` reproduced **byte-identical** to the live stylesheet.
- The main bundle reproduced at **1,502,679 bytes, the live byte count**, differing from
  the live `index-7KvvxUUq.js` in exactly one place: the filename of the knowledge-index
  chunk it imports.
- That chunk reproduced at **991,068 bytes, the live byte count**, differing in **10 bytes
  out of 991,068** — the generator's embedded build timestamp. Unit count (884) and score
  (87.86004514672686) matched exactly, which is why its name and therefore the importing
  bundle's name change on every build.

An earlier run of the same build without the variable produced a 1,501,652-byte bundle
missing the reranker code path entirely. Treat a size other than 1,502,679 as a missing
environment variable, not as source drift.

`wrangler.toml`, `proxy/` and the project `README.md` were added on 2026-09-12; the first
upload had omitted them, so the reranking Worker and the local embedding and reranking dev
servers could not be reproduced from this folder. Text files were committed with normalized
line endings, which changes no build output.

Building this project does not regenerate the root of this repository. Do not publish its
output here.

## The films are not in this repository, and both pages hot-link them

`showcase-app/app/page.tsx` hardcodes
`origin = 'https://shekerkamma.github.io/content-ideas/deepgrid-platform/'` and loads all
seven product films plus the 104-slide master film from that path. The original platform
loads the same files from its own `public/`. Those `.mp4` and `.mp3` binaries are excluded
from both uploads here.

They serve today, confirmed 2026-09-12. But the showcase's video section depends on a
directory in a different repository's `gh-pages` branch. Republishing that page from
`original-platform/` alone would delete the media and break the film section on **both**
sites. Copy `public/media/` and the `public/deck_assets/` audio and video back from the
Windows project before any publish that touches that path.

## Where the numbers and visuals come from

| Files | Purpose |
| --- | --- |
| `documents/Deepgrid_Semi_Financial_Model_Corrected_v3-sept.xlsx` | The workbook cited by `ExecutiveSummary.tsx`: assumptions, revenue build, P&L, demand and TAM, tapeout economics, use of funds. |
| `documents/DeepGrid-Semi-Product-Portfolio-104-Slides-Embedded-reviewed.pptx` | Editable 104-slide portfolio deck referenced by the presentation inspection scripts. |
| `original-platform/src/data/products.ts` | Product specifications and portfolio values. |
| `original-platform/src/data/master_deck_indexed.json`, `slides104_wsl.json` | Extracted presentation content. |
| `original-platform/src/a2ui/data/*.json` | Company profiles, competitor scoring and weights, strategy and positioning, narrative, use cases, published page content. |
| `original-platform/src/a2ui/data/research/` | Supporting research, source citations, model review, extracted information memorandum. |
| `original-platform/src/components/ExecutiveSummary.tsx` | Financial and technical numbers in page markup, with figures embedded as data URLs. |
| `original-platform/scripts/build-knowledge-index.mjs` | Builds the briefing retrieval index from source JSON, research and page content. |
| `showcase-app/app/products.json`, `use-cases.json`, `slide-notes.json`, `report-content.ts` | The same material as re-authored for the showcase. |

The workbook and editable deck came from `C:\Users\sheke\Downloads`, followed by filename
from the Windows project. No CSV dataset was found. Some research notes cite an external
`evidence-ledger.csv` that is not included. JSON extracts are not a substitute for the
workbook's formulas and are not audited financial results.

## What is excluded

Audio and video binaries, `node_modules`, build output, caches, local environment files
and Git history. See the section above on the films. The master-film player also keeps a
Google Drive link as a fallback, whose availability is not guaranteed. Image assets are
included in both projects.
