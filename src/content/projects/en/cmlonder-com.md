---
title: "cmlonder.com"
summary: "This site. Bilingual, agent-friendly, with a fully automated publishing chain."
what: "Hosts what I write and exposes a surface agents can read."
status: "live"
started: 2026-09-15
updated: 2026-09-17
stack: ["Astro", "TypeScript", "GitHub Actions", "GitHub Pages"]
url: "https://cmlonder.com"
repo: "https://github.com/cmlonder/cmlonder.github.io"
metrics:
  - label: "Pages"
    value: "189"
  - label: "Chapters"
    value: "12"
  - label: "Deploy time"
    value: "2 min"
order: 1
---

There was a dead blog on Hashnode with two posts on it. I shut it down and
rebuilt from scratch; the goal was not to write but to build **a floor that
makes writing easy**.

## What it does differently

Content is plain Markdown in the repository. The conventions live in
`AGENTS.md`, which means an agent can open the repo and read for itself how to
add a piece. Every entry has a `.md` mirror, and `llms.txt` and
`llms-full.txt` present the whole site in machine-readable form.

The garden logic: notes mature through **Seedling → Budding → Evergreen** and a
badge shows where each one is. In the domain files the outline is public from
day one — **including the chapters that are not written** — each with a
sentence saying what it will cover.

## What I learned

A green build does not mean the page works. With `sharp` not installed, Astro
cannot produce optimised images but **prints a warning and carries on**; the
`<img>` points at a file that does not exist, the build looks successful, and
the page is broken. Now `check-build.mjs` verifies that every image was
actually generated.

Another one of the same kind: I had written no CSS at all for the `.controls`
class. Search, language and theme buttons were stacking on top of each other on
every page, and **I looked at screenshots repeatedly without seeing it**. A
design review caught it.
