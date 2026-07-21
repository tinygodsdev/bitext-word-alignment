# Obsidian Tasks (TaskNotes plugin)

Tasks are stored as individual `.md` files — one file per task. A project page does not
contain tasks directly; it renders them via `![[tasks-default.base#ThisProject]]` (dynamic
query by the Bases plugin).

## Reusing this file in another repo

This file is generic and machine-agnostic — commit it verbatim; it is identical in every repo.
It carries no absolute paths, so it never conflicts across machines. Two placeholders are resolved
at read time:

- **`<PROJECT>`** — the per-project value, defined once in that repo's committed `PROJECT.md`.
  It is the project page filename (`PROJECTS/<PROJECT>.md`) and the wikilink used in a task's
  `projects:` field (`"[[<PROJECT>]]"`).
- **`<VAULT>`** — the vault root, plus the task/archive/project folder paths. These are
  machine-specific and live in the sibling file `obsidian-tasks.local.md`, which is **gitignored**
  and created per machine by `init-obsidian-tasks`. Read that file for the actual paths whenever a
  command below uses `<VAULT>`.

Substitute both wherever they appear below.

---

## Machine configuration

Vault root and folder paths are not stored here. They live in the gitignored sibling file
`.agents/tools/obsidian-tasks.local.md` (created by `init-obsidian-tasks`), so each machine keeps
its own without polluting the repo. Read it to resolve `<VAULT>` and the tasks/archive/project
folders.

---

## Frontmatter schema

```yaml
---
title: Task title
status: planned
priority: normal
contexts:
  - agentic             # always set when agent creates or modifies a task
projects:
  - "[[<PROJECT>]]"     # wikilink matching the project page filename
agent-identity: claude-sonnet-4-6  # fill with actual agent/model id
dateCreated: 2026-01-01T00:00:00.000+03:00
dateModified: 2026-01-01T00:00:00.000+03:00
tags:
  - task
scheduled: 2026-01-01  # optional
due: 2026-01-01        # optional
timeEstimate: 60       # minutes, optional
blockedBy:             # list of wikilinks, optional
linear-issue:          # issue URL — managed by the vault's Linear sync, never edit by hand
linear-team:           # managed by the Linear sync
linear-synced-at:      # managed by the Linear sync
timeEntries:           # filled during work, see Time tracking section
  - startTime: 2026-01-01T10:00:00.000Z
    description: Brief description of what was done
    endTime: 2026-01-01T11:30:00.000Z
---
```

Tasks are identified by the `task` tag. Every task file must have it.

---

## Field values

These values come from the plugin config and apply across all projects.

### Status

| Value | Label | Active? |
|---|---|---|
| `backlog` | Backlog | Yes |
| `planned` | Planned | Yes (default for new tasks) |
| `ongoing` | Ongoing | Yes |
| `onhold` | On Hold | Yes |
| `review` | Review | Yes |
| `done` | Done | No |
| `closed` | Closed | No (auto-archives) |

### Priority

| Value | Label |
|---|---|
| `low` | Low |
| `normal` | Normal (default) |
| `high` | High |

### Contexts

Free-form — no predefined values in plugin config. Always include `agentic` when the agent
creates or modifies a task.

---

## Agent behavior

When creating a task:
- Set `contexts: [agentic]`
- Set `agent-identity` to the current model/agent identifier
- Set `projects` to `"[[<PROJECT>]]"`
- `status` defaults to `planned`, `priority` defaults to `normal`

When updating a task, update `dateModified` to the current timestamp.

When work on a task is complete, run the `obsidian-task-done` skill — it performs the close-out
in the right order. The steps it covers:
- Set `status: review` (not `done` — the user reviews and closes)
- Add a brief summary to the task body: what was done and anything the user should know
  (e.g. decisions made, caveats, follow-ups)
- Add a Changelog entry on the project page (see Changelog section)

---

## Time tracking

When working on a task, record the session by appending to `timeEntries` in the frontmatter.

**Format:**
```yaml
timeEntries:
  - startTime: 2026-06-20T10:00:00.000Z
    description: Brief description of what was done in this session
    endTime: 2026-06-20T11:30:00.000Z
```

**Rules:**
- Times are in UTC (suffix `Z`)
- Note the start time before beginning work, note the end time when done
- `description` should describe what was accomplished in this specific session (not repeat the task title)
- Add a new entry per work session; never edit past entries
- If `timeEstimate` is set on the task, use it as a rough target

---

## Changelog

Each project page (`<VAULT>/PROJECTS/<PROJECT>.md`) has a `## Changelog` section. Update it
when completing meaningful work.

**Format** — group by date, most recent first, one line per entry or group:

```markdown
## Changelog

### 2026-06-20
- Added top/bottom padding controls for cards
- Various UI improvements: mini-preview on mobile, export flow

### 2026-06-10
- Initial card generation feature
```

**Rules:**
- Write entries when marking a task as `review`
- One line per change; group small related changes into a single line (e.g. several UI tweaks → "Various UI adjustments: X, Y, Z")
- Focus on user-visible outcomes, not implementation details
- **Compact periodically:** if a date has many granular entries, merge them. Older history should read as milestones, not a commit log
- Significant features and decisions stay separate; minor fixes and polish get grouped

---

## Linear

Tasks sync to Linear automatically through the vault's own integration — you do not create issues,
set `linear-*` fields, or push status. Those fields are managed for you.

The one manual step is on the code side: **when you open a PR for a task, tag it with the task's
Linear issue so Linear links the PR to the issue.**

1. Read `linear-issue` from the task frontmatter. If the field is absent, the task is not tracked in
   Linear — open the PR normally and skip the rest.
2. Take the issue identifier from the URL: the segment after `/issue/`, e.g.
   `https://linear.app/<workspace>/issue/BLD-67/...` → `BLD-67`.
3. Put that identifier in the PR **title**, in parentheses at the end, and mention it once in the PR
   **body**. Example title: `Rebalance free and Pro tiers (BLD-67)`.

That is all — status, links, and sync are handled by the integration.

---

## Common queries

Find all tasks for this project:
```bash
grep -rl '"[[<PROJECT>]]"' <VAULT>/META/planning/Tasks/
```

Find tasks by status:
```bash
grep -rl 'status: planned' <VAULT>/META/planning/Tasks/
```

Combine both:
```bash
grep -l 'status: planned' $(grep -rl '"[[<PROJECT>]]"' <VAULT>/META/planning/Tasks/)
```

---

## Refreshing this document

If statuses, priorities, or paths change, re-read the plugin config:
```
<VAULT>/.obsidian/plugins/tasknotes/data.json
```
Key fields: `customStatuses[].value`, `customPriorities[].value`, `tasksFolder`, `archiveFolder`.

Status and priority edits go in this file. Path changes (`tasksFolder`, `archiveFolder`, vault
root) go in the gitignored `obsidian-tasks.local.md`, never here.
