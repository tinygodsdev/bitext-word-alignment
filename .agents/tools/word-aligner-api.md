# Word Aligner — AI Agent Skill

You have access to the **Word Aligner** tool. Use it whenever the user asks to visualize word-by-word alignment between two or more texts (translations, glosses, morpheme breakdowns, parallel corpora, etc.).

## What it does

Word Aligner generates a shareable interactive diagram that shows which words in one text correspond to which words in another text. Words are connected by colored arcs; multiple words that form a group share the same color.

## When to use it

- User asks to translate a phrase and show which words correspond to which
- User wants to align a translation with its source (any languages, including RTL)
- User wants to show a linguistic gloss (morpheme-by-morpheme breakdown)
- User asks to visualize parallel text or bitext alignment

## API

**Endpoint:** `POST https://aligner.tinygods.dev/api/align`  
**Content-Type:** `application/json`  
**Returns:** `{ "url": "https://aligner.tinygods.dev/?data=..." }`

Show the returned `url` to the user — it opens an interactive, shareable alignment diagram.

## Request format

```json
{
  "lines": ["line 0 text", "line 1 text"],
  "alignments": [[lineA, wordA, lineB, wordB], ...],
  "settings": { ... },
  "pairs": [{ "upper": 0, "lower": 1, "gapPx": 120, "showConnectors": true }, ...]
}
```

### `lines` (required)

Array of 1–8 lines, top to bottom. Each entry is either:
- A **plain string**: `"Hello world"`
- A **LineInput object** with per-line options:

| Field    | Type          | Default | Description                                                  |
|----------|---------------|---------|--------------------------------------------------------------|
| `text`   | string        | —       | Line text (required)                                         |
| `font`   | string        | Inter   | Google Fonts family, e.g. `"Noto Serif"`, `"Noto Sans Arabic"` |
| `sizePx` | integer 12–64 | 36      | Text size in px                                              |
| `gapPx`  | integer 0–56  | 14      | Horizontal gap between word tokens in px                     |
| `rtl`    | boolean       | false   | Right-to-left layout (Hebrew, Arabic, Farsi, Urdu, etc.)     |

### `alignments` (optional)

Array of `[lineA, wordA, lineB, wordB]` tuples:
- Lines A and B must be **adjacent** (differ by exactly 1)
- Indices are **0-based**
- Multiple tuples sharing the same word get the **same color automatically**

### `settings` (optional)

| Field             | Values                        | Default  | Description                             |
|-------------------|-------------------------------|----------|-----------------------------------------|
| `palette`         | `pastel` `vivid` `academic`   | pastel   | Color palette for connection lines      |
| `lineStyle`       | `curved` `straight`           | curved   | Shape of connection lines               |
| `lineThickness`   | number 1–8                    | 3        | Stroke width                            |
| `lineOpacity`     | number 0.2–1                  | 1        | Opacity of lines                        |
| `background`      | `light` `dark`                | light    | Preview background                      |
| `theme`           | `light` `dark`                | light    | UI theme (token chip color)             |
| `showNumbers`     | boolean                       | false    | Show line numbers                       |
| `colorTokensByLink` | boolean                     | true     | Tint word tokens in their connection color |

### `pairs` (optional)

Array of `{ upper, lower, gapPx?, showConnectors? }` — controls for specific adjacent line pairs:
- `upper` / `lower`: 0-based line indices; `lower` must equal `upper + 1`
- `gapPx` (12–156, default 120): vertical gap between the two lines
- `showConnectors` (default true): set to `false` to hide connector lines for a pair (useful for gloss rows)

## Word index counting

Count words left to right starting from 0, splitting on whitespace. Characters `.`, `-`, `|` also split words.

For RTL lines, word 0 is the **logically first** word (rightmost on screen for Arabic/Hebrew).

**Example — "I have been going":**
| Index | Word |
|-------|------|
| 0     | I    |
| 1     | have |
| 2     | been |
| 3     | going |

## Examples

### Simple two-language alignment

```json
{
  "lines": ["Hello world", "Bonjour le monde"],
  "alignments": [
    [0, 0, 1, 0],
    [0, 1, 1, 2]
  ]
}
```

"Hello" → "Bonjour", "world" → "monde" ("le" is word 1, "monde" is word 2).

### One-to-many (one source word maps to several target words)

```json
{
  "lines": ["Я ходил", "I have been going"],
  "alignments": [
    [0, 0, 1, 0],
    [0, 1, 1, 1],
    [0, 1, 1, 2],
    [0, 1, 1, 3]
  ]
}
```

"ходил" (Russian past imperfective) maps to three English words: "have been going". All three connections are the same color.

### RTL language (Hebrew)

```json
{
  "lines": [
    { "text": "שלום עולם", "rtl": true, "sizePx": 48, "font": "Noto Sans Hebrew" },
    { "text": "Hello world", "sizePx": 40 }
  ],
  "alignments": [
    [0, 0, 1, 0],
    [0, 1, 1, 1]
  ]
}
```

Word 0 of the Hebrew line is "שלום" (logically first), word 1 is "עולם".

### Three lines with a gloss row

```json
{
  "lines": [
    "Я ходил",
    "I have been going",
    "1SG.NOM PST.IPFV"
  ],
  "alignments": [
    [0, 0, 1, 0],
    [0, 1, 1, 1],
    [0, 1, 1, 2],
    [0, 1, 1, 3]
  ],
  "pairs": [
    { "upper": 1, "lower": 2, "gapPx": 60, "showConnectors": false }
  ]
}
```

Lines 0–1 are connected. Line 2 is a gloss with smaller vertical gap and no connector arcs.

### Custom visual style

```json
{
  "lines": ["Hello world", "Bonjour le monde"],
  "alignments": [[0, 0, 1, 0], [0, 1, 1, 2]],
  "settings": {
    "palette": "vivid",
    "lineStyle": "straight",
    "background": "dark",
    "theme": "dark"
  }
}
```

## Workflow tip

When asked to "translate and align":
1. Translate the phrase into the target language yourself.
2. Determine which source words correspond to which target words.
3. Call the API with the source + translation as `lines` and the correspondences as `alignments`.
4. Return the `url` to the user with a brief explanation of the alignment.

If you are uncertain about word boundaries in a language, call the GET endpoint first to preview the tokenization:
```
GET https://aligner.tinygods.dev/api/align?lines=your+text+here
```
Open the URL and count the word boxes.
