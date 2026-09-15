---
title: Uses
description: The tools I actually work in, and how the agent setup is wired.
updated: 2026-09-15
---

A [/uses](https://uses.tech) page. The hardware section is the boring part — the
agent setup below it is the part that actually changed how I work.

## Machine

Apple silicon Mac, macOS 26. zsh. That is genuinely the whole list; I have
stopped caring about this layer.

## Editor and agents

I do most work through **[Claude Code](https://claude.com/claude-code)** in a
terminal rather than in an editor. **Cursor** and **VS Code** are open for
reading and for the occasional manual edit, but they are not where the work
happens any more.

The setup that matters is not the tool, it is what the repository tells the tool.
Every project I care about carries:

- **`AGENTS.md`** — architecture decisions, the content or data contract, and
  the rules that would otherwise live only in my head. `CLAUDE.md` is a symlink
  to it so there is exactly one file to keep true.
- **Skills** in `.claude/skills/` — one per recurring task. This site has three:
  adding a link, adding an essay, adding a book. Each is a short markdown file
  describing *when* it applies and *what good looks like*, not a script.
- **A verification command** — `pnpm verify` here. If an agent cannot check its
  own work, you are the check, and you will not scale.

That is the whole method. See the [skills](/skills) page for the actual files.

## Terminal

iTerm, `ripgrep` for search, `fzf` for everything that is a list, `gh` for
anything GitHub. `docker` when a dependency insists.

## Runtime

Node 22 and pnpm, pinned with `packageManager` so CI and my laptop cannot drift.
That pin exists because they did drift, and the build broke in a way that took
longer to diagnose than it should have.

## Elsewhere

Obsidian for notes that are not ready to be public. Notion for anything that
needs another person to read it.

> ⚠️ Donanım ve uygulama listesi eksik — kendi kurulumunla tamamla.
