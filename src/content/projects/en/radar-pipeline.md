---
title: "The Radar pipeline"
summary: "A publishing chain that writes a daily briefing with nobody touching it."
what: "Publishes an agent-written briefing every day with no human in the loop."
status: "live"
started: 2026-09-15
updated: 2026-09-17
stack: ["Gemini Spark", "Google Apps Script", "GitHub Actions", "Astro"]
url: "https://cmlonder.com/radar"
metrics:
  - label: "Humans in the chain"
    value: "0"
  - label: "Lines that transform"
    value: "60"
  - label: "Frequency"
    value: "daily"
order: 2
---

Every morning Spark writes a briefing and drops it into Drive as plain
markdown. An Apps Script pushes the file to the repository, a GitHub Action
validates it and moves it into place, and the site rebuilds. **Nobody in
between reads, corrects or reformats the text** — no human and no other model.

## The most expensive lesson

The chain started with 485 lines of code: a parser, a verifier, a chart engine,
a cover generator. Today 60 lines remain, and they do not transform anything —
they check that the file is well-formed and move it into place.

Most of the deleted code was **repairing what Google Docs had broken**: escaped
brackets (`[1]` → `\[1\]`), flattened heading levels, `&nbsp;` sprinkled
through the text, table links stripped out. Switching Spark from writing a Doc
to writing plain `.md` made an entire class of errors disappear.

The lesson: **do not manage complexity before you have looked for its source.**
I treated the symptom for weeks; changing the carrier took three minutes.

## The chain that quietly published stale content

One day the chain looked green and **published day-old content**. Two faults had
stacked: a push made with `GITHUB_TOKEN` does not trigger other workflows (loop
protection), and the called workflow was checking out the triggering commit.
Together, the bot committed the new briefing while the deploy built the
previous commit.

If I had not caught it on the first test, it would have published one day
behind, silently, every day.
