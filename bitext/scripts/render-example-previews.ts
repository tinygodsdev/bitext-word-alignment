/**
 * Renders gallery example PNGs via headless Chromium (Playwright).
 *
 * Requires a production build (`npm run build`). Starts `vite preview` unless
 * PREVIEW_URL is set (server already running).
 *
 * Output: `.cache/example-previews/{slug}.png`
 */
import { execSync, spawn, type ChildProcess } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Page } from 'playwright';
import { GALLERY_SLUGS } from './gallery-slugs.js';

export const EXAMPLE_RENDER_WIDTH = 960;

const __dirname = dirname(fileURLToPath(import.meta.url));
const BITEXT_ROOT = join(__dirname, '..');
const OUT_DIR = join(BITEXT_ROOT, '.cache', 'example-previews');

const PREVIEW_PORT = Number(process.env.PREVIEW_PORT ?? 4173);
const PREVIEW_URL = (process.env.PREVIEW_URL ?? `http://127.0.0.1:${PREVIEW_PORT}`).replace(
	/\/$/,
	''
);

/** Release a stale preview from a previous failed run (Linux). */
function freePreviewPort(port: number): void {
	try {
		execSync(`fuser -k ${port}/tcp 2>/dev/null || true`, { stdio: 'ignore' });
	} catch {
		// ignore
	}
}

function startPreview(): ChildProcess {
	// detached → own process group so we can SIGTERM the whole tree on exit
	return spawn(
		'npm',
		[
			'run',
			'preview',
			'--',
			'--port',
			String(PREVIEW_PORT),
			'--host',
			'127.0.0.1',
			'--strictPort'
		],
		{
			cwd: BITEXT_ROOT,
			stdio: ['ignore', 'pipe', 'pipe'],
			detached: true
		}
	);
}

async function stopPreview(proc: ChildProcess, port: number): Promise<void> {
	if (proc.pid) {
		try {
			process.kill(-proc.pid, 'SIGTERM');
		} catch {
			try {
				proc.kill('SIGTERM');
			} catch {
				// already gone
			}
		}
		// npm/vite sometimes ignore SIGTERM when orphaned
		await new Promise((r) => setTimeout(r, 400));
		if (!proc.killed && proc.exitCode === null) {
			try {
				process.kill(-proc.pid, 'SIGKILL');
			} catch {
				try {
					proc.kill('SIGKILL');
				} catch {
					// ignore
				}
			}
		}
	}
	freePreviewPort(port);
}

/** Wait until Vite prints its Local URL — fetch alone is not enough (stale/zombie listeners). */
function waitForPreviewProcess(proc: ChildProcess, url: string, timeoutMs = 120_000): Promise<void> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(
			() => reject(new Error(`Preview process did not become ready within ${timeoutMs}ms`)),
			timeoutMs
		);
		let settled = false;

		const finish = (err?: Error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			proc.stdout?.off('data', onData);
			proc.stderr?.off('data', onData);
			proc.off('exit', onExit);
			proc.stdout?.destroy();
			proc.stderr?.destroy();
			if (err) reject(err);
			else resolve();
		};

		const onData = (chunk: Buffer) => {
			const text = chunk.toString();
			process.stdout.write(text);
			if (text.includes('Local:') && text.includes(String(PREVIEW_PORT))) {
				finish();
			}
		};

		const onExit = (code: number | null) => {
			if (!settled && code && code !== 0) {
				finish(new Error(`Preview process exited with code ${code}`));
			}
		};

		proc.stdout?.on('data', onData);
		proc.stderr?.on('data', onData);
		proc.on('exit', onExit);

		// Fallback: if stdout was missed, poll once Vite should be up.
		void (async () => {
			const start = Date.now();
			while (Date.now() - start < timeoutMs && !settled) {
				try {
					const res = await fetch(`${url}/examples/render/${GALLERY_SLUGS[0]}`);
					if (res.ok) {
						const html = await res.text();
						if (html.includes('data-example-render-target')) {
							finish();
							return;
						}
					}
				} catch {
					// retry
				}
				await new Promise((r) => setTimeout(r, 400));
			}
		})();
	});
}

/** Layout is ready when tokens and connector paths exist and line gaps have height. */
async function waitForExampleLayout(page: Page, timeoutMs = 90_000): Promise<void> {
	await page.waitForFunction(
		() => {
			if (document.documentElement.dataset.exampleRenderReady === 'true') return true;

			const frame = document.querySelector('[data-example-render-target] .preview-frame');
			if (!frame) return false;

			const tokens = frame.querySelectorAll('.token-row [data-token-id]');
			if (tokens.length === 0) return false;

			const gaps = frame.querySelectorAll<HTMLElement>('[aria-label="Vertical gap between lines"]');
			for (const gap of gaps) {
				if (parseFloat(getComputedStyle(gap).height) < 12) return false;
			}

			const links = frame.querySelectorAll('path.link-path');
			return links.length > 0;
		},
		undefined,
		{ timeout: timeoutMs }
	);
}

async function main(): Promise<void> {
	const ownPreview = !process.env.PREVIEW_URL;
	let previewProc: ChildProcess | undefined;

	if (ownPreview) {
		freePreviewPort(PREVIEW_PORT);
		console.log(`Starting preview at ${PREVIEW_URL} …`);
		previewProc = startPreview();
		await waitForPreviewProcess(previewProc, PREVIEW_URL);
		console.log('Preview server ready.');
	}

	try {
		await mkdir(OUT_DIR, { recursive: true });

		const browser = await chromium.launch();
		try {
			const page = await browser.newPage({
				viewport: { width: EXAMPLE_RENDER_WIDTH + 80, height: 1200 },
				deviceScaleFactor: 2
			});

			page.on('pageerror', (err) => {
				console.error('  [page error]', err.message);
			});

			for (const slug of GALLERY_SLUGS) {
				const url = `${PREVIEW_URL}/examples/render/${slug}`;
				console.log(`Rendering ${slug} …`);
				await page.goto(url, { waitUntil: 'load', timeout: 120_000 });
				try {
					await waitForExampleLayout(page);
				} catch (err) {
					const title = await page.title();
					const ready = await page.evaluate(
						() => document.documentElement.dataset.exampleRenderReady ?? '(unset)'
					);
					throw new Error(
						`Layout not ready for ${slug} (title=${JSON.stringify(title)}, ready=${ready}): ${err}`
					);
				}
				const target = page.locator('[data-example-render-target] .preview-frame');
				const outPath = join(OUT_DIR, `${slug}.png`);
				await target.screenshot({ path: outPath, type: 'png' });
				console.log(`  → ${outPath}`);
			}

			const manifest = {
				generatedAt: new Date().toISOString(),
				width: EXAMPLE_RENDER_WIDTH,
				deviceScaleFactor: 2,
				slugs: [...GALLERY_SLUGS]
			};
			await writeFile(join(OUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
			console.log(`Done. ${GALLERY_SLUGS.length} PNGs in ${OUT_DIR}`);
		} finally {
			await browser.close();
		}
	} finally {
		if (previewProc) {
			await stopPreview(previewProc, PREVIEW_PORT);
		}
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
