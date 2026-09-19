---
title: Colophon
description: How this site is built, and why it is built that way.
updated: 2026-09-15
---

This site is a small argument in favour of its own thesis: content that lives as
plain files in a repository is content an agent can work with.

## Stack

Astro, static output, deployed to GitHub Pages by a GitHub Actions workflow on
every push to `main`. No database and no server; the only third party is
Google Analytics, which counts page views.

## Type

**Fraunces** for everything serif, using its optical-size axis so one family
covers both display and body. **Lato** for interface text, **IBM Plex Mono** for
code. All three are downloaded at build time and served from this domain — the
page makes no external font requests.

## Colour

Six tokens, defined once, redefined once for dark mode. Every pairing is
measured against WCAG AA before it ships. One colour, a sea blue, is used only
for icons because it does not pass contrast for text.

## For agents

Every entry is available as clean Markdown — append `.md` to any entry URL.
There is an [llms.txt](/llms.txt) index and a
[complete index](/llms-full.txt) of every entry in both languages. Articles
carry JSON-LD that points at their Markdown mirror.

The repository carries an `AGENTS.md` describing the content contract, and two
skills — one for adding a link, one for adding an essay, note or playbook.

## Credit where it is due

The information architecture, type scale and layout owe an obvious debt to
[Maggie Appleton](https://maggieappleton.com). The idea that content types
should be sorted by how finished the thinking is, rather than by subject, is
hers.
