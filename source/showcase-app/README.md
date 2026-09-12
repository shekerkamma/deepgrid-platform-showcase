# DeepGrid — semiconductor platform website

A coherent seven-section website: platform, 15-SKU portfolio, interactive silicon architecture, source-backed briefing agent, master film, 104-slide viewer, and investment/diligence. Built with React, Three.js and the existing Sites/Vinext starter. Charcoal surfaces, copper accents and serif typography apply throughout.

## Run and build

Use Node.js 22.13 or newer. `npm ci`, then `npm run dev`. `npm run build` produces the static site in `dist/client`. The build wrapper lets Windows native close callbacks drain before process exit. `npx tsc --noEmit` checks types.

## Content and assets

The product records are extracted from the existing DeepGrid platform without changing their prices, assumptions or source-slide numbers. The complete memorandum is rendered as native HTML using the same theme. No old-page iframe is used. All portfolio visuals and memorandum figures are saved locally. Videos and the 104 original slides stream from their existing published URLs. Google Drive links remain available.

The briefing agent searches products and the memorandum locally, displays source extracts and can open product details or slides. It uses the original optional DeepGrid reranker endpoint with a four-second timeout; local search remains available if that service is unavailable. No ungrounded generative answers are presented.

The Three.js model is a conceptual illustration of the six compute domains, not a manufacturing mask or measured silicon result. It supports drag rotation, domain selection, separated layers, reduced motion and a static fallback. The image sources and generated hero prompt are in IMAGE-SOURCES.md.

## GitHub Pages

`deepgrid-github-pages.zip` is prepared for `/content-ideas/deepgrid-platform/`. Copy its contents to that published directory, retaining the site's existing `media`, `slides` and `deck_assets` directories. A `.nojekyll` file is needed at the GitHub Pages publishing root so `_next` assets are served. This task does not overwrite the original GitHub Pages site.

## Validation

TypeScript check, production static build, source/resource reference checks and a successful HTTP response from the local preview. No browser interaction or screenshot QA was performed.
