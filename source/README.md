# Original platform source and supporting documents

This folder contains the original Vite/React platform recovered from `D:\New folder\Antigravity-test\deepgrid-platform` on 2026-09-11. It is the upstream platform referenced by the showcase README, not the exact Next.js project that produced the compiled showcase at the repository root. The root website remains the published showcase.

## Where the numbers and visuals come from

| Files | Purpose |
| --- | --- |
| `documents/Deepgrid_Semi_Financial_Model_Corrected_v3-sept.xlsx` | Original workbook explicitly cited by ExecutiveSummary.tsx: assumptions, revenue build, P&L, demand/TAM, tapeout economics and use of funds. |
| `documents/DeepGrid-Semi-Product-Portfolio-104-Slides-Embedded-reviewed.pptx` | Editable 104-slide portfolio deck referenced by the local presentation inspection scripts. |
| `original-platform/src/data/products.ts` | Product specifications and portfolio values. |
| `original-platform/src/data/master_deck_indexed.json` and `slides104_wsl.json` | Extracted presentation content. |
| `original-platform/src/a2ui/data/*.json` | Company profiles, competitor scoring and weights, strategy/positioning, narrative, use cases and published page content. |
| `original-platform/src/a2ui/data/research/` | Supporting research, source citations, model review and extracted information memorandum. |
| `original-platform/src/components/ExecutiveSummary.tsx` | Financial and technical numbers embedded in page markup, with figure images embedded as data URLs. |
| `original-platform/src/components/` and `src/a2ui/catalog.tsx` | UI and visual rendering code. |
| `original-platform/public/` | Slide and product images. |
| `original-platform/scripts/build-knowledge-index.mjs` | Builds the briefing retrieval index from source JSON, research and page content. |

The workbook and editable deck were recovered from `C:\Users\sheke\Downloads` by following filenames in the Windows project. No CSV dataset was found in the platform project. Some research notes reference an external evidence-ledger.csv; that original CSV is not included. Do not treat JSON extracts as a substitute for the workbook's formulas or as audited financial results.

## Run the original platform

Use Node.js 22.12+ or a compatible newer release:

```sh
cd source/original-platform
npm ci
npm run dev
npm run build
```

The source uses Vite, and builds into `dist/`. It does not regenerate the Next.js showcase at the repository root. Do not replace the root publishing artifact with this build unless intentionally deploying the original platform instead.

Audio and video binaries are excluded from this source upload. To restore the original platform's local video playback, copy the original `public/media` and `public/deck_assets` audio/video files from the Windows project (including the directory target used by `public/deck_assets`) or the original content-ideas deployment. Image assets are included. The main video component also contains its original Google Drive embed fallback. This source archive does not guarantee that external media/services remain available.

Local environment files, dependencies, caches, Git history and unrelated projects were excluded.

## Validation

On 2026-09-11, a clean dependency installation followed by TypeScript checking and the production Vite build passed using Node 24.14.1. The build regenerated 884 retrieval units. Vite reported a bundle-size warning. The presentation archive contains 104 slide XML files. The compiled site's runtime and external services were not exhaustively tested.
