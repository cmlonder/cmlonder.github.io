---
title: Uses
description: The tools I actually work in, and how the agent setup is wired.
updated: 2026-09-15
---

A [/uses](https://uses.tech) page. The hardware section is the boring part — the
agent setup below it is the part that actually changed how I work.

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
- **Skills** in `.claude/skills/` — one per recurring task. This site has four:
  adding a link, adding an essay, adding a book, and turning a briefing plus a
  slide deck into a chapter. Each is a short markdown file describing *when* it
  applies and *what good looks like*, not a script.
- **A verification command** — `pnpm verify` here. If an agent cannot check its
  own work, you are the check, and you will not scale.

That is the whole method. The files live in the repository, next to the code they act on.

> ⚠️ Donanım ve uygulama listesi eksik — kendi kurulumunla tamamla.
