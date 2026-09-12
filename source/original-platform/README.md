# deepgrid-platform

Source for the DeepGrid Semi investor platform page.

**Deployed:** https://shekerkamma.github.io/content-ideas/deepgrid-platform/
**Deploy target:** `shekerkamma/content-ideas` @ `gh-pages`, under `deepgrid-platform/`

Private: the page carries "STRICTLY CONFIDENTIAL · PRE-SERIES A" investor material.

## Why this repo exists

This tree was unversioned and lived only on one machine. Because of that, every
fix had to be applied to the compiled bundle already on `gh-pages`, and the next
`npm run build` silently reverted all of it. Versioning the source is what stops
that.

## Build

Requires **Node 20+** (vite 8 / rolldown). `node_modules` here carries the
**win32** rolldown binding, so build from Windows. Building from WSL fails with
`Cannot find module '../rolldown-binding.linux-x64-gnu.node'`; run `npm install`
from WSL first if you want a Linux build.

```
npm run build          # -> dist/
```

## Deploy

`dist/` is the complete site. Copy `dist/index.html` and `dist/assets/*` into the
`gh-pages` checkout at `deepgrid-platform/`, deleting the previous hashed assets
first, then commit and push. The `media/`, `slides/` and `deck_assets/` trees are
already there and unchanged by a rebuild.

## Assets not in this repo

`public/media` (56 MB), `public/slides` (9.5 MB) and `public/deck_assets` are
gitignored and live in `shekerkamma/content-ideas` @ `gh-pages` under
`deepgrid-platform/`. Restore them into `public/` before building a complete site.

## The bug worth knowing about

`src/components/ExecutiveSummary.tsx` renders a `<style>` block that redefines
`:root` **globally** — it is not scoped to the component — switching the palette
in `src/index.css` from dark to light. Any token it forgets keeps its dark value.
That is how `--surface-card` and `--green` ended up dark on a light page, and
every element pairing `background: var(--surface-card)` with `color: var(--ink)`
rendered dark-on-dark at 1.15:1.

If you add a token to `index.css`, add it to all three blocks in
`ExecutiveSummary.tsx` (light, `prefers-color-scheme: dark`, and
`[data-theme="dark"]`) or it will silently disagree with its ground.

Where a component paints its own dark ground on a light page (`.glass-interactive-card`,
`.visual-preview-box`), restate the ink tokens on that subtree rather than
overriding each child's colour — and remember that a light-surfaced child inside
it (`--surface-sunk` buttons and pills) needs the page ink back.

## Verifying a change

Contrast must be measured as the **computed text colour** against the **modal
rendered-pixel colour** of the element's box. Computed backgrounds miss gradients
and injected styles; pixel percentiles dilute to nothing on wide boxes. Also set
`html { scroll-behavior: auto }` before screenshotting, or the page is still
animating when the shot is taken and every crop is measured against the wrong
scroll position.
