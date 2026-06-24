# Thin Content Problem Analysis and Solution Plan
## BLD-33: Find the solutions for thin content problem

**Date:** June 24, 2026
**Site:** https://aligner.tinygods.dev/
**Repository:** https://github.com/tinygodsdev/bitext-word-alignment

---

## 1. Research Summary: "Crawled - Currently Not Indexed" Problem

### Understanding the Issue

The "crawled - currently not indexed" status means Google successfully fetched the pages but decided not to include them in the search index. Based on 2026 research, this is **not a technical error** but an **editorial decision** by Google based on content quality signals.

### Key Findings from 2026 Research

#### What is "Thin Content" in 2026?

Thin content is defined by **lack of original value and information gain**, not just low word count. Google's algorithms (especially after the Helpful Content updates integrated into core ranking in March 2024) now prioritize:

1. **Information gain** - Does the page add non-redundant information compared to what's already indexed?
2. **Original insights** - Real experience, first-hand examples, unique data
3. **Substantive value** - Pages that comprehensively answer search intent
4. **Structured, scannable content** - Tables, checklists, FAQs, comparison matrices

#### Primary Causes of "Crawled - Not Indexed"

According to 2026 sources, approximately 80% of cases are due to:

1. **Thin or low-value content** (most common - ~40-50%)
2. **Duplicate content** (~20-30%)
3. **Weak internal linking** (~15-20%)
4. **Technical/rendering issues** (~10-15%)

#### Evidence-Based Solutions

Multiple sources from 2026 converge on these solutions:

1. **Content Enhancement:**
   - Add 800+ words of unique, substantive content for informational pages
   - Include structured elements: comparison tables, checklists, FAQs
   - Add original images, diagrams, screenshots showing first-hand use
   - Provide specific examples, data, expert perspectives
   - Focus on "information gain" - what unique value does this page offer?

2. **Internal Linking Architecture:**
   - Implement pillar-cluster model (still the 2026 standard)
   - Ensure important pages are within 3 clicks of homepage
   - Add 3-5 contextual internal links per page
   - Use descriptive, keyword-rich anchor text (not "click here")
   - Link from high-authority pages to pages that need indexing
   - Bi-directional linking: pillar ↔ cluster pages

3. **Structured Content:**
   - Comparison tables for feature matrices or alternative comparisons
   - FAQ sections with Schema markup
   - Step-by-step guides with numbered lists
   - Use cases with concrete examples
   - Answer-first structure (first 2 sentences should contain a direct answer)

4. **After Making Changes:**
   - Use URL Inspection tool in Google Search Console
   - Request indexing (only after meaningful improvements)
   - Wait 2-4 weeks for re-evaluation
   - Don't spam the request - one submission per improvement cycle

---

## 2. Current State Analysis

### Homepage (/)

**Current Content:**
- Interactive tool (line editor, preview, settings)
- Brief intro paragraph (2-3 sentences)
- Partner banners
- Two example images with captions
- SEO sections component with ~800 words of content (SeoIntro + SeoSections)

**Strengths:**
- Already has substantial SEO content sections
- Has images (2 examples)
- Functional tool demonstration

**Weaknesses:**
- No tables or structured comparison content
- No FAQ section (despite having Q&A in SeoSections)
- Limited internal links to example pages
- Could benefit from use case comparison table
- Missing step-by-step "how to use" guide with screenshots

**Word Count:** Approximately 1,000-1,200 words of text content (good baseline)

### Examples Gallery Page (/examples)

**Current Content:**
- Title and description
- Grid of example cards with images, titles, descriptions
- Each card links to individual example page
- Clean, minimal layout

**Strengths:**
- Good visual presentation with images for each example
- Clear descriptions

**Weaknesses:**
- Very minimal text content (~200-300 words total)
- No categorization or grouping of examples
- No explanation of what makes each category useful
- No use case guidance
- Missing comparison table showing example features
- No FAQ about how to use examples
- Limited internal links back to main tool or feature pages

**Word Count:** ~250 words (significantly thin)

### Individual Example Pages (/examples/[slug])

**Current Content:**
- Title
- Description (1-2 sentences)
- Body text (1-2 short paragraphs)
- Single preview image
- Links to examples gallery and editor

**Strengths:**
- Has unique image for each example
- Clean layout

**Weaknesses:**
- Extremely minimal content (100-200 words per page)
- No explanation of linguistic concepts being demonstrated
- No "what you can learn" section
- No related examples links (lateral cluster linking)
- No step-by-step breakdown of the example
- Missing tables showing the alignment structure
- No use case explanation

**Word Count per page:** ~150 words (very thin)

---

## 3. Detailed Solution Plan

### Strategy Overview

We'll implement a pillar-cluster content architecture:
- **Homepage** = Primary pillar (already substantial, needs enhancement)
- **About page** = Secondary pillar (documentation)
- **Examples gallery** = Tertiary pillar (needs major enhancement)
- **Individual examples** = Cluster pages (need significant expansion)

### Phase 1: Examples Gallery Page Enhancement (Highest Priority)

This is the most critical page after the homepage. Current state is very thin (~250 words).

#### Actions:

1. **Add Comprehensive Introduction Section** (300-400 words)
   - Expand the current description
   - Explain the value of browsing examples
   - Describe different categories of examples
   - Add use cases: "When to use word alignment examples"

2. **Create Example Categories Section**
   Group examples into logical categories with explanations:
   
   ```markdown
   ## Simple Bilingual Alignments
   Perfect for language learners and teachers showing direct word-to-word correspondences.
   - English-French
   - [other simple pairs]
   
   ## Interlinear Glosses
   Demonstrate linguistic analysis with morpheme-by-morpheme breakdowns.
   - Turkish with IPA
   - Classical Nahuatl
   - [etc.]
   
   ## Right-to-Left Scripts
   Show how the tool handles Hebrew, Arabic, and mixed-direction text.
   - Hebrew + Arabic + English
   - [etc.]
   
   ## Advanced Linguistic Examples
   Complex cases showing morphology, reduplication, and grammatical features.
   - Tagalog reduplication
   - German umlaut plurals
   - [etc.]
   ```

3. **Add Feature Comparison Table**
   Create a table showing which examples demonstrate which features:
   
   | Example | RTL Support | IPA | Glosses | Morpheme Splits | Best For |
   |---------|-------------|-----|---------|----------------|----------|
   | English-French | No | No | No | No | Beginners, classroom use |
   | Turkish Interlinear | No | Yes | Yes | Yes | Linguistics students |
   | Hebrew-Arabic | Yes | No | No | No | RTL script demos |
   | etc. | | | | | |

4. **Add FAQ Section**
   ```markdown
   ## Frequently Asked Questions About Examples
   
   ### How do I adapt an example to my own language pair?
   [Answer with step-by-step instructions]
   
   ### Can I create examples with more than 4 lines?
   [Answer]
   
   ### Which example should I start with?
   [Answer with decision guide]
   
   ### How do I export an example?
   [Answer]
   ```

5. **Add "How to Use Examples" Section** (200-300 words)
   Step-by-step guide:
   - Browse the gallery
   - Click an example
   - Open in editor
   - Modify for your needs
   - Export or share

6. **Strengthen Internal Links**
   - Link to homepage tool in introduction
   - Link to /about page for feature documentation
   - Link to /api page for programmatic use
   - Link to each example category from the descriptions

**Target word count:** 1,200-1,500 words (currently ~250)

---

### Phase 2: Individual Example Page Enhancement

Each example page needs substantial expansion from ~150 words to 600-800 words.

#### Template for Each Example:

1. **Enhanced Introduction** (keep current, add 50-100 words)
   - Current description is good, just expand slightly
   - Add "What you'll learn" bullet points

2. **Add "Understanding This Example" Section** (200-300 words)
   - Explain the linguistic concepts being demonstrated
   - Break down the alignment structure
   - Explain why certain words map the way they do
   - Highlight interesting features (reordering, one-to-many, etc.)

3. **Add Alignment Structure Table**
   Show the actual word mappings in table form:
   
   ```markdown
   ## Word Alignment Structure
   
   | Source | Target | Type | Notes |
   |--------|--------|------|-------|
   | Hello | Bonjour | 1:1 | Direct greeting correspondence |
   | world | le monde | 1:2 | English requires article in French |
   ```

4. **Add "Use Cases" Section** (100-150 words)
   - When to use this type of alignment
   - Target audience (teachers, students, linguists)
   - Real-world applications

5. **Add "Related Examples" Section**
   - Link to 3-5 similar examples (lateral cluster linking)
   - Explain the relationship
   - Use descriptive anchor text

6. **Add "Try It Yourself" Section** (100-150 words)
   - Step-by-step instructions to modify this example
   - Suggestions for variations
   - Tips for similar language pairs

7. **Add FAQ Section** (if relevant)
   Example-specific questions:
   - "Why does [word X] map to [word Y]?"
   - "How can I add IPA to this example?"
   - etc.

**Target word count per example:** 600-800 words (currently ~150)

---

### Phase 3: Homepage Enhancement

The homepage already has good content (~1,000-1,200 words), but can be improved:

#### Actions:

1. **Enhance Examples Section**
   - Currently shows 2 example images
   - Add a third image
   - Add a comparison table showing example types
   - Add internal links to specific example categories

2. **Add Feature Comparison Table**
   Create a table in the SEO sections showing features vs. alternatives:
   
   ```markdown
   ## Word Aligner vs Other Approaches
   
   | Feature | Word Aligner | Plain Interlinear | Side-by-Side Text |
   |---------|--------------|-------------------|-------------------|
   | Shows word reordering | Yes (crossed lines) | No | No |
   | One-to-many mappings | Yes | Limited | No |
   | Export as image | Yes (PNG/SVG/PDF) | No | No |
   | Shareable links | Yes | No | No |
   | etc. | | | |
   ```

3. **Enhance FAQ Section**
   - The current SeoSections has Q&A content but not as a formal FAQ
   - Restructure to be more visible
   - Add FAQ Schema markup (JsonLd component should include it)
   - Add 2-3 more common questions

4. **Add "Quick Start Guide"** (150-200 words)
   Numbered list with screenshots references:
   1. Add your first line
   2. Add a second line with translation
   3. Click a word in line 1
   4. Click its match in line 2
   5. Export or share

5. **Add Use Cases Table**
   ```markdown
   | User Type | Primary Use Case | Key Features |
   |-----------|-----------------|--------------|
   | Language Learners | See word-for-word translations | Visual mappings, simple exports |
   | Teachers | Create handouts | PNG/SVG export, clean layouts |
   | Linguists | Document glosses | IPA support, morpheme boundaries |
   | Conlangers | Share language examples | Custom fonts, interlinear glosses |
   ```

6. **Strengthen Internal Linking**
   - Link to /examples from multiple places in content (not just header)
   - Link to /about from feature mentions
   - Link to /api from mentions of programmatic use
   - Link to individual popular examples from the Examples section
   - Use descriptive anchor text (e.g., "Turkish interlinear gloss example" not "click here")

**Target additions:** +400-500 words, 2-3 tables, better internal linking

---

### Phase 4: Internal Linking Strategy

Implement pillar-cluster architecture:

#### Pillar-Cluster Relationships:

```
Homepage (Primary Pillar)
├─→ About (Secondary Pillar / Documentation)
├─→ API (Tertiary Pillar / Developer Docs)
├─→ Examples Gallery (Tertiary Pillar)
│   ├─→ Simple Bilingual Examples (Cluster)
│   │   ├─→ English-French (Sub-cluster)
│   │   └─→ [other simple examples]
│   ├─→ Interlinear Gloss Examples (Cluster)
│   │   ├─→ Turkish with IPA (Sub-cluster)
│   │   ├─→ Classical Nahuatl (Sub-cluster)
│   │   └─→ [other gloss examples]
│   └─→ RTL Script Examples (Cluster)
│       ├─→ Hebrew-Arabic (Sub-cluster)
│       └─→ [other RTL examples]
└─→ Privacy
```

#### Linking Rules:

1. **Homepage → Examples Gallery:**
   - At least 3 contextual links from homepage to /examples
   - 2-3 links to specific popular examples
   - Use varied, descriptive anchor text

2. **Examples Gallery → Individual Examples:**
   - Already has cards (good)
   - Add contextual links from category descriptions
   - Add "featured examples" section with links

3. **Individual Examples → Lateral Links:**
   - Each example should link to 3-5 related examples
   - Group by category (simple bilingual, RTL, glosses, etc.)
   - Use descriptive anchors: "See also: Turkish interlinear gloss with IPA"

4. **Individual Examples → Back to Gallery:**
   - Already has "← All examples" link (good)
   - Add another contextual link in body: "Browse more examples"

5. **Individual Examples → Homepage:**
   - Already has link in nav (good)
   - Add contextual link: "Try creating your own alignment"

6. **About Page → Examples:**
   - Add links from feature descriptions to examples demonstrating those features
   - e.g., "RTL scripts" section → link to Hebrew-Arabic example

7. **Examples → About:**
   - Link from examples to /about when mentioning features
   - e.g., "uses custom font support" → link to About fonts section

#### Anchor Text Strategy:

**Good Examples:**
- "Turkish interlinear gloss with IPA and morpheme boundaries"
- "simple English-French word alignment example"
- "browse all word alignment examples"
- "examples demonstrating right-to-left scripts"

**Bad Examples (avoid):**
- "click here"
- "read more"
- "this page"
- "example"

#### Implementation Priority:

1. **Week 1:** Homepage ↔ Examples Gallery bidirectional links
2. **Week 2:** Examples Gallery ↔ Individual Examples bidirectional links
3. **Week 3:** Lateral linking between related individual examples
4. **Week 4:** About page ↔ Examples cross-linking

---

## 4. Content Creation Guidelines

### Writing Style

Based on the existing site content (which is excellent), maintain:
- Clear, direct language
- Technical accuracy for linguistic terms
- Beginner-friendly explanations
- Active voice
- Short paragraphs (2-4 sentences)
- Descriptive headings

### Structured Elements Priority

1. **Tables** (highest impact for scanability)
   - Feature comparisons
   - Word alignment mappings
   - Use case matrices
   - Example categorization

2. **Lists** (already used well, continue)
   - Numbered steps for procedures
   - Bulleted features/benefits
   - Use case descriptions

3. **FAQ Sections** (add where missing)
   - H3 question headings
   - Concise answers (2-3 sentences or short paragraph)
   - Consider FAQ Schema markup

4. **Examples/Demonstrations** (leverage existing tool)
   - Screenshots with captions
   - Animated GIFs (already have 1, consider more)
   - Embedded examples

### Image Strategy

**Current State:**
- Homepage: 2 example images (GIF + PNG)
- Examples gallery: 19 preview images (good!)
- Individual examples: 1 image each
- About page: 9 screenshots

**Additions Needed:**

1. **Homepage:**
   - Add 1 more example image (total 3)
   - Consider adding feature demonstration screenshots
   - Add comparison diagram

2. **Examples Gallery:**
   - Keep current preview images (already good)
   - Consider adding category header images

3. **Individual Examples:**
   - Keep current preview image
   - Add 1-2 detail screenshots showing:
     - Zoom on interesting word mapping
     - The same example in the editor
     - Export options demo

4. **Create New Diagrams:**
   - Comparison chart: Word Aligner vs alternatives
   - Flowchart: "Which example should I use?"
   - Visual guide: "How word alignment works"

**Note:** Use existing example export functionality to generate authentic screenshots. This demonstrates first-hand use and provides unique visual content.

---

## 5. Implementation Phases & Priorities

### Phase 1: Examples Gallery (Highest Priority) - Week 1-2

**Why First:**
- Most critical thin content issue (~250 words)
- Central to site navigation
- High link equity distribution potential

**Tasks:**
1. Write comprehensive introduction (300-400 words)
2. Create example categories with descriptions (300-400 words)
3. Build feature comparison table
4. Add FAQ section (200-300 words)
5. Add "How to Use Examples" guide (200-300 words)
6. Strengthen internal links to/from homepage
7. Add links to individual examples from category descriptions

**Deliverable:** Examples gallery with 1,200-1,500 words of unique content

---

### Phase 2: Individual Example Pages - Week 3-6

**Priority Order:**
1. **Week 3:** Top 5 most popular/linked examples
   - English-French (entry point for beginners)
   - Turkish interlinear (showcases advanced features)
   - Hebrew-Arabic (demonstrates RTL)
   - Classical Nahuatl (linguistics community)
   - Japanese-Chinese-English (shows complex reordering)

2. **Week 4:** Next 7 examples (interlinear glosses)
   - Nahuatl Leipzig
   - Taiwanese Minnan
   - Lezgian
   - Turkish infinitive
   - Latin zero morpheme
   - Tagalog reduplication
   - Turkish ablative

3. **Week 5:** Remaining 7 examples
   - French clitic
   - Tagalog verbal aspect
   - German dative
   - Avar
   - Lojban
   - Russian
   - Tagalog compounds

**Per Example Tasks:**
1. Expand introduction with "What you'll learn"
2. Add "Understanding This Example" section (200-300 words)
3. Create word alignment structure table
4. Add use cases section (100-150 words)
5. Add "Related Examples" with 3-5 lateral links
6. Add "Try It Yourself" section (100-150 words)
7. Add example-specific FAQ if relevant

**Deliverable:** Each example page with 600-800 words of content (from ~150)

---

### Phase 3: Homepage Enhancement - Week 7

**Why After Examples:**
- Homepage already has decent content (~1,000-1,200 words)
- Benefits from having expanded example pages to link to
- Can reference completed content improvements

**Tasks:**
1. Add third example image to Examples section
2. Create feature comparison table (vs alternatives)
3. Create use cases table
4. Add Quick Start Guide section
5. Enhance FAQ section with 2-3 more questions
6. Add internal links to example categories
7. Add links to specific popular examples
8. Ensure FAQ Schema markup in JsonLd

**Deliverable:** Homepage with 1,500-1,700 words, 2-3 tables, improved linking

---

### Phase 4: Internal Linking Audit & Enhancement - Week 8

**Tasks:**
1. Audit all pages for internal links
2. Add missing contextual links:
   - Homepage → Examples (multiple mentions)
   - About → Examples (from feature descriptions)
   - Examples Gallery → Individual examples (from categories)
   - Individual Examples → Related examples (lateral)
   - Individual Examples → Gallery (additional contextual)
3. Verify anchor text quality
4. Check click depth (should be ≤3 from homepage)
5. Identify orphan pages (shouldn't be any, but verify)

**Deliverable:** Comprehensive internal linking map, all pages within 3 clicks

---

### Phase 5: Technical Validation - Week 9

**Tasks:**
1. Verify all changes are live
2. Check mobile responsiveness of new tables
3. Validate HTML markup
4. Test all internal links
5. Verify FAQ Schema markup
6. Check image optimization
7. Audit page load times
8. Submit updated sitemap to Google Search Console

---

### Phase 6: Indexing Requests - Week 10

**Tasks:**
1. Use URL Inspection tool in Google Search Console
2. Request indexing for improved pages in priority order:
   - Examples gallery
   - Top 5 individual examples
   - Homepage
   - Remaining examples (in batches)
3. Use "Validate Fix" for the page group in GSC
4. Document submission dates
5. Monitor indexing status

**Note:** Wait 2-4 weeks after this for re-evaluation

---

## 6. Success Metrics

### Immediate Metrics (Week 1-10)

1. **Content Metrics:**
   - ✅ Examples gallery: 250 → 1,200-1,500 words
   - ✅ Individual examples: 150 → 600-800 words each
   - ✅ Homepage: 1,200 → 1,500-1,700 words
   - ✅ Added tables: 4-6 across the site
   - ✅ Added FAQs: 3-4 sections

2. **Link Metrics:**
   - ✅ Internal links from homepage to examples: 1 → 5-7
   - ✅ Internal links between examples: 0 → 3-5 per page
   - ✅ Cross-links to About from examples: 0 → 1-2 per page
   - ✅ All pages within 3 clicks of homepage

3. **Technical Metrics:**
   - ✅ All indexing requests submitted
   - ✅ Sitemap updated and resubmitted
   - ✅ No broken links
   - ✅ Mobile responsive tables

### Short-term Metrics (Week 10-14, after submission)

1. **Google Search Console:**
   - Monitor "Crawled - currently not indexed" status
   - Track "Request indexing" responses
   - Watch "Discovered - currently not indexed" (should improve)
   - Monitor average position for existing indexed pages

2. **Expected Timeline:**
   - 2-4 weeks for initial re-crawl
   - 4-8 weeks for indexing status changes
   - Some pages may index faster than others

### Medium-term Metrics (Week 14-26, 3-6 months)

1. **Indexing Success:**
   - Target: 80%+ of important pages indexed
   - Monitor which pages index first
   - Track which changes correlated with indexing

2. **Search Performance:**
   - Organic impressions increase
   - Click-through rate for indexed pages
   - New keyword rankings
   - Position improvements for existing keywords

3. **User Behavior:**
   - Time on page (should increase with more content)
   - Pages per session (should increase with better internal linking)
   - Bounce rate (may initially increase, then stabilize)

---

## 7. Risk Assessment & Mitigation

### Potential Risks:

1. **Risk: Adding too much content makes pages cluttered**
   - **Mitigation:** Use collapsible sections, good typography, ample whitespace
   - Follow existing design patterns
   - Test on mobile

2. **Risk: Tables break mobile layout**
   - **Mitigation:** Use responsive table design
   - Consider horizontal scroll for wide tables
   - Test thoroughly on mobile devices
   - Use CSS frameworks already in use (Tailwind)

3. **Risk: Too many internal links seem spammy**
   - **Mitigation:** Keep to 3-5 contextual links per article
   - Ensure all links are genuinely useful to users
   - Use varied, natural anchor text
   - Don't link to same destination multiple times from one page

4. **Risk: Content changes don't result in indexing**
   - **Mitigation:** Be patient (4-8 weeks for full effect)
   - Monitor other ranking factors (backlinks, etc.)
   - Consider other issues (domain authority, technical SEO)
   - Track progress in GSC

5. **Risk: Writing style doesn't match existing content**
   - **Mitigation:** Study existing content carefully
   - Maintain technical accuracy
   - Have author review (Dani)
   - A/B test on less critical pages first

---

## 8. Content Creation Assignments

### Examples Gallery Page

**File:** `/workspace/bitext/src/routes/examples/+page.svelte`

**Content to Add:**

1. **Enhanced Introduction** (insert after existing description):

```markdown
Word Aligner examples demonstrate every major feature of the tool: simple bilingual pairs for classroom use, complex interlinear glosses for linguistic research, right-to-left script support for Hebrew and Arabic, and advanced cases like morpheme boundaries, reduplication markers, and zero morphemes. Whether you're a language teacher building handouts, a student learning how translations work, or a linguist documenting morphology, these examples show what the tool can do and give you a starting template.

Each example opens directly in the editor so you can modify it for your own language pair, add or remove lines, change fonts and colors, and export the result as PNG, SVG, or PDF. The examples are grouped below by complexity and use case to help you find the right starting point.
```

2. **Category Sections** (insert before the examples grid):

[See section below for full category content]

3. **Feature Comparison Table**
4. **FAQ Section**
5. **How to Use Examples Guide**

---

### Individual Example Pages

**Template Structure for Each:**

Each example page should follow this structure (insert content after existing description, before the image):

1. **Understanding This Example** section
2. **Alignment Structure** table (for simpler examples)
3. **Use Cases** section
4. **Related Examples** section (after image)
5. **Try It Yourself** section
6. **FAQ** section (if relevant)

**Example Template:** (for English-French example)

[See detailed template in section below]

---

## 9. Tools & Resources for Implementation

### Development

- **Text Editor:** Already using VS Code / Cursor
- **Component Framework:** SvelteKit (already in use)
- **CSS:** Tailwind CSS (already configured)
- **Version Control:** Git (already set up)

### SEO Tools

- **Google Search Console:** For monitoring indexing status
- **URL Inspection Tool:** For requesting indexing
- **Sitemap:** Update after changes
- **Schema Markup:** Verify FAQ schema in JsonLd component

### Content Tools

- **Word Counter:** Track content additions
- **Readability Checker:** Maintain clarity
- **Internal Link Tracker:** Spreadsheet or tool to map link structure
- **Anchor Text Diversity Check:** Ensure varied anchor text

### Image Tools

- **Word Aligner itself:** Generate example exports
- **Screenshot Tool:** Capture UI demonstrations
- **Image Optimizer:** Compress before adding to repo

---

## 10. Next Steps (Immediate Actions)

### Week 1 - Start with Examples Gallery

1. **Day 1-2: Content Writing**
   - Write enhanced introduction
   - Write category descriptions
   - Draft FAQ section
   - Draft "How to Use" guide

2. **Day 3: Create Tables**
   - Build feature comparison table in markdown
   - Convert to Svelte table component with Tailwind styling

3. **Day 4: Implementation**
   - Edit `/workspace/bitext/src/routes/examples/+page.svelte`
   - Add new content sections
   - Add internal links
   - Test on mobile

4. **Day 5: Review & Deploy**
   - Review content quality
   - Check all links
   - Verify responsive design
   - Deploy to production

5. **Day 6-7: Monitor & Iterate**
   - Check for any issues
   - Gather feedback
   - Make small adjustments
   - Plan Phase 2 (individual examples)

---

## 11. Appendices

### A. Example Category Content (Full Text)

#### Simple Bilingual Alignments

**Description (100-150 words):**

These examples show straightforward word-to-word correspondences between two languages. Perfect for language learners seeing how a sentence breaks down, or teachers creating visual aids for vocabulary lessons. Most words align one-to-one, with occasional cases where one language uses two words where the other uses one (like "le monde" for "world" in French). These examples demonstrate the core functionality without the complexity of interlinear glosses or morpheme boundaries.

**Use these when:** You want a clean, simple visualization of how two languages express the same idea. Great for beginners, classroom handouts, blog posts about translation, and social media language content.

**Featured Examples:**
- [English and French word alignment](#) - The simplest starting point
- [Tagalog compounds and hyphenated words](#) - Shows tokenization control
- [Japanese, Chinese, and English word order](#) - Demonstrates crossing lines for reordered translations

---

#### Interlinear Glosses

**Description (100-150 words):**

Interlinear glossing is a linguistic technique that breaks down each morpheme (meaningful unit) in a sentence and provides grammatical information and English equivalents. These examples demonstrate multi-line stacks with tight spacing: the source language, morpheme-by-morpheme glosses, IPA transcription, and a free translation. Word Aligner keeps connectors optional between gloss rows (so they sit tight) while showing explicit links between source and translation lines.

**Use these when:** You're documenting a language's morphology, teaching linguistics, sharing grammar examples, or working with constructed languages. These examples follow Leipzig Glossing Rules conventions, including abbreviations like NOM (nominative), 1SG (first person singular), and special markers like ~ for reduplication.

**Featured Examples:**
- [Turkish interlinear gloss with IPA](#)
- [Classical Nahuatl interlinear gloss](#)
- [Lezgian morpheme-by-morpheme gloss](#)
- [Tagalog reduplication with tilde marker](#)

---

#### Right-to-Left Scripts

**Description (100-150 words):**

Hebrew, Arabic, Persian, Urdu, and other right-to-left scripts require special handling in alignment tools. These examples demonstrate mixed-direction layouts where RTL source text aligns with left-to-right English translations. Word Aligner automatically handles text direction per line, draws connectors correctly across direction boundaries, and maintains visual clarity when linking between scripts that flow in opposite directions.

**Use these when:** You're teaching or documenting Semitic languages, Persian, Urdu, or any RTL writing system. The examples show both pure RTL-to-LTR alignments and cases where multiple RTL languages are compared against English, demonstrating how similar syntactic structures (like bound prepositions) work across related languages.

**Featured Examples:**
- [Hebrew and Arabic with English (RTL scripts)](#)

---

#### Advanced Linguistic Examples

**Description (100-150 words):**

These examples showcase complex morphological and syntactic phenomena: reduplication, zero morphemes (ø), agreement markers, case morphology, clitic pronouns, and inflectional paradigms. They demonstrate the full power of the tool for linguistic research and documentation. Many use specialized notation: tilde (~) for reduplication, backslash (\\) for null morphemes, period notation for multi-word glosses, and fine-grained morpheme boundaries using pipes (|).

**Use these when:** You're working on linguistic research, language documentation, morphology coursework, or constructed language development at an advanced level. These examples follow field linguistics conventions and can serve as templates for typological research presentations.

**Featured Examples:**
- [Tagalog reduplication with tilde marker](#)
- [Latin zero morpheme with ø notation](#)
- [German dative plural with umlaut](#)
- [Turkish case and verb morphology](#)
- [Avar ergative agreement](#)
- [Lojban sumti placeholders](#)

---

### B. Individual Example Content Template

#### English-French Example (Full Implementation Example)

**File:** `/workspace/bitext/src/routes/examples/english-french-word-alignment/+page.svelte`

**Content to Insert:**

*[After current description, before image]*

**Section 1: Understanding This Example (200-300 words)**

```markdown
## Understanding This Example

This English-French alignment demonstrates the fundamental concept of word-to-word translation mapping. While both sentences express the same greeting, they use different numbers of words to do so. English "Hello world" uses two words, while French "Bonjour le monde" uses three.

The alignment shows two types of correspondences:

1. **One-to-one mapping:** "Hello" maps directly to "Bonjour" - both are single-word greetings with equivalent meaning and function.

2. **One-to-many mapping:** "world" maps to both "le" and "monde" because French requires a definite article before most nouns, even in contexts where English omits it. The word "monde" is the direct equivalent of "world," while "le" is a grammatical requirement of French syntax rather than a semantic counterpart to any English word.

This pattern - where one language requires grammatical words that the other omits - is one of the most common challenges in translation and one of the main reasons visual alignment tools are valuable. Traditional interlinear glosses would place "le monde" directly under "world," hiding the fact that they're two separate French words. Word Aligner's curved connectors make this structure explicit: one English word links to two French words, and the diagram shows exactly which ones.

For teachers, this example works well in beginner lessons about articles in Romance languages. For students, it provides a clear visualization of why "le" appears in the French sentence when nothing similar appears in English.
```

**Section 2: Word Alignment Structure Table**

```markdown
## Word Alignment Structure

| English | French | Mapping Type | Linguistic Note |
|---------|--------|--------------|-----------------|
| Hello | Bonjour | 1:1 | Direct greeting equivalents |
| world | le monde | 1:2 | French requires definite article; "monde" = world, "le" = the |
```

**Section 3: Use Cases (100-150 words)**

```markdown
## When to Use This Example

This example works well for:

- **Beginner language lessons:** Introduce the concept of word-to-word correspondence without overwhelming students with complex grammar. The short sentence keeps cognitive load low while demonstrating a key structural difference between English and French.

- **Classroom handouts:** Export as PNG or SVG and embed in worksheets explaining articles in Romance languages. The visual immediately shows why "le" appears.

- **Blog posts about translation:** Screenshot the alignment to illustrate the difference between word-for-word and natural translation. It's a classic example that most readers will recognize.

- **Social media language content:** Short, recognizable phrase that demonstrates a grammatical concept in a shareable image. "Why does French say 'le monde' for 'world'?" becomes immediately clear.
```

**Section 4: Related Examples (after the image)**

```markdown
## Related Examples

If this example was useful, you might also like:

- **[Turkish interlinear gloss with IPA](#)** - Shows a more complex multi-line alignment with grammatical annotation and pronunciation
- **[Tagalog compounds and hyphenated words](#)** - Demonstrates another simple bilingual pair with tokenization control
- **[Japanese, Chinese, and English word order](#)** - See how three-line alignments handle different word orders and crossing connectors
- **[Hebrew and Arabic with English (RTL scripts)](#)** - Explore how the tool handles right-to-left scripts in bilingual alignment

Browse all [word alignment examples](#) organized by complexity and language features.
```

**Section 5: Try It Yourself (100-150 words)**

```markdown
## Try It Yourself

Want to create your own French-English alignment or adapt this to another language pair?

1. **Click "Open in Editor"** above to load this example
2. **Edit the text:** Click the pencil icon next to either line to change the sentence
3. **Modify the links:** Click a word, then click its match on the other line to create new connections. Click an existing connector to delete it.
4. **Adjust the styling:** Use the Settings panel on the right to change fonts, colors, or connector curves
5. **Export your result:** Click PNG, SVG, or PDF in the Export card to download

**Suggestions for variations:**

- Try another French sentence with articles: "J'aime le chat" (I like the cat)
- Compare Spanish: "Hola mundo" (only 2 words, like English - no article!)
- Add a third line with IPA pronunciation for either language
```

---

### C. Recommended Anchor Text Examples

#### From Homepage to Examples

**Context: First mention of examples in intro**
"Browse ready-made [word alignment and interlinear gloss examples](#/examples)"

**Context: Talking about RTL support**
"The tool supports [Hebrew, Arabic, and other right-to-left scripts](#/examples#rtl-scripts)"

**Context: Talking about interlinear glosses**
"See [Turkish interlinear examples with IPA and morpheme glosses](#/examples/turkish-interlinear-gloss-ipa)"

**Context: In FAQ section**
"You can [browse all 19 examples](#/examples) or load one directly in the editor"

#### From Examples Gallery to Individual Examples

**Context: In category description**
"Start with the [English-French word alignment example](#/examples/english-french-word-alignment) - the simplest demonstration"

**Context: In interlinear category**
"The [Classical Nahuatl interlinear gloss](#/examples/classical-nahuatl-interlinear-gloss) shows verb morpheme segmentation"

#### Between Individual Examples (Lateral)

**Context: End of English-French example**
"See also: [Turkish interlinear gloss with IPA](#/examples/turkish-interlinear-gloss-ipa) for a more complex multi-line alignment"

**Context: End of Turkish example**
"Related: [Classical Nahuatl interlinear gloss](#/examples/classical-nahuatl-interlinear-gloss) uses similar Leipzig Glossing Rules conventions"

---

### D. FAQ Content Examples

#### For Examples Gallery Page

**Q: How do I choose which example to start with?**

A: Start with the [English-French alignment](#) if you're new to the tool - it demonstrates the core concept with a simple two-line pair. If you need interlinear glosses with morpheme boundaries, try the [Turkish example](#). For right-to-left scripts, see the [Hebrew-Arabic example](#). Use the feature comparison table above to match your needs.

**Q: Can I modify an example for my own language pair?**

A: Yes! Every example opens in the editor where you can change the text, add or remove lines, adjust fonts and colors, and modify the word links. Your changes are automatically saved in the URL, so you can bookmark or share your adapted version.

**Q: Which examples use IPA (International Phonetic Alphabet)?**

A: Several interlinear examples include IPA rows: [Turkish interlinear](#), [Taiwanese Minnan](#), and others. You can add IPA to any example by inserting a new line and changing its font if needed.

**Q: Do I need to understand linguistics to use these examples?**

A: No - the simple bilingual examples (like [English-French](#)) are beginner-friendly. The advanced interlinear glosses use linguistic notation, but each example page explains what the symbols mean.

**Q: Can I create examples with more than four lines?**

A: Yes, there's no limit. Add as many lines as you need using the "+ Add line" button. Some examples use four or more rows for source, glosses, IPA, and translation.

**Q: How do I export an example?**

A: Open any example in the editor, then use the Export card on the right side. You can download PNG (for embedding in documents), SVG (for scaling), PDF (for printing), or HTML (self-contained file).

#### For Individual Example Pages (English-French)

**Q: Why does "world" connect to two French words?**

A: French requires a definite article ("le") before most nouns, even where English doesn't. "Monde" means "world," but it grammatically requires "le." The alignment shows this one-to-two mapping with connectors from "world" to both "le" and "monde."

**Q: Can I add a third line with IPA?**

A: Yes! Open the example in the editor, click "+ Add line," and enter the IPA transcription. You can link it to either the English or French line, or both.

---

## 12. Conclusion

This plan addresses the "crawled - currently not indexed" problem through evidence-based content enhancement and internal linking improvements. The strategy focuses on:

1. **Substantial, unique content** for each page (especially examples)
2. **Structured elements** (tables, FAQs, step-by-step guides)
3. **Strategic internal linking** (pillar-cluster architecture)
4. **Original visual content** (using the tool itself to generate examples)

The phased approach prioritizes the thinnest content first (examples gallery, individual examples) before enhancing already-decent pages (homepage). Implementation over 8-10 weeks will create a strong foundation for indexing success within 3-6 months.

**Expected Outcome:** 80%+ of important pages indexed within 4-6 months, with improved organic search visibility for key terms related to word alignment, interlinear glosses, and bilingual text visualization.
