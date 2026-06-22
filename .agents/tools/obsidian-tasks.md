# Obsidian Tasks (TaskNotes plugin)

Tasks are stored as individual `.md` files — one file per task. A project page does not
contain tasks directly; it renders them via `![[tasks-default.base#ThisProject]]` (dynamic
query by the Bases plugin).

## Reusing this file in another repo

This file is project-agnostic — copy it verbatim into any repo's `.agents/tools/`.

- **`<PROJECT>`** — the only per-project value. It is defined once in that repo's `PROJECT.md`.
  It is the project page filename (`PROJECTS/<PROJECT>.md`) and the wikilink used in a task's
  `projects:` field (`"[[<PROJECT>]]"`). Substitute it wherever `<PROJECT>` appears below.
- **Machine configuration** (vault paths, see section below) is constant across all projects on
  this machine. Change it only when moving to a different machine or vault.

---

## Machine configuration

| Location | Path |
|---|---|
| Vault root | `/home/titkovd/bliss-vault/Bliss` |
| Active tasks | `/home/titkovd/bliss-vault/Bliss/META/planning/Tasks/` |
| Archived tasks | `/home/titkovd/bliss-vault/Bliss/META/planning/Archive/` |
| Project pages | `/home/titkovd/bliss-vault/Bliss/PROJECTS/` |
| Plugin config | `/home/titkovd/bliss-vault/Bliss/.obsidian/plugins/tasknotes/data.json` |

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

When work on a task is complete:
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

Each project page (`/home/titkovd/bliss-vault/Bliss/PROJECTS/<PROJECT>.md`) has a `## Changelog` section. Update it
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

## Common queries

Find all tasks for this project:
```bash
grep -rl '"[[<PROJECT>]]"' /home/titkovd/bliss-vault/Bliss/META/planning/Tasks/
```

Find tasks by status:
```bash
grep -rl 'status: planned' /home/titkovd/bliss-vault/Bliss/META/planning/Tasks/
```

Combine both:
```bash
grep -l 'status: planned' $(grep -rl '"[[<PROJECT>]]"' /home/titkovd/bliss-vault/Bliss/META/planning/Tasks/)
```

---

## Refreshing this document

If statuses, priorities, or paths change, re-read the plugin config:
```
/home/titkovd/bliss-vault/Bliss/.obsidian/plugins/tasknotes/data.json
```
Key fields: `customStatuses[].value`, `customPriorities[].value`, `tasksFolder`, `archiveFolder`.
