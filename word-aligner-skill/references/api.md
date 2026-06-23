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
- `lineA` and `lineB` must be **adjacent**: `|lineA − lineB| = 1`
- Multiple tuples sharing the same word form a **color group** automatically

---

## GET /api/align (simple, no alignments)

```
GET /api/align?lines=Hello+world&lines=Bonjour+le+monde
```

Returns the same `{ "url": "..." }` response. Useful for opening the editor pre-filled with text, without pre-drawn links. Helpful for verifying word tokenization.

---

## Examples

### Simple two-language alignment
```json
{
  "lines": ["Hello world", "Bonjour le monde"],
  "alignments": [[0,0,1,0], [0,1,1,2]]
}
```

### Custom visual style (vivid, dark)
```json
{
  "lines": ["Hello world", "Bonjour le monde"],
  "alignments": [[0,0,1,0], [0,1,1,2]],
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

### Three lines — source + translation + gloss
```json
{
  "lines": [
    "Я ходил",
    "I have been going",
    "1SG.NOM PST.IPFV"
  ],
  "alignments": [[0,0,1,0], [0,1,1,1], [0,1,1,2], [0,1,1,3]],
  "pairs": [{"upper": 1, "lower": 2, "gapPx": 60, "showConnectors": false}]
}
```

### Four lines with per-line typography
```json
{
  "lines": [
    {"text": "Ich habe geschlafen", "font": "Noto Sans", "sizePx": 40},
    {"text": "I have slept", "sizePx": 40},
    {"text": "ich-hab-e geschlafen", "sizePx": 20},
    {"text": "1SG-AUX-1SG slept.PTCP", "sizePx": 20}
  ],
  "alignments": [
    [0,0,1,0], [0,1,1,1], [0,2,1,2],
    [2,0,3,0], [2,1,3,1]
  ],
  "pairs": [
    {"upper": 1, "lower": 2, "gapPx": 40, "showConnectors": false},
    {"upper": 2, "lower": 3, "gapPx": 60}
  ]
}
```
