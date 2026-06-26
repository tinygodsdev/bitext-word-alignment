# Keyword Research — Word Aligner (aligner.tinygods.dev)

**Date:** 2026-06-25 · **Method:** 6 Circles + manual SERP analysis (free tools only — no paid keyword data)
**Companion to:** [`seo-plan.md`](seo-plan.md). This drives the open content tasks there: **C2** (expand 19 example pages), **M2** (homepage guide sections), **M7** (slug renames), **M12** (link acquisition).

> **Caveat on volumes.** This skill does not produce exact search volumes. Numbers below are *relative estimates* from SERP shape + intent, not measured data. Confirm the shortlist in **Google Keyword Planner** / **Ahrefs free generator** before committing writing time. Treat the *ranking* of opportunities as the deliverable, not the absolute numbers.

---

## Inputs (derived from README / site)

| Input | Value |
|---|---|
| **Niche** | Linguistics / language-learning tools — word alignment, interlinear glossing, IPA, parallel text visualization |
| **Audience** | Language learners, language teachers, field/descriptive linguists, conlangers; secondarily AI-agent/dev users of the API |
| **Goal** | Organic traffic → tool usage & authority (free tool, no accounts, no signup funnel). Domain ~2 months old, near-zero backlinks. |
| **Existing content** | Homepage (tool + FAQ), 19 example pages, `/about`, `/api`, `/examples`. **No blog or informational guide hub yet** — this is the biggest gap. |

---

## SERP reality check (who actually ranks)

| Cluster | Competition | Notes / Opportunity |
|---|---|---|
| **"interlinear gloss generator / maker / online tool"** | **Weak** | Top results are bare GitHub pages & dev libraries (leipzig.js, jakewvincent's HTML form), one GH-Pages formatter (*Gloss My Gloss*), a GPT wrapper. **No polished, hosted, learner-friendly product owns this.** ← prime target. |
| **"leipzig glossing rules / how to gloss / glossing abbreviations"** | **Low–Medium** | Authoritative PDFs (MPI Leipzig), Wikipedia, scattered uni course pages. Informational, evergreen, high intent-fit for the tool. Open for a clean, modern explainer that ends in "try it". |
| **"word alignment tool / visualization"** | **Low (but academic)** | Old academic tools (Yawat, Cairo, SWIFT Aligner), GitHub repos, Microsoft/Azure docs. Thin, dated, dev-oriented. Word Aligner already ranks #1 for its exact phrase. |
| **"interlinear Bible / Greek Hebrew word by word"** | **High / saturated** | BibleHub, BibleStudyTools, Scripture4All etc. Big domains, different intent (scripture study, not a generator). **Do not chase head terms** — only a niche "make your own interlinear" angle is viable. |
| **"word-by-word translation" / "IPA transcription"** | **High** | Google Translate, DeepL, Reverso, Readlang dominate; IPA has tooling incumbents. Head terms unwinnable; long-tail "see which word matches / annotate a translation" is open. |

**Strategic read:** Win the **interlinear-gloss tool + glossing how-to** clusters first (weak competitors, exact intent match, evergreen). Use **word alignment / conlang / RTL** long-tails as supporting reach. Avoid head terms owned by Translate-scale incumbents and Bible portals.

---

## 6 Circles Content Plan

### Primary keyword (pillar): **interlinear glossing** / "interlinear gloss generator"
- Intent: informational → tool (commercial). Est. volume: low–moderate, **weak competition**, **intent fit 10/10**.
- Pillar page = a definitive "Interlinear Glossing: complete guide + free generator" hub that links to the tool and to all 9 spokes below. (Lives as a guide page or `/blog` post; also upgrades homepage M2 sections.)

### Sub-topic A — Glossing how-to & standards (informational hub feeding the tool)
1. **How to make an interlinear gloss (step by step)** — `how to gloss a sentence` — est. 200–500/mo
2. **Leipzig Glossing Rules explained (with examples)** — `leipzig glossing rules` — est. 1k–3k/mo ⭐ biggest informational term
3. **Glossing abbreviations cheat sheet (NOM, PFV, 3SG…)** — `glossing abbreviations list` — est. 500–1k/mo ⭐

### Sub-topic B — Word alignment & word-by-word translation (learner reach)
4. **What is word alignment? (and why it beats word-by-word translation)** — `word alignment` / `word-by-word translation` — est. 500–2k/mo
5. **How to show which word means what in a translation** — `which word means what translation` — est. low, high intent-fit
6. **Word alignment vs. interlinear vs. parallel text** — `word alignment vs interlinear` — est. low, strong differentiator (already partly in README)

### Sub-topic C — Conlang, scripts & export (niche, near-zero competition)
7. **How to gloss your conlang (Leipzig-style for invented languages)** — `how to gloss a conlang` — est. 100–300/mo, **near-zero competition**, perfect r/conlangs fit
8. **Glossing right-to-left scripts (Hebrew/Arabic interlinear)** — `interlinear gloss RTL / arabic / hebrew` — est. low, almost no direct competitor
9. **Export interlinear glosses to PNG / SVG / PDF for slides & handouts** — `interlinear gloss image / export` — est. low, transactional, maps to a core feature teachers want

> **Bonus 4 ideas (round out to 13):** "IPA tier + gloss together", "one-to-many & many-to-one word links explained", "interlinear gloss in Word/LaTeX vs. a visual tool" (comparison capturing LaTeX/Word frustration searches), "best interlinear gloss tools (2026)" (listicle that includes Word Aligner honestly).

---

## Prioritized Content Queue

Opportunity = Demand − Competition (1–10 scale; **Competition: lower = easier**). Targets: Opportunity ≥ 3 **and** Intent fit ≥ 6.

| # | Topic | Target keyword | Est. vol/mo | Demand | Comp (low=easy) | Intent fit | Opportunity |
|---|---|---|---|---|---|---|---|
| 1 | Leipzig Glossing Rules explained | leipzig glossing rules | 1k–3k | 8 | 4 | 7 | **+4** ⭐ |
| 2 | Glossing abbreviations cheat sheet | glossing abbreviations list | 500–1k | 7 | 3 | 7 | **+4** ⭐ |
| 3 | How to read an interlinear gloss | how to read interlinear gloss | 200–400 | 6 | 2 | 8 | **+4** ⭐ |
| 4 | Interlinear gloss generator (pillar/tool) | interlinear gloss generator / maker | 100–400 | 5 | 2 | 10 | **+3** ⭐ |
| 5 | How to gloss your conlang | how to gloss a conlang | 100–300 | 5 | 2 | 9 | **+3** ⭐ |
| 6 | How to make an interlinear gloss | how to gloss a sentence | 200–500 | 6 | 3 | 8 | **+3** |
| 7 | What is word alignment | word alignment (tool) | 300–700 | 6 | 4 | 9 | **+2** |
| 8 | Interlinear gloss in Word/LaTeX vs visual | interlinear gloss in word / latex | 300–800 | 6 | 4 | 7 | **+2** |
| 9 | Export glosses to PNG/SVG/PDF | interlinear gloss image export | low | 4 | 2 | 9 | **+2** |
| 10 | Word-by-word translation (head) | word-by-word translation | 5k–20k | 9 | 8 | 5 | +1 ❌ skip / long-tail only |

---

## Quick Wins (low competition, real intent — write these first)

1. **Leipzig Glossing Rules explained** — the single biggest informational term in the niche; current rankers are a dense PDF and Wikipedia. A clean, example-rich, modern page with a "gloss it yourself" CTA can win the secondary intent even if the PDF holds #1.
2. **Glossing abbreviations cheat sheet (NOM/ACC/PFV/3SG…)** — reference content people bookmark and *link to*; strong backlink magnet (helps M12). Word Aligner already shows abbreviation hover-text, so this is on-brand.
3. **How to gloss your conlang** — near-zero competition, a perfectly matched r/conlangs audience, and Word Aligner's custom-font + IPA + gloss-tier features are a genuine differentiator vs. LaTeX.
4. **"Interlinear gloss generator / maker" pillar** — own the exact tool query; competitors are unstyled GitHub pages. Highest intent-fit on the whole list.
5. **How to read an interlinear gloss** — beginner intent, tiny competition, natural top-of-funnel feeder into the tool.

---

## Content Gaps Found

- **No modern, hosted "interlinear gloss generator" with a learner-first explainer.** Competitors are dev libraries, raw GitHub forms, or a GPT wrapper. The tool exists (Word Aligner) but has **no informational guide hub** wrapping it — pure gap.
- **Glossing how-to content is dated/academic.** Top results are PDFs and course handouts; nothing pairs the explanation with an interactive "try it now" surface.
- **Conlang glossing** is barely served outside Reddit threads and LaTeX tutorials — no friendly visual-tool walkthrough.
- **RTL interlinear (Hebrew/Arabic, non-Bible)** has essentially no dedicated generator content.
- **"Word/LaTeX gloss is painful"** is a recurring frustration (Lingword.dotx macros, Covington package, alignment headaches) — a comparison page capturing that pain → the visual tool is wide open.

---

## Community / Competition Insights

- **Terminology to target** (use verbatim in copy): *interlinear gloss*, *glossing*, *morpheme-by-morpheme*, *Leipzig Glossing Rules*, *gloss line / free translation line*, *word alignment*, *interlinear text (IGT)*, *Strong's* (Bible niche — note but don't chase).
- **Competitors (direct, beatable):** *Gloss My Gloss* (neonnaut.github.io — formatter, GH Pages), *jakewvincent/HTML-interlinear-gloss* (raw web form), *leipzig.js* (dev library, not a generator). All thin, none learner-positioned.
- **Competitors (adjacent, do-not-chase):** BibleHub / BibleStudyTools / Scripture4All (Bible interlinear, saturated), Google Translate / DeepL / Reverso / Readlang (head translation), ODIN (academic IGT database).
- **Pain points (turn into article angles):** "how do I line up the gloss with the words in Word?", "which abbreviation for X?", "how do I gloss my conlang properly?", "how to put a gloss in slides/handouts without retyping".
- **Reddit note:** r/conlangs, r/linguistics, r/languagelearning are the right venues for M12 link acquisition — share *genuine example pages* (e.g. Turkish/Avar/Tagalog interlinears), not promo.

---

## How this maps to the existing SEO plan

- **C2 (expand 19 example pages):** weave the Sub-topic A/B keywords into the editorial copy — each example page should name the *linguistic phenomenon* + the relevant gloss abbreviations, and link to the pillar guide once it exists.
- **M2 (homepage guide sections):** convert the planned question-form H3s into the pillar's intro; reuse "word alignment vs interlinear vs parallel text" (item #6) — README already has this copy.
- **M7 (slug renames):** the proposed `-interlinear-gloss` / `-interlinear` slug suffixes align with these target keywords — good, proceed when doing C2.
- **M12 (links):** the **abbreviations cheat sheet** and **Leipzig Rules** pages are the best linkable assets to build first; pitch them (not the homepage) to linguistics/conlang communities and the LINGUIST List.
- **New recommendation:** stand up a small **`/guide` or `/blog` hub** for the 5 quick-win articles. The site currently has no informational tier — these pages capture top-of-funnel search the tool pages can't, and feed internal links + crawl depth to the examples.

---

## Next Steps

1. [ ] Validate the top-6 keywords' volume/difficulty in Google Keyword Planner + Ahrefs free generator (replace the estimates above).
2. [ ] Create the **interlinear glossing pillar** page (generator + guide) and link the homepage + examples to it.
3. [ ] Publish the 3 quick-win linkable assets: **Leipzig Rules**, **abbreviations cheat sheet**, **how to gloss a conlang**.
4. [ ] Fold the matched keywords into **C2** example-page expansions and **M7** slug renames.
5. [ ] Use the cheat sheet + Leipzig page as the spearhead for **M12** community outreach (r/conlangs, r/linguistics, LINGUIST List).

---

## Sources (free SERP research)

- [Interlinear gloss — Wikipedia](https://en.wikipedia.org/wiki/Interlinear_gloss)
- [The Leipzig Glossing Rules (MPI EVA)](https://www.eva.mpg.de/lingua/resources/glossing-rules.php) · [PDF](https://www.eva.mpg.de/lingua/pdf/Glossing-Rules.pdf)
- [Gloss My Gloss (neonnaut)](https://neonnaut.github.io/) · [leipzig.js](https://github.com/bdchauvette/leipzig.js/) · [jakewvincent/HTML-interlinear-gloss](https://github.com/jakewvincent/HTML-interlinear-gloss)
- [interlinear-gloss · GitHub Topics](https://github.com/topics/interlinear-gloss)
- [Yawat: Yet Another Word Alignment Tool](https://www.researchgate.net/publication/220874245_Yawat_Yet_Another_Word_Alignment_Tool) · [Cairo (CMU)](https://www.cs.cmu.edu/~nasmith/papers/smith+jahr.lrec00.pdf) · [Greek Room alignment](https://greekroom.org/align/)
- [BibleHub Interlinear](https://biblehub.com/interlinear/) · [BibleStudyTools Interlinear](https://www.biblestudytools.com/interlinear-bible/) (saturated head cluster — reference only)
- [Readlang](https://readlang.com/) · [Reverso Context](https://context.reverso.net/translation/) (adjacent learner tools)
