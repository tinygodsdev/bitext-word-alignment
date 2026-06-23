---
name: word-aligner
description: Use Word Aligner to create shareable visual diagrams showing word-by-word alignment between two or more texts. Invoke this skill when the user wants to translate a phrase and show which words correspond to which, align a translation with its source in any language (including RTL scripts like Hebrew or Arabic), create an interlinear gloss or morpheme breakdown, or generate a shareable alignment diagram. The skill calls POST https://aligner.tinygods.dev/api/align and returns a URL.
---

# Word Aligner

Word Aligner generates shareable interactive diagrams showing which words in one text correspond to which words in another. Words are connected by colored arcs; tokens sharing a connection group (many-to-one or one-to-many) get the same color automatically.

**API endpoint:** `POST https://aligner.tinygods.dev/api/align`  
**Returns:** `{ "url": "https://aligner.tinygods.dev/?data=..." }` — give this URL to the user.

## Minimal request

```json
{
  "lines": ["Hello world", "Bonjour le monde"],
  "alignments": [[0, 0, 1, 0], [0, 1, 1, 2]]
}
```

`alignments` entries are `[lineA, wordA, lineB, wordB]` — 0-based indices, lines must be adjacent.

## Workflow

1. Translate the phrase yourself (or use the user's existing translation).
2. Identify which source words correspond to which target words.
3. Call the API.
4. Return the `url` to the user with a brief explanation.

## Word index counting

Count left to right from 0, splitting on whitespace. Characters `.` `-` `|` also split. For RTL lines, word 0 is the logically first word (rightmost on screen).

If uncertain about tokenization, call `GET https://aligner.tinygods.dev/api/align?lines=your+text` first and open the URL to count word boxes in the editor.

## Common patterns

**Many-to-one** (one source word → several target words): list all target words as separate alignment tuples. They share a color automatically.

```json
{
  "lines": ["Я ходил", "I have been going"],
  "alignments": [[0,0,1,0], [0,1,1,1], [0,1,1,2], [0,1,1,3]]
}
```

**One-to-many** (article + noun both correspond to one source word): include both target words.

```json
{
  "lines": ["Hello world", "Bonjour le monde"],
  "alignments": [[0,0,1,0], [0,1,1,1], [0,1,1,2]]
}
```
"world" maps to both "le" (word 1) and "monde" (word 2) — they share a color.

**RTL language** (Hebrew, Arabic, etc.): use a `LineInput` object with `"rtl": true` and a matching font.

```json
{
  "lines": [
    {"text": "שלום עולם", "rtl": true, "font": "Noto Sans Hebrew", "sizePx": 48},
    {"text": "Hello world", "sizePx": 40}
  ],
  "alignments": [[0,0,1,0], [0,1,1,1]]
}
```

**Interlinear gloss**: place the gloss line directly under the source (adjacent), connect source→gloss tokens, hide the arcs with `showConnectors: false`, use a small gap (12px). Put the free translation below the gloss with a larger gap and no connectors.

`"1SG.NOM PST.IPFV"` — dots are default split chars, so this yields 4 tokens: `1SG`[0] `NOM`[1] `PST`[2] `IPFV`[3].

```json
{
  "lines": [
    {"text": "Я ходил", "sizePx": 40},
    {"text": "1SG.NOM PST.IPFV", "sizePx": 22},
    {"text": "I have been going", "sizePx": 36}
  ],
  "alignments": [
    [0,0,1,0], [0,0,1,1],
    [0,1,1,2], [0,1,1,3]
  ],
  "pairs": [
    {"upper": 0, "lower": 1, "gapPx": 12, "showConnectors": false},
    {"upper": 1, "lower": 2, "gapPx": 80, "showConnectors": false}
  ]
}
```

Gloss tokens inherit colors from their source-word group. Arcs are hidden on both pairs; only the color coding is visible.

## Full parameter reference

See [references/api.md](references/api.md) for the complete parameter tables: `LineInput`, `SettingsInput` (palette, lineStyle, lineThickness, lineOpacity, background, theme, showNumbers, colorTokensByLink), and `PairInput` (gapPx, showConnectors).
