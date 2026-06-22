Project-specific details

## Tasks

Task management: Obsidian (TaskNotes plugin).
Workflow, schema, field values, time tracking, changelog rules, and queries:
`.agents/tools/obsidian-tasks.md`.

**Project name:** `Word Aligner`

This is the only project-specific value. It is the `[[Word Aligner]]` wikilink in a task's `projects:`
field and the `PROJECTS/Word Aligner.md` project page. It substitutes for `<PROJECT>` in
`.agents/tools/obsidian-tasks.md`.

### Task workflow

When asked to work with tasks, issues, tickets, etc., follow `.agents/tools/obsidian-tasks.md`,
with these project-level rules on top:

- Look at `planned` and `ongoing` tasks first; if both are empty, check `backlog`.
- Unless asked directly, only work tasks whose context is `agentic` or empty.
- After work: set status to `review` (not `done`), summarize in the task body, and add a
  Changelog entry on the project page.
- Feel free to refine a task's title/description for precision (keep titles concise).
- If asked to do something without a task, consider creating one in the relevant project and
  following this flow.
