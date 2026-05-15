# Partner / affiliate blocks — portable specification

This document describes the **partner link cards** system as implemented in **Aligner** (`bitext`), so you can reproduce the same behavior, copy, tracking, and rotation logic in another stack (React, Vue, plain HTML, etc.). UI implementation details are **guidelines**, not prescriptive markup.

---

## 1. Goals

- Disclose sponsored / referral links clearly; use **`rel="sponsored"`** on outbound affiliate URLs (alongside `noopener` / `noreferrer` as usual).
- Keep **one shared “why is this here?”** explanation (tooltip next to a **?** control) with consistent tone.
- Track outbound clicks in **GA4** with a dedicated event and structured dimensions (`partner`, `product`, …).
- On the **home** page, show **two** partner cards at a time from a pool of **N ≥ 2**, **never the same partner twice** on screen; **all** partners in the pool participate over time via **hourly (UTC) deterministic** rotation.
- On **About**, cards may stay **static** (all partners listed in a fixed order).

---

## 2. Product branding strings (copy)

These feed the shared tooltip and any site-wide naming. Replace `Aligner` / URLs if you fork for another product.

| Key | Aligner value | Notes |
|-----|---------------|--------|
| **Display name** (user-facing) | `Aligner` | Used inside the tooltip body. |
| **Public site URL** | `https://aligner.tinygods.dev` | Reference only; not required for banner shell. |
| **Contact email** | `dani@tinygods.dev` | Reference for privacy/about. |

### 2.1 Shared tooltip text (`PARTNER_LINK_WHY_TOOLTIP`)

Exact multiline string (first line is a short heading; the rest is body). The **?** control’s accessible name should match the intent, e.g. “Why is this here?”

```text
Why is this here?

Aligner stays free. Upkeep still has a cost, so we add a few partner links. Use them if you consider the service. It helps us to maintain the app. I recommend only the services I happily use myself.

Thanks,
Dani
```

**Implementation notes**

- Prefer **`role="tooltip"`** on the tooltip container and wire **`aria-expanded`**, **`aria-controls`**, and a stable **`id`** on the tooltip to the **?** button.
- **Mobile / touch:** toggling on **click** is required; **hover-only** is insufficient.
- **Narrow viewports / `overflow-x-hidden` ancestors:** tooltips implemented as `position: fixed` can still be **clipped** by parent overflow in some browsers. Aligner **teleports** the open tooltip node to **`document.body`** below a breakpoint and positions it with **`top`** from the trigger’s `getBoundingClientRect()` plus **`left` / `right`** with safe-area insets, e.g. `max(1rem, env(safe-area-inset-left, 0px))`.
- **Desktop:** may still show on **hover** / **focus-visible** over a wrapping **group** when the tooltip is not portaled.
- **Outside click** closes the tooltip; clicks on the tooltip content should **not** close it (for text selection). Aligner uses `document.getElementById(tipId)` so the portaled node is included.

---

## 3. Partner catalog (canonical data)

Each partner is one **card**: title, body HTML/copy, CTA label, **outbound `href`**, **GA slugs**, and **visual accent** (left border + light tint). Values below are the **Aligner** source of truth as of this document.

### 3.1 Preply

| Field | Value |
|-------|--------|
| **Stable id** | `preply` |
| **Title** | `Preply — language tutors` |
| **CTA label** | `Open Preply` |
| **Outbound URL** | `https://preply.com/en/?pref=MjI1NTg5OTI=&id=1778450837.497915&ep=w2` |
| **GA `data-partner`** | `preply` |
| **GA `data-product`** | `language_tutors` |
| **Accent** | Left bar + tint: **`#FF7AAC`** (light: ~10% bg tint; dark: ~15% — tune per theme). |
| **Body copy** | Personally, I use Preply for language learning. If you want to try an online tutor, our link includes **70% off the trial lesson**. We earn a small bonus if you go on to paid lessons - it helps to keep the site running. |

### 3.2 Railway

| Field | Value |
|-------|--------|
| **Stable id** | `railway` |
| **Title** | `Railway - easy deployment` |
| **CTA label** | `Open Railway` |
| **Outbound URL** | `https://railway.com?referralCode=J6cBod` |
| **GA `data-partner`** | `railway` |
| **GA `data-product`** | `hosting` |
| **Accent** | **`#853bce`** |
| **Body copy** | This project is deployed on Railway. For me it works like a charm: I just add my repo and Railway builds and deploys it by itself. This link gives **$20 in credits**. No pressure - use if it fits your stack. |

### 3.3 Cursor

| Field | Value |
|-------|--------|
| **Stable id** | `cursor` |
| **Title** | `Cursor — AI code editor` |
| **CTA label** | `Open Cursor` |
| **Outbound URL** | `https://cursor.com/referral?code=T8B3DYFJSOF5` |
| **GA `data-partner`** | `cursor` |
| **GA `data-product`** | `pro_subscription` |
| **Accent** | **`#141414`** (dark mode: lighter border e.g. `neutral-200`, subtle neutral tint). |
| **Body copy** | Cursor is my main AI coding tool. If you were going to try it anyway, this referral gives new accounts **50% off the first month** of Pro, Pro+, or Ultra (per Cursor’s current offer). |

### 3.4 Wise

| Field | Value |
|-------|--------|
| **Stable id** | `wise` |
| **Title** | `Wise — international transfers` |
| **CTA label** | `Open Wise` |
| **Outbound URL** | `https://wise.com/invite/dlpc/danip204` |
| **GA `data-partner`** | `wise` |
| **GA `data-product`** | `money_transfer` |
| **Accent** | **`#9fe870`** |
| **Body copy** | Sometimes I have trouble with money transfers in my country. Wise worked for me without too much hassle. With this invite, new sign-ups get a **fee-free first transfer** up to roughly **US$600** equivalent. |

**Offers** (discounts, credits, etc.) change over time; update body copy when partner terms change.

---

## 4. Card shell — HTML / accessibility contract

Minimal **contract** independent of framework:

- Outer **region** semantically grouping the card: e.g. `<article aria-label="{title}">`.
- **Heading** with the partner **title** and the **?** control beside it.
- **Body**: paragraph(s) with the partner description.
- **Primary outbound link**:
  - **`target="_blank"`**
  - **`rel="noopener noreferrer sponsored"`**
  - CSS class **`affiliate-link`** (used by the GA listener — see §5)
  - **`data-partner="{stable slug}"`** and **`data-product="{offer slug}"`** as in §3
  - Visible label = **CTA label** + optional trailing arrow (decorative: **`aria-hidden="true"`**)

Layout expectations in Aligner (adapt as needed): responsive grid — on small screens CTA may sit below copy; on larger screens CTA can align to the row with the heading.

---

## 5. Google Analytics 4 — `affiliate_click`

### 5.1 Event name

```text
affiliate_click
```

### 5.2 When to fire

On **click** of an `<a>` that matches **`a.affiliate-link`** (class `affiliate-link` on the anchor). Use **capture phase** (`addEventListener(..., true)`) so the event still runs if inner markup stops propagation.

Use **`Element.closest('a.affiliate-link')`** from `event.target` so clicks on child nodes (e.g. `<strong>`) still count.

Only send if **`window.gtag`** is a function (GA loaded).

### 5.3 Parameters

| Parameter | Type | Source |
|-----------|------|--------|
| **`partner`** | string | `element.dataset.partner` (fallback `''`) |
| **`product`** | string | `element.dataset.product` (fallback `''`) |
| **`link_url`** | string | `element.href` |
| **`link_text`** | string | `element.textContent`, trimmed, internal whitespace collapsed, **truncated to 120 chars** |

Aligner registers this once from the root layout on the client.

### 5.4 GA4 admin

Custom params may need **custom definitions** (custom dimensions) to appear in standard reports; they still appear in **DebugView** / **BigQuery**.

### 5.5 Measurement ID

Per-property. Aligner uses **`G-6Z5775NY39`** in source; in another app, substitute your own **Measurement ID** and keep the event shape.

---

## 6. Home page rotation — algorithm (portable)

**Requirements**

- **Pool**: ordered list of partner ids, length **N ≥ 2**, e.g.  
  `['preply', 'railway', 'cursor', 'wise']`.
- **Two slots**: **slot A** (e.g. intro column) and **slot B** (e.g. sidebar). Output **`[idForA, idForB]`** with **`idForA !== idForB`**.
- **Fairness**: over many hours, every partner appears across requests; for a single draw, every **ordered pair** of **distinct** partners from the pool should be **equally likely** (uniform over **N × (N − 1)** outcomes).
- **Time cadence**: bucket time by **UTC-aligned hour** using Unix milliseconds:  
  **`bucket = floor(nowMs / 3_600_000)`**  
  (hour boundaries match Unix/UTC hour ticks).
- **Determinism**: for the same **`nowMs`**, same pool → same pair and order. **Compute once per HTTP request on the server** (or embed the result in HTML/JSON) so **SSR and client hydration match**. Do **not** call `Math.random()` independently on server and client for the same view.

### 6.1 Reference implementation (TypeScript)

```ts
export const HOME_PARTNER_IDS = ['preply', 'railway', 'cursor', 'wise'] as const;
export type HomePartnerId = (typeof HOME_PARTNER_IDS)[number];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(items: T[], rng: () => number): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

export function homePartnerHourBucketUtc(nowMs: number): number {
  return Math.floor(nowMs / 3_600_000);
}

export function getHomePartnerOrder(nowMs: number): [HomePartnerId, HomePartnerId] {
  const bucket = homePartnerHourBucketUtc(nowMs);
  const seed = Math.imul(bucket ^ 0xdeadbeef, 0x9e3779b1) | 0;
  const rng = mulberry32(seed);
  const pool = [...HOME_PARTNER_IDS] as HomePartnerId[];
  shuffleInPlace(pool, rng);
  if (pool.length < 2) {
    throw new Error('HOME_PARTNER_IDS must contain at least two partners for two slots');
  }
  return [pool[0], pool[1]];
}
```

**Extending the pool:** append ids to `HOME_PARTNER_IDS` and add matching cards + map to components. The shuffle logic stays the same.

### 6.2 Aligner wiring

- **`getHomePartnerOrder(Date.now())`** is called in **`+page.server.ts`** `load` and returned as **`homePartnerOrder`**.
- The home template maps **`[0]`** to the **intro** banner slot and **`[1]`** to the **settings sidebar** slot.

### 6.3 About page (Aligner)

All four partners are shown in a **fixed** order: **Preply → Railway → Cursor → Wise**. No server rotation.

---

## 7. Checklist for a new codebase

- [ ] Create one **data module** (or CMS) with §2–§3 fields.
- [ ] Implement the **card** UI with §4 link attributes and **?** + tooltip behavior (§2.1).
- [ ] Add **`affiliate-link`** + **`affiliate_click`** listener (§5).
- [ ] On the marketing home (or equivalent), run §6 on the **server** and pass **`[slotA, slotB]`** into the view.
- [ ] Register **custom dimensions** in GA4 if you rely on `partner` / `product` in reports.
- [ ] Revisit **referral URLs and legal copy** when partners update programs.

---

## 8. Source map (Aligner)

| Concern | Location in repo |
|---------|------------------|
| Display name, tooltip text, GA ID | `bitext/src/lib/brand.ts` |
| Rotation | `bitext/src/lib/partners/home-rotation.ts` |
| GA listener | `bitext/src/lib/analytics/affiliate-link-tracking.ts` |
| Card shell (link, a11y, tooltip, portal) | `bitext/src/lib/components/partners/PartnerBannerShell.svelte` |
| Per-partner copy & URLs | `bitext/src/lib/components/partners/PartnerBanner*.svelte` |
| Home `load` | `bitext/src/routes/+page.server.ts` |
| Home slots | `bitext/src/routes/+page.svelte` |
| About list | `bitext/src/routes/about/+page.svelte` |

---

*Last aligned with codebase structure and partner data as documented here; update this file when URLs, GA event shape, or rotation rules change.*
