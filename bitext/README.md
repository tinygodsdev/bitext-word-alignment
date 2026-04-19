# Bitext Align

Single-page **word-by-word translation visualizer** — manual bilingual alignment, optional interlinear gloss, exports (PNG / SVG / PDF / HTML), and shareable `?data=` URLs.

## Requirements

- **Node.js 20.19+** or **22.12+** (Vite 8)

## Styling

UI uses **[BeerCSS](https://www.beercss.com/)** (Material Design 3) loaded from jsDelivr in `src/routes/+layout.svelte`: `beer.min.css`, `beer.min.js`, and `material-dynamic-colors.min.js`. The Material Symbols font is loaded for icon font usage.

App-specific layout and preview chrome live in `src/app.css`.

## Commands

```sh
npm install
npm run dev
npm run build
npm run preview
npm run check
npm run lint
```

## Stack

- SvelteKit + Svelte 5 (runes)
- BeerCSS (CDN)
- `adapter-node` for deployment (e.g. Node / Vercel)

## Project layout

- `src/lib/domain/` — pure tokenization & alignment logic
- `src/lib/state/` — runes stores (project, settings, selection, layout export)
- `src/lib/components/` — editor, preview, settings, SEO, share/export
- `src/routes/api/og/` — Open Graph PNG (SVG → `@resvg/resvg-js`)
