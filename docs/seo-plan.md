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

### C2 — Expand all 19 example pages to 600–900 words of unique content
Currently 79–93 words unique per page. SERP expects editorial articles; pages are tool embeds.
Each page needs:
- What linguistic phenomenon the example demonstrates
- Why the word-order / morphology is interesting for this language pair
- 2–3 linguistic observations a learner or teacher would find valuable
- "Try your own sentence" transition into the tool

Start with: Hebrew-Arabic RTL, Japanese-Chinese-English, Classical Nahuatl, Lezgian, Lojban.

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

### H1 — Add TechArticle + BreadcrumbList schema to all 19 example pages
Template-driven — generate from same data object that drives OG tags.

`TechArticle` fields: `headline`, `url`, `image` (ImageObject with CDN URL), `author`, `about` (Language array), `mainEntityOfPage`. Add `datePublished` + `dateModified` to unlock Article rich results.

`BreadcrumbList` for example pages: Word Aligner → Examples → [Page Title].
Also add `BreadcrumbList` to /about and /api.

### H2 — Fix page titles (inner pages too short, inconsistent branding)
- `/examples` → `Word Alignment & Interlinear Gloss Examples · Word Aligner` (was 18 chars)
- `/about` → `About Word Aligner — Free Alignment Visualizer for Linguists`
- `/api` → `Word Aligner API — Generate Alignment URLs Programmatically`
- Example pages → `English–French Word Alignment Example · Word Aligner` (use "Word Aligner", not "Aligner")

Target: 50–65 chars, consistent "Word Aligner" branding everywhere.

### H3 — Add `og:site_name` to global layout ✅
All pages missing `<meta property="og:site_name" content="Word Aligner">`. 5-minute fix in `+layout.svelte`.

**Done:** added `<meta property="og:site_name" content={SITE_NAME} />` to the layout `<svelte:head>`.

### H4 — Add cross-navigation to example pages
Each of 19 example pages is a dead-end. Add:
- 4–6 "Related examples" card links at the bottom
- Visible breadcrumb nav: Word Aligner → Examples → [Page Title]

### H5 — Move partner blocks below primary content on example pages
Affiliate card (e.g., "Wise") appears as second element after H1, before any linguistic content. Move to after 400+ words of educational copy. On mobile this is especially damaging (card is above the editor).

### H6 — Fix touch target sizes in alignment editor
Below 48×48px minimum:
- Tooltip "?" buttons: 16×16px
- Toolbar icon buttons: 36×36px
- Delete row buttons: ~16px
- Word token boxes: varies with word length

Add `min-h-[44px] min-w-[44px]` to `.token-view--clickable`. Apply padding-based tap expansion to all icon-only buttons.

### H7 — Remove Inter font from partner card component ❌ DROPPED (misdiagnosis)
The performance agent attributed the runtime Inter stylesheet to the partner card. **Wrong:** Inter is the *default visualization font* (`DEFAULT_FONT_FAMILY = 'Inter'` in `src/lib/api/align.ts`; source/target/gloss line defaults). It is loaded on demand via `googleFontStylesheetUrl()` when the live preview renders, and is core functionality — not a partner-card waste. No partner component contains a `<svelte:head>` font link. Removing it would break the default preview. Not actioned.

A real adjacent optimization still exists (M3: the two `<head>` Google Fonts stylesheets for UI chrome — Google Sans + Space Grotesk). Track font perf under M3 only.

---

## Medium (fix within 1 month)

### M1 — Fix sitemap: add `lastmod`, remove `changefreq`/`priority` ✅
Google ignores `changefreq` and `priority` (publicly confirmed). `lastmod` is absent from all 24 entries.

**Done:** `sitemap.xml/+server.ts` now emits only `<loc>` + `<lastmod>`. `lastmod` comes from a single maintained `SITE_LASTMOD` constant in `metadata.ts` (bump on content changes — honest single date beats a fabricated per-deploy stamp). Per-page git-derived dates are a future refinement if needed.

### M2 — Expand guide sections on homepage for AI citability
Every H3 section is 30–58 words — too short for AI passage citation. Target 134–167 words per section.

Convert headings to question form:
- "Why a visual beats plain text" → "Why is a visual word alignment better than plain text?"
- "Word alignment vs interlinear translation" → "What is the difference between word alignment and interlinear translation?"
- "Great for language learners and teachers" → "How do language learners and teachers use word alignment?"

### M3 — Self-host Space Grotesk (or preload font files)
3 Google Fonts families require 2 external connections + 2-hop waterfall (HTML → Fonts CSS → font files).

Minimum: add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for Space Grotesk 400 in `app.html`.

Better: self-host via `@fontsource/space-grotesk` (npm). Add `size-adjust`/`ascent-override`/`descent-override` fallback metrics to eliminate FOUT CLS.

### M4 — Add `height` attribute to example page LCP images
All example images have `width="960"` but no `height`. Browser can't reserve space → CLS. Retrieve natural dimensions from DO CDN and add to each `<img>`.

### M5 — Prerender all `/examples/*` pages ✅ ALREADY DONE
Pages are fully static. **Already implemented:** `export const prerender = true` is present on `/examples/+page.ts` and `/examples/[slug]/+page.ts` (and `/privacy`). The performance agent measured ~213ms TTFB likely because the Node server still serves the prerendered HTML from disk (not a CDN edge). Putting a CDN in front of Railway would capture the remaining gain — tracked informally, no code change needed for prerender itself.

### M6 — Add author bio + Person schema to /about
/about is a feature walkthrough with no author narrative. Add ~100 words about Dani's background (language learning, conlangs, linguistics). Add `Person` JSON-LD:
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

### M7 — Rename 5 weak example slugs (with 301 redirects)

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

### M9 — Fix mobile above-fold layout
On 375px: affiliate card renders above editor inputs; live preview SVG requires 3 screen-heights of scrolling.
- Apply `order-last` to affiliate card on small screens
- Anchor preview SVG below line inputs in mobile stack order (or sticky mini-preview)
- Fix hover-only tooltip (`sm:group-hover:block`) — add JS click/tap toggle

### M10 — Trim homepage meta description to ≤155 chars ✅
Current: 243 chars (truncated in SERPs, cuts off audience mention).

**Done:** `DEFAULT_DESCRIPTION` in `metadata.ts` is now 155 chars: `Free word-by-word translation visualizer. Stack lines, add gloss/IPA, draw connectors, then export PNG, SVG, or PDF. For learners, teachers, and linguists.`

### M11 — Lazy-load Tally.so feedback widget
Tally has 1-hour `max-age` (controlled by Tally). Replace static `<script async>` in `<head>` with demand-load triggered on "Send feedback" click via `window.Tally.openPopup()`.

### M12 — Start link acquisition campaign
Domain ~2 months old, zero third-party backlinks (expected). First moves:
1. **Show HN** — "Free word alignment visualizer with interlinear gloss export (SVG/PDF)"
2. **ProductHunt launch** — OG image API already produces a clean preview
3. **Reddit** — r/linguistics, r/conlangs, r/languagelearning, r/learnJapanese (genuine examples, not promotional)
4. **LINGUIST List** software directory submission
5. **Public APIs GitHub repo** (under "Education" category) — `github.com/public-apis/public-apis`

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

**Day 2** (~3 h)
- [ ] H1 — BreadcrumbList on all interior pages
- [ ] H1 — TechArticle JSON-LD on all 19 example pages (template)
- [ ] H2 — Fix all inner page titles

**Week 1** (~8–10 h)
- [ ] C2 — Expand first 5 example pages (Hebrew-Arabic, Japanese-Chinese-EN, Nahuatl, Lezgian, Lojban)
- [ ] H5 — Move partner blocks below content on example pages
- [ ] M4 — Add `height` to example LCP images
- [ ] M3 — Self-host Space Grotesk or add font preload

**Week 2–3**
- [ ] C2 — Expand remaining 14 example pages
- [ ] H4 — Cross-navigation "Related examples" on all example pages
- [ ] M9 — Fix mobile layout (affiliate card ordering, tooltip toggle)
- [ ] H6 — Fix touch targets in alignment editor
- [ ] M6 — Author bio + Person JSON-LD on /about

**Week 4+**
- [ ] M2 — Expand homepage guide sections + convert headings to questions
- [ ] M7 — Rename 5 slugs + 301 redirects
- [ ] M12 — Show HN, ProductHunt, Reddit launch
- [ ] M11 — Lazy-load Tally
- [ ] Backlog items
