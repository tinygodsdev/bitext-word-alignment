import {
	addAtomicLinks,
	pendingAlignmentColor,
	removeLink,
	type Link
} from '$lib/domain/alignment.js';
import {
	connectedLinkComponents,
	connectedLinkIds,
	filterValidLinks
} from '$lib/domain/link-graph.js';
import { PALETTES, type PaletteName } from '$lib/domain/palettes.js';
import { reconcile, tokenize, type Token } from '$lib/domain/tokens.js';
import {
	defaultProjectSnapshot,
	normalizeProjectLinks,
	type ProjectSnapshotV1
} from '$lib/serialization/schema.js';
import { settingsStore } from '$lib/state/settings.svelte.js';

class ProjectStore {
	sourceTextRaw = $state('');
	targetTextRaw = $state('');
	sourceTokens = $state<Token[]>([]);
	targetTokens = $state<Token[]>([]);
	links = $state<Link[]>([]);

	constructor() {
		this.loadSnapshot(defaultProjectSnapshot());
	}

	private currentSplitChars(): string {
		return settingsStore.settings.tokenSplitChars;
	}

	setSourceText(raw: string) {
		this.sourceTextRaw = raw;
		const next = tokenize(raw, 'source', this.currentSplitChars());
		this.sourceTokens = reconcile(this.sourceTokens, next, 'source');
		this.links = filterValidLinks(
			this.links,
			new Set(this.sourceTokens.map((t) => t.id)),
			new Set(this.targetTokens.map((t) => t.id))
		);
	}

	setTargetText(raw: string) {
		this.targetTextRaw = raw;
		const next = tokenize(raw, 'target', this.currentSplitChars());
		this.targetTokens = reconcile(this.targetTokens, next, 'target');
		this.links = filterValidLinks(
			this.links,
			new Set(this.sourceTokens.map((t) => t.id)),
			new Set(this.targetTokens.map((t) => t.id))
		);
	}

	retokenizeFromSettings() {
		this.setSourceText(this.sourceTextRaw);
		this.setTargetText(this.targetTextRaw);
	}

	setSourceGloss(tokenId: string, gloss: string) {
		this.sourceTokens = this.sourceTokens.map((t) =>
			t.id === tokenId ? { ...t, gloss: gloss || undefined } : t
		);
	}

	setTargetGloss(tokenId: string, gloss: string) {
		this.targetTokens = this.targetTokens.map((t) =>
			t.id === tokenId ? { ...t, gloss: gloss || undefined } : t
		);
	}

	addAlignment(sourceIds: string[], targetIds: string[], palette: PaletteName) {
		const color = pendingAlignmentColor(this.links, sourceIds, targetIds, palette);
		const seedTokens = new Set<string>([...sourceIds, ...targetIds]);
		const pairs: { sourceId: string; targetId: string }[] = [];
		for (const s of sourceIds) {
			for (const t of targetIds) {
				pairs.push({ sourceId: s, targetId: t });
			}
		}
		const merged = addAtomicLinks(this.links, pairs, color);
		const componentAfter = connectedLinkIds(merged, seedTokens);
		this.links = merged.map((l) => (componentAfter.has(l.id) ? { ...l, color } : l));
	}

	/** Reassign link colors when the user switches palette (keeps order, no duplicates until palette wraps). */
	recolorAllLinks(palette: PaletteName) {
		const pool = PALETTES[palette];
		const components = connectedLinkComponents(this.links);
		const colorByLinkId: Record<string, string> = {};
		components.forEach((component, i) => {
			const color = pool[i % pool.length];
			component.forEach((id) => {
				colorByLinkId[id] = color;
			});
		});
		this.links = this.links.map((l) => ({
			...l,
			color: colorByLinkId[l.id] ?? pool[0]
		}));
	}

	removeAlignment(linkId: string) {
		this.links = removeLink(this.links, linkId);
	}

	clearAllLinks() {
		this.links = [];
	}

	updateLinkColor(linkId: string, color: string) {
		const link = this.links.find((l) => l.id === linkId);
		if (!link) return;
		const component = connectedLinkIds(this.links, [link.sourceId, link.targetId]);
		this.links = this.links.map((l) => (component.has(l.id) ? { ...l, color } : l));
	}

	getSnapshot(): ProjectSnapshotV1 {
		return {
			sourceText: this.sourceTextRaw,
			targetText: this.targetTextRaw,
			sourceGlosses: this.sourceTokens.map((t) => t.gloss ?? null),
			targetGlosses: this.targetTokens.map((t) => t.gloss ?? null),
			links: this.links.map((l) => ({ ...l }))
		};
	}

	/** Demo alignment for first-time users */
	loadExample() {
		this.loadSnapshot({
			sourceText: 'The cat sleeps',
			targetText: 'Le chat dort',
			sourceGlosses: [],
			targetGlosses: [],
			links: []
		});
		const p = settingsStore.settings.palette;
		this.addAlignment(['s-0'], ['t-0'], p);
		this.addAlignment(['s-1'], ['t-1'], p);
		this.addAlignment(['s-2'], ['t-2'], p);
	}

	loadSnapshot(s: ProjectSnapshotV1) {
		this.sourceTextRaw = s.sourceText;
		this.targetTextRaw = s.targetText;
		const st = tokenize(s.sourceText, 'source', this.currentSplitChars());
		const tt = tokenize(s.targetText, 'target', this.currentSplitChars());
		this.sourceTokens = st.map((t, i) => ({
			...t,
			gloss: s.sourceGlosses[i] ?? undefined
		}));
		this.targetTokens = tt.map((t, i) => ({
			...t,
			gloss: s.targetGlosses[i] ?? undefined
		}));
		this.links = normalizeProjectLinks(s.links);
	}
}

export const projectStore = new ProjectStore();
