Project-specific details

## Tasks

Task management: Obsidian (TaskNotes plugin).
Workflow, schema, field values, time tracking, changelog rules, and queries:
`.agents/tools/obsidian-tasks.md`.
Machine-specific paths (vault root) live in the gitignored `.agents/tools/obsidian-tasks.local.md`;
run `init-obsidian-tasks` to (re)create it on a new machine.

**Project name:** `Word Aligner`

This is the only project-specific value. It is the `[[Word Aligner]]` wikilink in a task's `projects:`
field and the `PROJECTS/Word Aligner.md` project page. The generic workflow file
`.agents/tools/obsidian-tasks.md` refers to it by its own placeholder; resolve that placeholder to
the name above.

### Task workflow

When asked to work with tasks, issues, tickets, etc., follow `.agents/tools/obsidian-tasks.md`,
with these project-level rules on top:

- **First, check the machine config exists.** If `.agents/tools/obsidian-tasks.local.md` is absent
  (a fresh checkout on a new machine has the committed files but not the gitignored local one), run
  `init-obsidian-tasks` to rebuild it before doing anything else. The project name and workflow are
  already committed, so init only has to find the vault and write the local file plus the
  `.gitignore` line.
- Look at `planned` and `ongoing` tasks first; if both are empty, check `backlog`.
- Unless asked directly, only work tasks whose context is `agentic` or empty.
- After work: set status to `review`, leave `completedDate` empty, summarize in the task body, and
  add a Changelog entry on the project page. Never set `done`/`closed` and never fill
  `completedDate` without an explicit request — that hides the task from the dashboard before the
  user has seen it.
- Feel free to refine a task's title/description for precision (keep titles concise).
- If asked to do something without a task, consider creating one in the relevant project and
  following this flow.
