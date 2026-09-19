---
title: 'The cost of a half-finished abstraction'
description: 'Unfinished abstractions are worse than none, and agents make them cheaper to create and harder to spot.'
pubDate: 2026-08-03
status: seedling
topics: [agentic-development, solution-architecture, abstraction]
draft: false
placeholder: true
---

A missing abstraction is annoying in a way that is easy to see: the same
logic sits in four places and you have to remember to change all four. A
half-finished abstraction is worse, and it is much harder to see.

The shape is always similar. Someone extracts a common piece, covers
three of the five call sites, and leaves the other two doing it the old
way. Now the codebase has two truths. A reader finds the abstraction,
assumes it is authoritative, and is wrong. The next person extends the
abstraction for their case, which makes it slightly more general and
slightly less honest about what it actually handles.

The cost is not the duplication. It is that the abstraction makes a
promise the code does not keep, and every subsequent reader pays to
discover that.

What changed recently is the economics. Extracting an abstraction used
to be slow enough that you thought about it first and finished it once
you started. With an agent it is fast, which means half-finished ones
get created more easily. They are also harder to spot in review, because
the diff shows a clean extraction and says nothing about the call sites
that were left behind.

The only countermeasure I have found so far is mechanical: when an
abstraction is introduced, ask for the list of call sites that were not
migrated, in the same change. If that list is not empty, the change is
not done. I do not love this, because it relies on me remembering to ask.
