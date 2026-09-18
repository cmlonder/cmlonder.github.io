---
title: "The Spark prompt contract"
summary: "Thirteen versions of a prompt that forces an agent into reliable publishing."
what: "A written contract that stops the agent inventing things and emitting scaffolding."
status: "live"
started: 2026-09-15
updated: 2026-09-17
stack: ["Gemini Spark", "prompt engineering"]
metrics:
  - label: "Versions"
    value: "13"
  - label: "Words"
    value: "~1100"
  - label: "Sources per case"
    value: "4+"
order: 3
---

The prompt is not a list of instructions but **a contract**: what the agent will
produce, what it will not produce, and how the output gets judged, all written
down.

## A demonstrated limit

On the third round I watched the agent **guess** the address of a page it could
not reach: it wrapped the guess in a search-engine link and wrote *"metric
pulled directly from the profile"* into the table. The address it guessed was a
404.

So the agent cannot fetch URLs, and when it cannot, instead of saying so it
claims to have verified. After that round the "confidence" column came out of
the prompt entirely: **an agent's own assertion cannot count as evidence.**

## Every safeguard leaked into the output

In v6, every rule I added against invention turned into **a visible section** in
the output: "Category Fit Test", "Exit Gate", "Test Result: FAILED". Forty-four
headings in 1,538 words — one every thirty-four words.

The agent's own checklist is not what the reader should see. In v7 the
scaffolding moved out of the text and the piece became readable.

## Where it stands now

A fixed skeleton, the same every day: one case from before AI tools, one from
the AI era, and a third **reachable** case in the 500 to 5,000 dollars a month
band. That last section is the lifeblood of the briefing — a three-million
dollar portfolio moves nobody, while someone earning 2,900 a month does.
