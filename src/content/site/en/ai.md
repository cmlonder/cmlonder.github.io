---
title: 'AI usage'
description: 'Which parts of this site I write, which parts a machine writes, and what happens when it does.'
updated: 2026-09-18
---

Short answer: **The writing is mine. [Radar](/radar) is not.**

> The Radar briefings themselves are written in Turkish. This page explains the
> process in English; the mechanics are identical.

## Who writes which part

| Section | Who writes it |
|---|---|
| Essays, Notes, Playbooks, Signals, Library | Me |
| [Radar](/radar) | An agent (Gemini Spark). Not me. |

I use agents while writing — for correction, research and code. But the
sentences and the claims are mine, and so is the responsibility for them. Radar
is categorically different: the machine produces the text and I do not see it
first.

## How Radar works

A daily agent task searches for solo-founder cases and produces publish-ready
markdown, dropping a file like `2026-09-16.md` into Drive. An Apps Script pushes
that file to the repository unchanged, a GitHub Action checks that the
frontmatter is well-formed and moves it into place, and the site rebuilds.
Nobody in between reads, corrects or rewrites the text — no human and no other
model.

Every claim is numbered inline, and each number resolves to a linked entry in
the source list at the foot of the piece. You can check the figures yourself; I
am leaving the verification to you rather than claiming it was done on my
behalf.

## Why I do not trust the agent's own assertions

The agent used to fill in its own "confidence" column. On one round I watched it
do this: it **guessed** the address of a page it could not reach, wrapped the
guess in a Google search link, and wrote *"metric pulled directly from the
profile"* into the table. The address it guessed was a 404.

The agent cannot fetch URLs. When it could not, instead of saying so it claimed
to have verified. So the confidence column came out of the prompt — the agent
now supplies only claims and sources, with no commentary attached.

For a while I ran a script that fetched the source behind each claim and looked
for the cited value in the text. It worked: one day it caught the agent
reporting a real listing correctly but **inventing the price** — the listing was
on the page, the number was not. But it had two problems. Live sources drift: a
page saying `$6,441` one day said `$6,491` the next, and a published piece would
turn itself into "unverified" overnight. And the page filled up with verification
tables that nobody read. I have removed it for now; I think making the sources
visible serves the reader better.

## Transparency markers

Every Radar piece carries:

- A single clear statement on the [`/radar`](/radar) page covering the whole
  series: an agent produces the text, I do not write it
- A numbered source for every claim, with a full link list at the foot
- Machine-readable marking: IPTC
  [`trainedAlgorithmicMedia`](http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia)
  and `creativeWorkStatus: Machine-generated`

I know the badge alone is not enough —
[research](https://hai.stanford.edu/policy/labeling-ai-generated-content-may-not-change-its-persuasiveness)
shows that an "AI-generated" label does not reduce how persuasive the content
is. What protects the reader is not the badge but being able to see which line
is rotten. That is why the sources are published.

## The label

When an agent wrote the whole text, the byline carries a small dashed
mark next to the date: **ai-written**. It is shaped differently from the
topic chips on purpose — it is not a topic, it is provenance. Radar
bulletins and domain chapters carry it. Clicking it brings you here.

Two levels, one mark:

- **ai-written** — an agent produced the text (a NotebookLM briefing, a
  Spark run) and I edited it. The argument and the order are mine; most
  of the sentences are not.
- **AI-assisted** — I wrote it, AI read it for spelling and flow. These
  get no mark. The rule is [Simon Willison](https://simonwillison.net/2026/Mar/1/ai-writing/)'s:
  any sentence with an opinion or an "I" in it is mine.

Machine side: marked pages carry `<meta name="ai-disclosure"
content="ai-generated">`, and the `.md` mirror has an `AI: ai-generated`
line ([proposal](https://github.com/dweekly/ai-content-disclosure)).

## Radar is in the main feed

Radar briefings flow through the main [`/rss.xml`](/rss.xml) feed alongside the
writing. I kept a separate feed for a while, but subscribing to two addresses
served nobody. The feed entries mark the briefings as machine-produced, so your
reader does not have to guess who wrote what.

## If you find an error

If you see a claim that is wrong,
[open an issue in the repository](https://github.com/cmlonder/cmlonder.github.io/issues)
or leave a comment under the piece. Every error the agent gets away with is a
rule to add to the prompt.
