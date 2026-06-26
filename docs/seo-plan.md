# SEO Plan — aligner.tinygods.dev

**Audit date:** 2026-06-25 | **Health score:** 57 / 100 → target ~76 after fixes

> **Progress (2026-06-25):** First implementation batch done — C1, C3, C4, H3, M1, M8, M10. Verified with typecheck/lint/tests/build + a live production-server smoke test (headers on SSR *and* prerendered pages, JSON-LD, sitemap, llms.txt). Two corrections from code review: **M5** (prerender examples) was **already done** (`prerender = true` on `/examples` routes); **H7** (remove Inter font) is a **misdiagnosis** — Inter is the default visualization font loaded on demand, not a partner-card waste — so it is dropped. Completed items are marked ✅ below.

---

## Scores by category

| Category | Current | Target |
|---|---|---|
| Technical SEO | 71 | 85 |
| Content Quality | 61 | 75 |
| On-Page SEO | 52 | 74 |
| Schema / Structured Data | 20 | 72 |
| Performance (CWV) | 65 | 75 |
| AI Search Readiness (GEO) | 52 | 68 |
| Images | 68 | 78 |
| **Total** | **57** | **~76** |

---

## Critical

### C1 — Add HTTP security headers ✅
No security headers on any response.

**Done:** added a custom `bitext/server.js` that wraps adapter-node's `handler` and sets the headers on **every** response (a `hooks.server.ts` would miss prerendered pages, which sirv serves before the hook runs). Dockerfile `CMD` switched to `node server.js`.

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### C2 — Expand all 19 example pages to 600–900 words of unique content ✅
Done. All 19 pages now carry ~600+ words of phenomenon-specific content via a structured `sections`
model (`types-gallery.ts`: paragraph / gloss-table / links blocks; rendered by
`ExampleSections.svelte`). Template per page: overview → token-by-token gloss table → the phenomenon
→ glossing conventions (links **up** to the cheat sheet) → recreate in editor → curated "See also"
(links **across** to phenomenon-related siblings). Generic glossing explanation lives on the guide
hub (linked), not repeated per page, to avoid near-duplicate content. Diagram moved above the prose.
Descriptions cleaned of em dashes (COPYRIGHT).

**New: `/guide` informational hub** (closes the "no informational tier" gap from keyword-research):
- `/guide/glossing-abbreviations` — cheat sheet (40 labels + notation marks) + DefinedTermSet schema
- `/guide/leipzig-glossing-rules` — flagship explainer (top informational term)
- `/guide/how-to-read-an-interlinear-gloss` — beginner funnel
- `/guide/how-to-gloss-a-conlang` — near-zero-competition, conlang differentiator
- `/guide/interlinear-gloss-generator` — pillar for the exact tool query
- `/guide` — hub index
Shared shell `GuideLayout.svelte` + `guideArticle()` schema. Cluster wired both ways (hub ↔ examples
↔ editor). Reachable from: homepage menu (Guides), homepage SEO content block, footer, examples nav,
sitemap.

### C3 — Add WebApplication + WebSite JSON-LD to homepage ✅
No `SoftwareApplication`/`WebApplication` schema exists. `FAQPage` is present — keep it (AI/LLM citation value; Google retired FAQ rich results May 7, 2026).

**Done:** extended `JsonLd.svelte` with `WebSite` + `WebApplication` blocks (both emitted on the homepage alongside the existing FAQPage). `WebApplication` omits `aggregateRating` on purpose — no real review data, so it won't earn a Google rich result, but it's valid and helps entity/AI understanding. Author constants added to `brand.ts`.

Add to homepage `<svelte:head>`:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Word Aligner",
  "url": "https://aligner.tinygods.dev/",
  "description": "Free browser-based word alignment and interlinear gloss visualizer. Stack multiple lines, draw word-to-word connectors, add IPA or gloss tiers, export as PNG, SVG, PDF, or HTML.",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "featureList": ["Word-by-word translation visualization","Interlinear gloss support","RTL script support","Export to PNG/SVG/PDF/HTML","Free REST API"],
  "creator": { "@type": "Person", "name": "Dani Polani", "email": "dani@tinygods.dev" }
}
```

Also add `WebSite` block on homepage only:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Word Aligner",
  "url": "https://aligner.tinygods.dev/",
  "publisher": { "@type": "Person", "name": "Dani Polani" }
}
```

### C4 — Create `/llms.txt` ✅
Returns 404. Highest-leverage AI readiness action. Include: tool name, description, primary use cases, links to homepage / /about / /api / /examples / top 6 example pages, terms for AI training use.

**Done:** added `bitext/static/llms.txt` (title + summary + Core pages + Example walkthroughs + Optional sections).

---

## High (fix within 1 week)

### H1 — Add TechArticle + BreadcrumbList schema to all 19 example pages ✅
Template-driven — generate from same data object that drives OG tags.

**Done:** new reusable `StructuredData.svelte` component + builders in `src/lib/seo/structured-data.ts`. Each example page now emits `BreadcrumbList` (Word Aligner → Examples → [title]) + `TechArticle` (headline, description, ImageObject with real width/height, author+publisher Person, `mainEntityOfPage`, `inLanguage`, `datePublished`/`dateModified` = `SITE_LASTMOD`). `BreadcrumbList` also added to `/about`, `/api`, and `/examples` index. Skipped `about` (Language array) — no per-example language data field; not worth adding now. Verified via live curl: example page renders BreadcrumbList + TechArticle + ImageObject + WebPage + Person.

### H2 — Fix page titles (inner pages too short, inconsistent branding) ✅
Decision (user): "Word Aligner" in SEO titles/og + keep short "Aligner" in in-product UI (nav/footer/tooltip); lengthen inner titles with keywords.

**Done (verified lengths):**
- `/examples` → `Word Alignment & Interlinear Gloss Examples · Word Aligner` (58)
- `/about` → `About Word Aligner — Free Word Alignment & Gloss Tool` (53)
- `/api` → `Word Aligner API — Generate Alignment URLs Programmatically` (59)
- Example pages → `{title} · Word Aligner` (was `· Aligner`)

Visible H1s and nav breadcrumbs keep "Aligner" per the decision. Bonus: added the missing `og:image` + Twitter card to `/api` (was absent).

### H3 — Add `og:site_name` to global layout ✅
All pages missing `<meta property="og:site_name" content="Word Aligner">`. 5-minute fix in `+layout.svelte`.

**Done:** added `<meta property="og:site_name" content={SITE_NAME} />` to the layout `<svelte:head>`.

### H4 — Add cross-navigation to example pages ✅
Each of 19 example pages was a dead-end.

**Done:** added a "More examples" section to every example page — a 6-card grid of sibling examples (ring order: the 6 following the current slug, wrapping) + a "Browse all examples" link. The loader (`+page.ts`) returns the `related` list. This connects all 19 pages into a navigable cluster (every page links to 6 others + the index), distributing crawl/PageRank and giving search visitors a path onward. Visible breadcrumb nav (`← Aligner · Examples`) already existed; matching `BreadcrumbList` schema was added in H1.

### H5 — Move partner blocks below primary content on example pages ✅ ALREADY FINE
Re-checked the actual `examples/[slug]/+page.svelte`: the partner banner is already the **last** element (after body copy, figure, and the "Open in Editor" CTA). The content agents' "card before content" claim conflated this with the **homepage mobile** layout, where the Preply card does sit above the editor — that's tracked under **M9**, not here. No change needed on example pages.

### H6 — Fix touch target sizes in alignment editor ❌ WONTFIX (overstated)
The proposed fix is inappropriate for this tool. Word tokens (`.token-view--clickable`) **are the rendered diagram text**, sized by the user's per-line font setting (12–64px) and baseline-aligned. Forcing `min-h-[44px] min-w-[44px]` would break the alignment layout — that's the whole visualization. The `?` partner button (16px) was verified to tap reliably on a real device. Toolbar icon buttons are 36px (acceptable). No change — this is inherent to a typography/alignment editor.

### H7 — Remove Inter font from partner card component ❌ DROPPED (misdiagnosis)
The performance agent attributed the runtime Inter stylesheet to the partner card. **Wrong:** Inter is the *default visualization font* (`DEFAULT_FONT_FAMILY = 'Inter'` in `src/lib/api/align.ts`; source/target/gloss line defaults). It is loaded on demand via `googleFontStylesheetUrl()` when the live preview renders, and is core functionality — not a partner-card waste. No partner component contains a `<svelte:head>` font link. Removing it would break the default preview. Not actioned.

A real adjacent optimization still exists (M3: the two `<head>` Google Fonts stylesheets for UI chrome — Google Sans + Space Grotesk). Track font perf under M3 only.

---

## Medium (fix within 1 month)

### M1 — Fix sitemap: add `lastmod`, remove `changefreq`/`priority` ✅
Google ignores `changefreq` and `priority` (publicly confirmed). `lastmod` is absent from all 24 entries.

**Done:** `sitemap.xml/+server.ts` now emits only `<loc>` + `<lastmod>`. `lastmod` comes from a single maintained `SITE_LASTMOD` constant in `metadata.ts` (bump on content changes — honest single date beats a fabricated per-deploy stamp). Per-page git-derived dates are a future refinement if needed.

### M2 — Expand guide sections on homepage for AI citability ✅
Done, reframed away from blanket word-padding (which would be filler). What shipped:
- Homepage explainer/comparison H3s converted to question form (matches AI Overviews / featured
  snippets, no added bulk).
- New compact "Glossing notation at a glance" snippet (common labels + marks) linking to the cheat
  sheet — a useful reference pulled from the guides, not water.
- Light enrichment of the thin "vs parallel text" section with a concrete distinction.
- Homepage links into the `/guide` hub (menu, "Glossing guides" block, conlang contextual link,
  "Use it from your AI assistant" block).
- Legacy em dashes removed from `SeoIntro`/`SeoSections`; FAQPage JSON-LD synced to visible copy.
Deliberately **not** done: padding every section to 134–167 words (judged as filler).

Original audit note (kept for reference) — every H3 section was 30–58 words. Convert headings to
question form:
- "Why a visual beats plain text" → "Why is a visual word alignment better than plain text?"
- "Word alignment vs interlinear translation" → "What is the difference between word alignment and interlinear translation?"
- "Great for language learners and teachers" → "How do language learners and teachers use word alignment?"

### M3 — Self-host Space Grotesk (or preload font files) ❌ DROPPED (field data)
Fonts are render-blocking (lab shows ~750ms each), but they affect **FCP/LCP — which already PASS in the field** (CrUX: mobile LCP 2.1s green, desktop 1.5s; **CLS already 0**, so the FOUT-CLS rationale is moot). Self-hosting wouldn't flip any ranking verdict. Also: "Google Sans" is in fact a public Google Font now and loads fine (the visual agent's note was stale). Not worth the change. (Render-blocking Inter could be deferred cheaply if ever bundling other font work — cosmetic.)

### M4 — Add `height` attribute to example page LCP images ✅
All example images had `width="960"` but no `height`. Browser can't reserve space → CLS.

**Done:** added `scripts/write-example-dimensions.ts` (`npm run examples:dimensions`) that reads the rendered PNGs in `.cache/example-previews/` and emits `src/lib/examples/preview-dimensions.ts` (intrinsic 1920×N per slug). The example `<img>` now sets real `width`/`height` (+ `h-auto w-full` to stay responsive), and the same values feed `og:image:width`/`height` and the `TechArticle` ImageObject. Regenerate the map after re-rendering previews.

### M5 — Prerender all `/examples/*` pages ✅ ALREADY DONE
Pages are fully static. **Already implemented:** `export const prerender = true` is present on `/examples/+page.ts` and `/examples/[slug]/+page.ts` (and `/privacy`). The performance agent measured ~213ms TTFB likely because the Node server still serves the prerendered HTML from disk (not a CDN edge). Putting a CDN in front of Railway would capture the remaining gain — tracked informally, no code change needed for prerender itself.

### M6 — Add author bio + Person schema to /about ✅
/about is a feature walkthrough with no author narrative.

**Done:** added an "About the creator" section (+ TOC entry) with a short bio (fantasy author, creator of the conlang Lemu Teloku, tool-maker; psychologist & linguist by training, self-taught dev) linking to the personal site, and a `Person` JSON-LD (`personCreator()` in `structured-data.ts`, with `knowsAbout` + `description`) emitted alongside the breadcrumb. No location/birthplace; no LinkedIn per request.

Reference `Person` shape:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dani Polani",
  "email": "dani@tinygods.dev",
  "url": "https://danipolani.github.io/en/",
  "knowsAbout": ["Word Alignment","Interlinear Glossing","Constructed Languages","Computational Linguistics"]
}
```

### M7 — Rename 5 weak example slugs (with 301 redirects) → MOVED to content task (do with C2)
Deferred to the content task "SEO расширение контента страниц примеров": renaming a slug changes the URL and also requires a 301 redirect **and** renaming the CDN preview asset (`{slug}.png` on DO Spaces + the `preview-dimensions.ts` key + local cache). Cheapest to do per-page while expanding that page's content (C2), before the URLs are indexed. Low SEO value on its own.

| Current | Problem | New |
|---|---|---|
| `hebrew-arabic-english-rtl` | No format keyword | `hebrew-arabic-english-rtl-interlinear` |
| `tagalog-verbal-aspect-paradigm` | "paradigm" ≠ SEO signal | `tagalog-verbal-aspect-interlinear-gloss` |
| `russian-evening-run-interlinear` | Opaque topic tag | `russian-case-agreement-interlinear-gloss` |
| `avar-camel-theft-interlinear` | Opaque outside textbooks | `avar-ergative-agreement-interlinear` |
| `turkish-infinitive-gloss-come-out` | Morpheme value, not a query | `turkish-one-to-many-morpheme-gloss` |

Set up 301 redirects from old → new before deploying.

### M8 — Add `X-Robots-Tag: noindex` to `/api/og` ✅
OG image generator endpoint returns 200 with no noindex signal. Not in sitemap (correct), but could be accidentally indexed.

**Done:** added `'X-Robots-Tag': 'noindex'` to the `/api/og` response headers.

### M9 — Fix mobile above-fold layout ❌ WONTFIX (mostly overstated)
Verified against the code:
- **"Hover-only tooltip"** — wrong. `PartnerBannerShell.svelte` already has `onclick={toggleWhy}` + `aria-expanded` + `touch-manipulation`; the tooltip opens on tap. Confirmed tapping fine on a real device.
- **"Preview 3 screens down / card on 30% of viewport"** — overstated. The partner intro card is one compact banner in the header's intro zone; on mobile it sits between the intro text and the editor. Reordering it cleanly would need restructuring the header/sidebar (card and editor live in separate containers, so `order` can't swap them). Low value, non-trivial fix.

Owner judged mobile adaptivity acceptable for an inherently multi-panel editor. No change.

### M10 — Trim homepage meta description to ≤155 chars ✅
Current: 243 chars (truncated in SERPs, cuts off audience mention).

**Done:** `DEFAULT_DESCRIPTION` in `metadata.ts` is now 155 chars: `Free word-by-word translation visualizer. Stack lines, add gloss/IPA, draw connectors, then export PNG, SVG, or PDF. For learners, teachers, and linguists.`

### M11 — Lazy-load Tally.so feedback widget ✅ (+ GA deferred)
**Done:** removed the eager `<script async>` for **both** Tally and GA gtag.js from `app.html`. The tiny gtag shim stays (calls queue in `dataLayer`); the gtag.js library + Tally widget now load on first user interaction or `requestIdleCallback`, whichever first (`src/lib/analytics/defer-third-party.ts`, wired in `+layout.svelte`). This pulls ~155 KiB (GA) + the Tally script off the critical path — the INP/TBT direction. Tally binds its `data-tally-open` buttons on load; gtag events flush from the queue. Verified the eager scripts are gone from initial HTML and the shim remains.

Note: "Google Tag Manager 155 KiB" in Lighthouse is just gtag.js served from the `googletagmanager.com` host — it IS the GA4 tag (`G-…`), not the separate GTM container product. One thing, kept, just deferred.

### M12 — Start link acquisition campaign
Domain ~2 months old, zero third-party backlinks (expected). First moves:
1. **Show HN** — "Free word alignment visualizer with interlinear gloss export (SVG/PDF)"
2. **ProductHunt launch** — OG image API already produces a clean preview
3. **Reddit** — r/linguistics, r/conlangs, r/languagelearning, r/learnJapanese (genuine examples, not promotional)
4. **LINGUIST List** software directory submission
5. **Public APIs GitHub repo** (under "Education" category) — `github.com/public-apis/public-apis`

### M13 — Custom 404 page (found outside the audit) ✅
The 404 was bare "404 Not Found" — no branding, no navigation.

**Done:** added `src/routes/+error.svelte` — branded layout (status, friendly heading/message), CTA "Open Word Aligner" + links to examples and API docs, and `noindex`. Renders inside the existing layout (theme/fonts) for all error statuses (404 and others).

### M14 — Accessibility: label the range sliders ✅ (found via Lighthouse)
Lighthouse "agent accessibility" flagged the text-size slider as a form element without a label (also a normal a11y gap). **Done:** added `aria-label` to all five Flowbite `Range` sliders (line thickness, line opacity, line-pair gap, text size, word gap). Helps screen readers and the "AI agent accessibility" category — on-brand given the API/skill target AI agents.

---

## Core Web Vitals — field data (CrUX, 28-day) & the real INP lever

Captured 2026-06-25 from PageSpeed/CrUX:

| | LCP | INP | CLS | Verdict |
|---|---|---|---|---|
| **Desktop** | 1.5s ✅ | 81ms ✅ | 0.05 ✅ | **PASSED** |
| **Mobile** | 2.1s ✅ | **269ms ⚠️** | 0 ✅ | **FAILED (INP only)** |

The only failing metric is **mobile INP (269ms, needs-improvement; poor is >500ms)**. LCP and CLS already pass everywhere — which is why M3 (fonts) was dropped and render-blocking CSS is low priority (they target already-passing metrics).

**Cheap INP-direction work done:** deferred GA + Tally off the critical path (M11), labelled sliders (M14). These reduce load-time main-thread contention and may help early-interaction INP — confirm in CrUX over ~28 days.

**Remaining real INP lever (NOT done — needs profiling):** the editor's own interaction cost — tapping a token triggers Svelte reactivity → link-graph recompute → SVG redraw — plus the heavy `nodes/2` app chunk (~167 KiB, ~129 KiB unused per Lighthouse) and 2 long main-thread tasks. Options: code-split heavy sub-components (export/font/color dialogs) via dynamic `import()`, and optimize the per-tap update (batch DOM writes, memoize). This is a measured mini-project; only pursue if mobile INP doesn't drop below 200ms after the cheap changes settle in CrUX. CWV is a minor ranking factor and desktop already passes, so this is UX-driven, not urgent.

---

## Low (backlog)

- **H1→H3 heading skip on homepage** — partner card widget uses H3 before any H2; use `<p>` or ARIA role
- **Branding "Aligner" vs "Word Aligner"** — standardize to "Word Aligner" everywhere except PWA `short_name`
- **`og:image:width`/`height` missing on example pages** — add CDN image dimensions
- **IndexNow key for Bing/Yandex** — one-time setup, accelerates non-Google indexing
- **558 KB GIF in `<details>`** — convert to `<video autoplay muted loop playsinline>` (~80–100 KB WebM)
- **`<noscript>` fallback absent** — add minimal redirect to /about
- **Verify Google Sans resolves publicly** — it's an internal Google typeface, may not load for users
- **`twitter:site` / `twitter:creator`** — add if creator has X/Twitter handle
- **Add `/examples` to footer nav** — secondary crawl path to all 19 depth-2 pages
- **Example card SVGs on homepage lack `aria-label`** — add for screen reader accessibility
- **Dark mode flash on load** — SSR renders `class="light"` unconditionally; apply preference via inline script before hydration

---

## What is already good (do not change)

- `robots.txt` — correct, allows all crawlers, sitemap declared
- HTTPS + 301 HTTP redirect — working
- Canonical tags — correct self-referencing on all pages
- OG + Twitter card tags — fully present on all pages including example pages
- `FAQPage` JSON-LD on homepage — valid, keep for AI/LLM benefit
- SSR pre-rendering — SvelteKit serves full HTML, all 24 pages crawlable without JS
- Sitemap XML — valid, 24 URLs, correct namespace, HTTP 200
- GA4 — async, non-blocking
- DigitalOcean Spaces CDN for example images — 33ms TTFB, immutable cache
- All example images have descriptive `alt` text
- Crawl depth — max 2 clicks from homepage, optimal

---

## Execution order (recommended)

**Day 1** (~2 h) — ✅ DONE 2026-06-25
- [x] C1 — Security headers (custom `server.js`, covers prerendered pages too)
- [x] H3 — `og:site_name` in global layout
- [x] C3 — WebApplication + WebSite JSON-LD on homepage
- [~] H7 — Remove Inter font — DROPPED (misdiagnosis; Inter is the default viz font)
- [x] M10 — Trim meta description
- [x] M1 — Fix sitemap (lastmod, remove changefreq/priority)
- [x] M8 — Add `X-Robots-Tag: noindex` to `/api/og`
- [x] C4 — Create `/llms.txt`
- [x] M5 — Prerender `/examples/*` — already in place

**Day 2** (~3 h) — ✅ DONE 2026-06-25
- [x] H1 — BreadcrumbList on all interior pages (examples, about, api, example pages)
- [x] H1 — TechArticle JSON-LD on all 19 example pages (template)
- [x] H2 — Fix all inner page titles ("Word Aligner" brand + keyword-lengthened)
- [x] M4 — Add `width`/`height` to example LCP images (+ og:image dims)
- [x] M6 — Author bio + Person JSON-LD on /about
- [x] H5 — already fine on example pages (partner banner is last); homepage mobile → M9

**Day 3** (perf/a11y) — ✅ DONE 2026-06-25
- [x] M11 — Lazy-load Tally (+ defer GA gtag.js) off the critical path
- [x] M14 — aria-label all Range sliders (a11y + AI-agent accessibility)
- [~] M3 — Fonts — DROPPED (target LCP/CLS already pass in field; Google Sans is public)

**Week 2–3**
- [x] H4 — Cross-navigation "Related examples" on all example pages
- [x] M13 — Custom 404 page (`+error.svelte`)
- [~] M9 — Mobile layout — WONTFIX (tooltip already tappable; card placement minor/inherent)
- [~] H6 — Touch targets — WONTFIX (tokens are user-sized diagram text; can't force 44px)

**Remaining (technical):**
- [ ] (optional, measured) Editor INP — code-split heavy sub-components + optimize per-tap update. Only if mobile INP stays >200ms in CrUX after the deferrals settle. Needs profiling.

**Content task (separate):** C2 — expand 19 example pages; M2 — homepage guide sections; M7 — rename 5 slugs (+301 +CDN); M12 — link acquisition.
