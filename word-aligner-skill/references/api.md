# Word Aligner API — Full Reference

**Base URL:** `https://aligner.tinygods.dev`  
**Endpoint:** `POST /api/align`  
**Content-Type:** `application/json`  
**CORS:** `Access-Control-Allow-Origin: *` (no auth required)

**Response:** `{ "url": "https://aligner.tinygods.dev/?data=..." }`

OpenAPI schema: `GET https://aligner.tinygods.dev/api/align/openapi.json`

---

## Request fields

| Field       | Type                        | Required | Description |
|-------------|---------------------------  |----------|-------------|
| `lines`     | (string \| LineInput)[]     | yes      | 1–8 lines, top to bottom |
| `alignments`| [int,int,int,int][]         | no       | Word-alignment pairs |
| `settings`  | SettingsInput               | no       | Global visual overrides |
| `pairs`     | PairInput[]                 | no       | Per-pair gap and connector control |

---

## LineInput

Each entry in `lines` is a plain string (shorthand) or an object:

| Field    | Type          | Default           | Description |
|----------|---------------|-------------------|-------------|
| `text`   | string        | —                 | Line text (required) |
| `font`   | string        | `Inter`           | Google Fonts family, e.g. `"Noto Serif"`, `"Noto Sans Arabic"`, `"Noto Sans Hebrew"` |
| `sizePx` | integer 12–64 | `36`              | Text size in px |
| `gapPx`  | integer 0–56  | `14`              | Horizontal gap between word tokens in px |
| `rtl`    | boolean       | `false`           | Right-to-left layout (Hebrew, Arabic, Farsi, Urdu, etc.) |

---

## SettingsInput

Global visual overrides. All fields optional; unset fields use defaults.

| Field               | Values                      | Default   | Description |
|---------------------|-----------------------------|-----------|-------------|
| `palette`           | `pastel` `vivid` `academic` | `pastel`  | Color palette for connection lines and token tints |
| `lineStyle`         | `curved` `straight`         | `curved`  | Shape of connection lines |
| `lineThickness`     | number 1–8                  | `3`       | Stroke width |
| `lineOpacity`       | number 0.2–1                | `1`       | Opacity of connection lines |
| `background`        | `light` `dark`              | `light`   | Preview background color |
| `theme`             | `light` `dark`              | `light`   | UI theme (affects token chip color) |
| `showNumbers`       | boolean                     | `false`   | Show line numbers next to each line |
| `colorTokensByLink` | boolean                     | `true`    | Tint word tokens in the color of their connection |
| `tokenSplitChars`   | string                      | `.-\|`    | Characters (besides whitespace) that split text into tokens. The split char is **not** rendered. Set to `-\|` to keep periods inside Leipzig gloss morphemes (`go.PST.IPFV` = one token) |
| `tokenMergeChar`    | string (1 char)             | `+`       | Joins parts into one token while rendering as a space, e.g. `is+playing` → `is playing` (one word) |

**Palette colors:**
- `pastel` — soft pink, blue, green, yellow, purple, cyan (great for educational content)
- `vivid` — saturated red, blue, green, yellow, purple, cyan (high contrast)
- `academic` — slate grays (for neutral/professional diagrams)

---

## PairInput

Controls for a specific adjacent line pair. `lower` must equal `upper + 1`.

| Field            | Type          | Default | Description |
|------------------|---------------|---------|-------------|
| `upper`          | integer       | —       | 0-based index of the upper line (required) |
| `lower`          | integer       | —       | 0-based index of the lower line (required) |
| `gapPx`          | integer 12–156| `120`   | Vertical gap between the two lines in px |
| `showConnectors` | boolean       | `true`  | When `false`, connector arcs are hidden for this pair |

---

## alignments format

Each tuple is `[lineA, wordA, lineB, wordB]`:
- All indices are **0-based**
- `lineA` and `lineB` must be **adjacent**: `|lineA − lineB| = 1` (you cannot connect across a line; stack intermediate tiers instead)
- Multiple tuples sharing the same word form a **color group** automatically (one-to-many, many-to-one, and many-to-many all work)

---

## Constraints and errors

- **1–8 lines.** Fewer than 1 or more than 8 is rejected.
- **Adjacency:** alignment lines must differ by exactly 1; `pairs` require `lower = upper + 1`.
- **Index ranges:** line and word indices must be in range for the (tokenized) text.
- Numeric settings are clamped, not rejected: `lineThickness`→1–8, `lineOpacity`→0.2–1, `sizePx`→12–64, line `gapPx`→0–56, pair `gapPx`→12–156.

On invalid input the API returns **HTTP 400** with a JSON body:

```json
{ "error": "alignments[0]: word 4 out of range for line 0 (\"1SG.NOM go.PST.IPFV\" has 2 word(s))" }
```

The error message names the offending field, index, and the tokenized word count — read it to fix indices.

---

## Tokenization and word indices

Word indices in `alignments` and `pairs` refer to **token positions**, so tokenize each line the way the service does before counting:

- **Whitespace always splits.**
- **`tokenSplitChars` (default `.-|`) also splits, and the split character is removed from the rendered output.** `"go.PST.IPFV"` → three tokens `go` `PST` `IPFV` with the dots gone. Override `tokenSplitChars` (e.g. to `"-|"`) to keep characters you want displayed.
- **Punctuation stays attached by default** (the API does not split punctuation). `"Hello, world!"` → `Hello,`[0] `world!`[1].
- **The merge char `+` (default) joins parts into one token** displayed with a space: `"is+playing"` is one token rendered `is playing`.
- **RTL lines are indexed in reading order** — word 0 is the logically first word (rightmost on screen).

Changing `tokenSplitChars` shifts every line's indices — recount after setting it.

---

## GET /api/align (simple, lines only)

```
GET /api/align?lines=Hello+world&lines=Bonjour+le+monde
```

Returns the same `{ "url": "..." }` response. **Lines only** — this endpoint ignores `alignments`, `settings`, and `pairs`; use POST for those. Useful for opening the editor pre-filled with text (no pre-drawn links) and for verifying how a line tokenizes: open the URL and count the word boxes.

---

## Examples

### Simple two-language alignment (article + noun both linked to one source word)
```json
{
  "lines": ["Hello world", "Bonjour le monde"],
  "alignments": [[0,0,1,0], [0,1,1,1], [0,1,1,2]]
}
```
"world" maps to both "le" (word 1) and "monde" (word 2) — they share a color.

### Custom visual style (vivid, dark)
```json
{
  "lines": ["Hello world", "Bonjour le monde"],
  "alignments": [[0,0,1,0], [0,1,1,1], [0,1,1,2]],
  "settings": {
    "palette": "vivid",
    "lineStyle": "straight",
    "background": "dark",
    "theme": "dark",
    "lineThickness": 2
  }
}
```

### Many-to-one (ходил → have been going)
```json
{
  "lines": ["Я ходил", "I have been going"],
  "alignments": [[0,0,1,0], [0,1,1,1], [0,1,1,2], [0,1,1,3]]
}
```

### RTL (Hebrew ↔ English)
```json
{
  "lines": [
    {"text": "שלום עולם", "rtl": true, "font": "Noto Sans Hebrew", "sizePx": 48},
    {"text": "Hello world", "sizePx": 40}
  ],
  "alignments": [[0,0,1,0], [0,1,1,1]]
}
```

### Interlinear (Leipzig) gloss — gloss / source / free translation
Gloss on top, source in the middle, free translation at the bottom. The gloss→source pair has
its arcs hidden (`showConnectors: false`) and a tight 12 px gap; gloss tokens stay color-coded.
The source→translation pair keeps its arcs.

Set `tokenSplitChars` to `"-|"` (drop the dot) so Leipzig periods stay inside a morpheme:
`"go.PST.IPFV"` is one token, not three.

```json
{
  "lines": [
    {"text": "1SG.NOM go.PST.IPFV", "sizePx": 22},
    {"text": "Я ходил", "sizePx": 40},
    {"text": "I have been going", "sizePx": 36}
  ],
  "alignments": [
    [0,0,1,0], [0,1,1,1],
    [1,0,2,0],
    [1,1,2,1], [1,1,2,2], [1,1,2,3]
  ],
  "settings": {"tokenSplitChars": "-|"},
  "pairs": [
    {"upper": 0, "lower": 1, "gapPx": 12, "showConnectors": false}
  ]
}
```

### Four tiers — gloss / IPA / source / translation
A full Leipzig stack. The three top tiers (gloss, IPA, source) are tightly stacked with arcs
hidden; only the source→translation pair draws arcs. `tokenSplitChars: "-|"` keeps the periods
inside gloss morphemes.

```json
{
  "lines": [
    {"text": "1SG eat.PRS.1SG INDF.F apple", "sizePx": 22},
    {"text": "ʒə mɑ̃ʒ yn pɔm", "font": "Noto Sans", "sizePx": 26},
    {"text": "Je mange une pomme", "sizePx": 40},
    {"text": "I eat an apple", "sizePx": 30}
  ],
  "alignments": [
    [0,0,1,0], [0,1,1,1], [0,2,1,2], [0,3,1,3],
    [1,0,2,0], [1,1,2,1], [1,2,2,2], [1,3,2,3],
    [2,0,3,0], [2,1,3,1], [2,2,3,2], [2,3,3,3]
  ],
  "settings": {"tokenSplitChars": "-|"},
  "pairs": [
    {"upper": 0, "lower": 1, "gapPx": 12, "showConnectors": false},
    {"upper": 1, "lower": 2, "gapPx": 12, "showConnectors": false}
  ]
}
```
