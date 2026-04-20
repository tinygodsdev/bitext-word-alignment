# Bitext Align

Single-page **word-by-word translation visualizer** — manual bilingual alignment, optional interlinear gloss, exports (PNG / SVG / PDF / HTML), and shareable `?data=` URLs.

## Requirements

- **Node.js 20.19+** or **22.12+** (Vite 8)

## Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` — see [`vite.config.ts`](vite.config.ts) and [`src/app.css`](src/app.css) (`@import "tailwindcss"`, Flowbite plugin, `@source` for `flowbite-svelte`).
- **Flowbite Svelte** — buttons, cards, modals, tabs, ranges, etc. Dark mode uses the `dark` class on `<html>` (see [`src/routes/+layout.svelte`](src/routes/+layout.svelte)).
- **Preview / alignment visualization** — custom CSS for `.preview-*`, `.token-*`, `.gloss-*` remains in `src/app.css` (not part of the Flowbite layout).

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
- Tailwind CSS v4 + Flowbite Svelte
- `adapter-node` for deployment (e.g. Node / Vercel)

## Project layout

- `src/lib/domain/` — tokenization, alignment, link graph helpers
- `src/lib/state/` — runes stores (project, settings, selection, layout export)
- `src/lib/components/` — editor, preview, settings, SEO, share/export
- `src/routes/api/og/` — Open Graph PNG (SVG → `@resvg/resvg-js`)
