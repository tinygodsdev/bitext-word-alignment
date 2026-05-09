# Changelog

Short notes for changes on branch **`v2`** relative to **`main`** (no dedicated git version tag). For an exact file list, run: `git diff main...v2 --stat`.

## [v2] — vs `main`

### Added

- **Multi-line alignment** — projects and preview support more than two lines; links only between vertically adjacent lines.
- **Line editor** — line cards (`LineCard`), modal text editing (`LineEditModal`), line settings (font, size, spacing, LTR/RTL, etc.) via popover/sheet.
- **Per-pair line controls** — vertical gap slider (`LinePairGapSlider`), toggling connector visibility for each adjacent line pair (`pairControls`).
- **Tokenization settings** — Tokens tab (word split characters, join character, optional punctuation tokenization); “?” hints (`SettingsFieldHint`).
- **Built-in examples** — expanded set in `examples.ts` (simple, Turkish interlinear with glosses/IPA, RTL Hebrew/Arabic/English, Tagalog with hyphen inside words, CJK).
- **`/about` page** — Aligner documentation, screenshots, table of contents, SEO; links from header and footer.
- **`/privacy` page** — dedicated route and navigation updates.
- **Raster export** — **2×–6×** scale for **PNG** and **PDF** (default 2×); tooltip explaining vector SVG/HTML.
- **Share** — export project data as JSON for presets and debugging (`ShareDialog`).
- **Custom fonts in exports** — **harfbuzzjs** for shaping (ligatures / OpenType closer to the browser), glyph outlines via **opentype.js** `glyph.getPath` at HarfBuzz glyph IDs (correct SVG orientation).
- **Domain & state** — `lines-helpers`, broader `schema`/project/link-selection plumbing, `layoutExport`, jump-to Tokens tab (`settingsNav`), editor UI (`editorUi`), `viewport` where needed.
- **Serialization** — state format evolution (including `compact-v3`, expanded `schema`), updated roundtrip and migration tests.
- **Tests** — token/palette coverage, harfbuzz export smoke; `docs/v2-manual-qa.md`.
- **Static assets** — screenshots for about, `sitemap.xml` updates.

### Changed

- **Home & SEO** — copy aligned with current UX (multi-line, adjacent links, terminology); Aligner (Bitext Align) branding; `SeoIntro`, `SeoSections`, `JsonLd`, `metadata.ts`.
- **Preview** — `AlignmentPreview`, token markup (`TokenView`, `TokenRow`), link layer (`AlignmentSvg`) with pairs and line order; line reorder and line actions; **in-preview controls follow preview light/dark background**, not only the page theme.
- **SVG export** — respects `pairControls`, background, line weight/opacity, optional embedded fonts, etc. (`svg.ts`, `ExportMenu`).
- **Settings** — Style / Colors / Tokens / Fonts tabs; icons (gear for editor tokenization settings, split-cells for Tokens); **Flowbite `Tabs`**: `classes.content` instead of deprecated `contentClass`.
- **Link palette** — when colors run out, the palette **cycles** (`palettes`).
- **OG image** — SVG generation tweaks for social previews (`og-svg.ts`).

### Fixed

- Ligatures and complex OpenType shaping for **user fonts** in PNG/PDF/SVG/HTML exports (HarfBuzz + opentype outlines).
- Incorrect glyph orientation when using only harfbuzzjs `glyphToPath` (outlines now come from opentype per shaped glyph).

### Removed / replaced

- Older narrow editor/preview pieces for a single-sentence model (`GlossInputRow`, `SentenceField`, `GlossRow`) — replaced by **multi-line cards** and token rows in preview.
- **Preview background image** — removed from Style settings (legacy shares / compact `bg:2` decode as light).

### Dependencies (`bitext`)

- Added: **`harfbuzzjs`** (^0.10.3).
- **`opentype.js`** pinned to **1.3.4** (avoid resolving to mistaken **1.3.5** or problematic **2.x** for exports).

### Known limitations

- **PDF** is still a **raster page** (PNG embedded in PDF), not pure vector SVG→PDF.
- Very large PNG/PDF scales increase file size and browser memory use.

---

Commit range on this branch vs `main` (messages are terse):

`d8a7796` … `9df3353` — multiple lines → new editor → merge better-editor → new interface / UI updates → about updates.
