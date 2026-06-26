# Render-only fonts

Custom fonts used **only** to render gallery preview PNGs reproducibly
(`npm run examples:render`). They are read by `render-example-previews.ts` and
injected into the headless page at render time.

These fonts are intentionally **not** bundled or served by the site: they belong
to a specific constructed language, not to general use. A site visitor who opens
such an example in the editor sees the line fall back to a default font.

If a font listed in `RENDER_FONTS` (in `render-example-previews.ts`) is missing
here, the render script skips that example's slug so its existing committed /
uploaded preview is kept instead of being overwritten with a fallback render.

Expected files (see `RENDER_FONTS`):

- `abika-common.ttf` — Lemu Teloku "Abika Common" script, SIL OFL (example `conlang-custom-font-interlinear-gloss`)
