# Provenance and rebuild proof

This directory is the source of the compiled site at the repository root, published at
`https://shekerkamma.github.io/deepgrid-platform-showcase/`.

## Where it came from

Recovered on 2026-09-12 from the Codex Desktop worktree of the thread
**"Rebuild DeepGrid page with Three.js"** (thread `01a07fb2-0f5d-7160-b1a5-642c2cfb678e`,
Codex Desktop 0.153.4, started 2026-09-08), at
`C:\Users\sheke\Documents\Codex\2026-09-08\c-users-sheke-documents-deepgrid-ads\outputs\deepgrid-platform`.

The project carried its own Git history, whose five commits end at
`71c6034 Reorganize navigation and source material with structured use-case explorer`
and begin at `c44b005 Build interactive Three.js DeepGrid archive`. That history is not
included here; the working tree is.

## Why this is the right source, not a lookalike

The published chunk filenames are content hashes, so they are checkable. Three artifacts
at the repository root are byte-identical to the recovered project's own `dist/client`
output, compared by Git blob SHA-1:

| Published file | SHA-1 |
| --- | --- |
| `_next/static/chunks/page-CpcG7uxT.js` | `d249b389e5cc51a36bcde12224653b903c02c100` |
| `_next/static/chunks/index-B38i5nX-.js` | `031c56804084ec9bb1bab1ea4415137e392ca818` |
| `_next/static/css/index.BDV_nuBL.css` | `7c65616d0a14bd50ff9d8022a2581e04618e6740` |

The root `index.html` differs from the build output by one substitution: `/_next/` is
rewritten to `/deepgrid-platform-showcase/_next/` so GitHub Pages can serve the project
site from a sub-path. `source/scripts/publish-showcase.mjs` performs that rewrite.

## Rebuild verification

A clean `npm ci` plus `npm run build` was run from this directory on 2026-09-12 under
Node 24.18.1 on Linux, against the Windows-built published artifact.

- `page-CpcG7uxT.js` reproduced **byte-identical** — same filename, same SHA-1. This is
  the 1.05 MB chunk holding the entire application.
- `index.BDV_nuBL.css` reproduced **byte-identical**.
- `framework-D_rUT4EX.js`, `rolldown-runtime-C60lm6uB.js` and `streamed-icons-Bumrcy-j.js`
  reproduced under their published content-hash filenames.
- Three small bootstrap chunks changed hash: `index-*.js`,
  `layout-segment-context-*.js` and `app-route-prefetch-policy-*.js`. The only
  substantive difference is a per-build random deployment id
  (`8c729ad2-3b51-4280-adce-625bdf859d25` published, `9a31b3a2-be4f-4f32-b9ae-6ab018406a8e`
  rebuilt). Changing that id changes the entry chunk's content hash, which changes the
  filename, which changes the two chunks that import it by name.

A changed hash on those three files is expected on every build and is not drift in the
source. Treat `page-*.js` and `index.*.css` as the files that must reproduce.

## Stack

`vinext` 1.0.0-beta.5 runs Next.js 16 app-router semantics on Vite 8 with the rolldown
bundler, configured in `vite.config.ts` rather than by `next.config.ts` alone. It is not
the standard `next build` toolchain, so `npx next build` will not reproduce this output.
`three` 0.185.1 drives the interactive silicon view in `app/silicon.tsx`. Node 22.13 or
newer is required, per `engines` in `package.json`.
