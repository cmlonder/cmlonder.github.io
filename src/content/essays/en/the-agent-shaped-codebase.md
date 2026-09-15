---
title: 'The Agent-Shaped Codebase'
description: 'Codebases are about to be read more often by agents than by people. That changes what "clean code" means.'
pubDate: 2026-09-15
topics: [agentic-development, solution-architecture]
tags: [conventions, code-review]
featured: true
draft: false
placeholder: true
---

For twenty years we optimised source code for a human reader. That reader had
limited working memory, read top to bottom, and could walk over and ask a
colleague. None of those constraints describe the reader we now write for most
of the time.

## What stops being cosmetic

Three things move from style preference to load-bearing infrastructure.

**File layout becomes an index.** An agent finds code by name and path before
it finds it by reading. A directory that reflects the domain is worth more than
one that reflects the framework.

**Comments become contracts.** Not *what* the code does — the code says that —
but which invariants must hold and what happens if they do not.

**Conventions become executable.** A convention that only lives in a reviewer's
head is invisible. One that lives in a schema, a lint rule, or an `AGENTS.md`
is enforced on every run.
