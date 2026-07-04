# Mobile-first UI rework — concept mock

Interactive mock of a proposed mobile-first interface for Word Aligner.

- **File:** [mobile-redesign.html](mobile-redesign.html) — open in a browser (self-contained, no build).
- **Live artifact:** https://claude.ai/code/artifact/9c48a6a5-f31d-4bf3-a3af-d8b8f417fdad

This is a design mock, not wired to the app. The rationale and flow are written into the
page itself.

## Concept in one line

The diagram is the work; the chrome gets out of its way. Canvas fills the screen, three
labeled modes live in a thumb-reach bottom bar, and the confusing fine-tuning is folded away.

## The three modes

- **Text** — write/paste the two lines. Comfortable fields, arrow reorder, RTL, add line.
  Per-line font/size behind an "Aa" button. Auto-fit explained inline.
- **Link** (default) — the live canvas. Tap a word, then its match on the next line; a banner
  echoes the pinned word. Tap a thread to delete via a real target. Pinch to zoom.
- **Style** — theme swatches, palette, light/dark, straight/curved. Only choices that always
  look good. A single **Fine-tune** disclosure holds thickness, opacity, spacing,
  tokenization, and fonts.

**Export** is the one primary action, kept in the top bar. On desktop the sheets dock as a
right rail.

## Foolproofing ("защита от дурака")

- Opens on a real, connected example — never a blank canvas.
- Auto-fit means any input lays out on one row; no wrapping or overflow.
- Only safe, curated controls are always visible; the messy ones sit behind Fine-tune.
- Padded word targets, thread-delete popover, 44px minimum — fewer mis-taps.

## Not addressed here (follow-ups)

Routing of the SEO/marketing content off the editor, real per-line "Aa" sheet contents, and
the desktop rail interaction are described but not mocked in detail.
