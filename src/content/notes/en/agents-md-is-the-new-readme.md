---
title: 'AGENTS.md is the new README'
description: 'The README was written for a human who would skim it once. This file is read in full, every run.'
pubDate: 2026-07-29
status: budding
topics: [agentic-development]
tags: [conventions]
draft: false
placeholder: true
---

A README is a genre written for a human who will skim it once. Setup
steps, a row of badges, maybe an architecture sketch. Nobody reads it end
to end every day, which is why nobody minds that it goes stale.

`AGENTS.md` is a different kind of file, because it really does get read
end to end on every run. That single difference changes how it should be
written. When a rule is vague a human ignores it; an agent does not
ignore it, it misinterprets it. The cost of ambiguity became real for the
first time.

Three habits have settled out of this for me. I write the reason rather
than the rule, because an agent that knows why can pick the right side in
a situation the rule never covered. I write prohibitions with examples,
because "write clean code" says nothing while "do not use this pattern in
this file, use that one instead" says something. And I try to keep rules
checkable: a rule no command can verify is a rule nobody knows whether
anyone is following.

The part I have not solved is growth. Every new rule eats into the
context budget, and past a certain size the agent starts missing things
in the middle of the file. Right now I have two bad options: shorten the
rules and make them vaguer, or split the file and decide which piece
loads when. The second feels more correct but I have not found the
splitting criterion yet.
