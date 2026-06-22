## Purpose

This file defines stable, project-agnostic instructions for AI agents working in this repository. Keep this file short and universal. Do not add project-specific documentation, plans, temporary notes, or implementation details here.

## Project knowledge

Treat `AGENTS.md` as read-only operating guidance. Do not edit it or use it as project memory.

## Tasks 

When you need to search or find project tasks, issues, tickets, etc., address to @PROJECT.md file for specific instructions. Respect the task management system described there. 

## Architecture

- Use the simplest architecture that keeps the code easy to understand, test, and change.
- Separate responsibilities when they have different reasons to change.
- Avoid adding layers, patterns, or abstractions before they solve a real problem in the codebase.
- Keep business/domain logic away from framework, UI, transport, storage, and infrastructure details when practical.

## Comments

- Code should be self-explanatory.
- Use clear, descriptive variable and function names.
- Structure code so its intent is obvious.
- Use comments only when they add useful context that is not obvious from the code.
- Keep comments concise and to the point.
- Comments in code files should always be in English.
- If code needs a long comment to be understood, refactor it first.

## Error handling

- Errors should be visible. Avoid silent and hidden errors.
- Errors should be specific. Avoid wrapping lots of logic in a single try-catch block (or other error handling mechanism).
- Avoid fallback code unless it is an explicit requirement of the task. Fail fast to prevent hiding broken functionality.
- Do not handle multiple input formats unless it is required by the task. For example, if some variable should be "https://example.com" (with domain) don't handle "example.com" as well, unless it is explicitly required by the task. Handle unexpected input as an error, unless the task required to support multiple formats.

## Code structure

- Keep code reasonably modular, but avoid unnecessary abstraction.
- Prefer small functions and components that are easy to reuse and test independently.
- If a file becomes too large or mixes unrelated responsibilities, split it into focused files.

## Makefile

- Use Makefile for project-wide commands. Keep it simple and focused on the most common tasks. It should have commands that are useful for local development and are intended to be used frequently. 
- Add .PHONY targets for commands that are not file-based directly above the target.
- Don't create "help" target or other non-functional targets.
- If Makefile commands need some configuration, use environment variables. Connect .env file to Makefile.

## Environment variables

- Use .env.example file as a template for .env file. Keep it updated. If some variables are not needed or deprecated, remove them from the example file. Obviously, don't store actual secrets in .env.example file.

## Refactoring

- Keep changes focused on the task.
- Small, safe refactorings are allowed when they directly support the current change, reduce duplication, or make the fix simpler.
- Do not perform broad, unrelated refactoring without explicit user approval.
- If you notice larger structural problems, mention them in the final response as optional follow-ups instead of interrupting the task.
