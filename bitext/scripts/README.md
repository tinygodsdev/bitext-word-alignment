# Example preview PNGs (object storage CDN)

Gallery pages use **pre-rendered PNGs** on CDN — not `/api/og` — so Railway serves only static HTML with external `<img>` URLs.

## One-time setup

```bash
cd bitext
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` in the `bitext/` folder and fill in object storage credentials.

## Render + upload

From the **repo root**:

```bash
make examples-previews
```

Or step by step:

```bash
make examples-render   # build + Playwright → .cache/example-previews/*.png
make examples-upload   # upload to object storage (reads bitext/.env)
```

After upload, set `EXAMPLE_PREVIEWS_CDN_BASE` in `src/lib/examples/cdn.ts` to the URL printed by the upload script.

### Render fails with timeout

The script starts `vite preview` on port **4173** (override with `PREVIEW_PORT`). If a previous run left a zombie listener, Playwright could hit a half-dead server and never see the layout ready flag. The render script now frees the port and waits for Vite’s `Local:` line before capturing. If it still fails, run `fuser -k 4173/tcp` and retry `make examples-render`.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OBJECT_STORAGE_ACCESS_KEY` | yes | S3-compatible access key |
| `OBJECT_STORAGE_SECRET_KEY` | yes | Secret key |
| `OBJECT_STORAGE_BUCKET_NAME` | yes | Bucket name |
| `OBJECT_STORAGE_ORIGIN_ENDPOINT` | yes | S3 API origin (upload only), e.g. `fra1.digitaloceanspaces.com` |
| `OBJECT_STORAGE_CDN_ENDPOINT` | yes* | CDN host for **site** `<img>` / OG URLs, e.g. `fra1.cdn.digitaloceanspaces.com` |
| `OBJECT_STORAGE_PREFIX` | no | Object key prefix, default `examples` |
| `OBJECT_STORAGE_PUBLIC_BASE` | no | Override full public CDN base URL (no trailing slash) |
| `PREVIEW_URL` | no | If set, skip starting `vite preview` (use existing server) |
| `PREVIEW_PORT` | no | Default `4173` when script starts preview |

\* Not required if `OBJECT_STORAGE_PUBLIC_BASE` is set.

Upload sets **`ACL: public-read`** on each object (per-file, not bucket-wide). The site never uses origin URLs — only the CDN base in `src/lib/examples/cdn.ts` via `galleryPreviewImageUrl()`.

### CDN cache purge (optional)

Objects use `Cache-Control: immutable`, so the CDN keeps old PNGs until purged. After upload, the script can call the [DigitalOcean CDN purge API](https://docs.digitalocean.com/products/spaces/how-to/manage-cdn-cache/) when a **Personal Access Token** is set (this is **not** the Spaces S3 access key):

| Variable | Required | Description |
|----------|----------|-------------|
| `DIGITALOCEAN_API_TOKEN` or `DO_API_TOKEN` | for purge | DO control-plane PAT |
| `DO_CDN_ENDPOINT_ID` | no | CDN endpoint UUID; auto-resolved from bucket + origin if omitted |
| `OBJECT_STORAGE_CDN_PURGE` | no | Set to `0` to skip purge |
| `OBJECT_STORAGE_CDN_PURGE_PATHS` | no | Comma-separated paths, default `examples/*` |

Without a token, upload still succeeds; purge manually in the DO control panel as today.

## Adding a new example

1. Add entry to `src/lib/examples/catalog.ts` and `src/lib/state/examples.ts`.
2. Add slug to `scripts/gallery-slugs.ts`.
3. `make examples-render && make examples-upload`
4. Commit catalog/code changes (PNG stays on storage, not in git).

Internal render route (not public): `/examples/render/{slug}` — used only by Playwright.
