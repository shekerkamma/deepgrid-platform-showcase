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

`#briefing` is the DG32 site's Ask DeepGrid ([deepgrid-dr-silicon](https://shekerkamma.github.io/deepgrid-dr-silicon/#ask)):
the same implementation (`app/ask.tsx`, `app/council-view.tsx`, `app/data/graphrag-engine.ts`, `app/data/semantic.ts`,
`app/documents-data.ts`, `app/data/deepgrid-knowledge.ts`), answering from two parts of content:

1. **The DG32 site's content**: its 42 documents (8 PDFs, 34 markdown), its catalog, its curated executive themes
   and its document pillars Doc #1-#6, unchanged.
2. **This site's content** as Doc #7-#9: the product portfolio (15 products + SoC2, 104-slide deck), the investment
   and information memoranda with BP1A/BP1B and the research behind them, and the financial model and business plan.

Pipeline (graphify first, then GraphRAG):

```sh
npm run graph:documents  # OCR text of image-only documents (knowledge/documents.json)
npm run graph:sources    # every document of both parts -> knowledge/sources/ (gitignored; manifest: knowledge/sources.json)
npm run graph:extract    # graphify over all of it, via CLIProxyAPI to a subscription model (never a free tier)
npm run graph:index      # showcase catalog + unified GraphRAG index (the DG32 builder, extended) + graph page
npm run build:semantic   # bge-small embeddings + routing eval (the DG32 script)
npm run graph:themes     # executive themes for Doc #7-#9, in the DG32 shape, figure-checked against sources
npm run build:semantic   # again: the themes are routing rows
```

graphify needs its `pdf`, `office` and `openai` extras (`uv tool install 'graphifyy[pdf,office,openai]'`); without
them it silently skips every PDF and office file. The routing eval (`scripts/ask-routing-eval.json`) holds the DG32
site's 25 cases unchanged plus 19 held-out showcase cases; every build fails if it records a wrong or forced answer.
Links in an answer open showcase views here and DG32 views on the DG32 site.
