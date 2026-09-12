# DeepGrid Platform Showcase

Live site: https://shekerkamma.github.io/deepgrid-platform-showcase/

## Edit the live site

The exact editable React/Vinext showcase project is now in [`source/showcase-app/`](source/showcase-app/README.md). It was recovered from the September 8 Three.js rebuild. It preserves the current design, navigation, product details, interactive silicon model, investment reader and 104-slide viewer.

1. Edit the relevant file under `source/showcase-app/app/` (see the editing guide).
2. Open a pull request to run type checking and a production build, or commit an authorized update to `main`.
3. The **Build and deploy showcase** GitHub Actions workflow builds and publishes successful updates to the existing Pages URL.

Only changes under `source/showcase-app/` or the deployment workflow trigger automatic publishing. A failed build does not replace the deployed site. The workflow can also be run manually.

## Data and provenance

[`source/`](source/README.md) contains the financial workbook, editable presentation, supporting research and the older Vite platform. The current page uses the curated data in `source/showcase-app/app/`; uploading or changing a workbook alone does not change the page. Review its assumptions, then update the matching page data. The figures retain their management-projection context.

The repository-root HTML, `_next`, images and slides are the previous static snapshot, retained for recovery. GitHub Pages is now published from the workflow artifact, not that root snapshot. Do not edit compiled JavaScript.
