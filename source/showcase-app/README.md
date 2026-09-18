# Editable showcase

This is the original source of the current public showcase, recovered from the September 8 Three.js rebuild. It uses React, Three.js and Vinext (Next.js-compatible routing on Vite).

## Run locally

With Node 24:

```sh
cd source/showcase-app
npm ci --ignore-scripts
npm run dev
npm run typecheck
npm run build:pages
```

The static GitHub Pages artifact is `dist/pages/`, including the `/deepgrid-platform-showcase/` asset prefix. `dist/client/` is the unprefixed Vinext export. `scripts/package-pages.mjs` packages from a fresh build and verifies entry assets and all 104 slide images.

## Where to make changes

| Change | Edit |
| --- | --- |
| Homepage metrics and investment summary metrics | `app/site-content.json` |
| Product prices, revenues, specifications, descriptions and source-slide links | `app/products.json` |
| Slide titles, commentary and source/model references | `app/slide-notes.json` |
| Six investment use cases and workflows | `app/use-cases.json` |
| Full investment memorandum text and tables | `app/report-content.ts` |
| Other page copy, investment risk summaries, navigation and layout | `app/page.tsx` |
| Colours, typography and responsive layout | `app/globals.css`, `app/ux.css`, `app/use-cases.css` |
| Interactive Three.js model | `app/silicon.tsx` |
| Ask DeepGrid (`#briefing`) | Nothing here — see below |
| Images and slide pictures | `public/images/`, `public/slides/` |

The JSON files are imported into the page at build time; editing them and pushing to main updates the site after the workflow succeeds. Several narrative claims intentionally remain in page/report text, so a changed financial assumption may require updating more than one file. Never assume changing a single metric reconciles the entire narrative.

## Financial/model updates

The originals are in `../documents/`. The workbook is evidence, not a live database. Reconcile approved model changes into `products.json`, `site-content.json` and affected report/narrative claims before publishing. Editing slide commentary does not redraw the slide PNGs: update the editable deck and re-export affected slide images when necessary. The original platform in `../original-platform/` is supporting material and does not drive this build.

The source guide is linked from the site's footer. Financial/technical values retain their original management-source context; no new forecasts were introduced during source recovery.

## Deployment

`.github/workflows/pages.yml` checks types, creates the static artifact, checks local entry references and the full slide set, then deploys to the existing GitHub Pages URL on successful main-branch pushes. Pull requests build without deploying. Node and dependencies are pinned through the workflow and lockfile.

Videos still use the existing content-ideas and Google Drive URLs, which this repository does not host. Images and all 104 slide images are included locally.

The original Sites-specific Vite plugin is not loaded for this standalone GitHub build. No Sites account or credentials are needed to build the page.

## Recovery

The root static snapshot remains available in Git history and the repository. The previous publishing commit was `e99caee90142257a0117843b335a3fe0725e269a`. To roll back content, revert the offending source commit and let the workflow redeploy. To return entirely to the old snapshot, change Pages publishing back to the main branch root.

## Ask DeepGrid

The Ask DeepGrid view (`#briefing`) follows the DG32 site's graphify + GraphRAG pattern
([deepgrid-dr-silicon](https://github.com/shekerkamma/deepgrid-dr-silicon) `#ask`) over this showcase's own
materials. It runs entirely in the browser, with no server or API key at runtime.

**Corpus (474 passages):** the page's products, 104 slides, use cases and investment memorandum, plus the
primary sources behind them from `../original-platform/`: the 33-page Information Memorandum (OCR), the
market research and document audits, and the competitor dossiers. `scripts/lib/showcase-content.mjs` defines
it once for both the graph and the answers.

**Pipeline** (run in order after changing any of that content):

```sh
npm run graph:corpus     # knowledge/corpus/*.md, the documents graphify reads
npm run graph:extract    # graphify, via CLIProxyAPI to a subscription Gemini model (never the free tier)
npm run graph:index      # app/data/graphrag-index.json + public/knowledge/ (graph page, JSON, report)
npm run build:semantic   # public/graphrag/: bge-small embeddings, thresholds picked by the routing eval
```

- `graph:extract` needs CLIProxyAPI running on Windows (reached from WSL at the default-gateway IP) and its key
  in `CLIPROXY_API_KEY` or `~/.dsh/.credentials.yaml`. It proves the route with a real call before it starts.
- `graph:index` merges graphify's entities onto the fifteen products and SoC2 by alias (graphify scopes ids to
  their file, so one entity arrives from several files) and records which passages mention each entity.
- Curated answers are in `app/data/themes.ts`. A theme writes no copy of its own: it names memorandum sections,
  slides and products, and the engine quotes them. Example questions are in `app/data/theme-examples.ts`; the
  held-out eval is `scripts/ask-routing-eval.json` (never copy it into the examples).
- Every build runs `scripts/check-semantic.mjs` first. It fails if the index is stale against the page content,
  the embeddings are stale against the index, a theme names a section that no longer exists, the model differs,
  or the eval records a wrong or forced answer.
