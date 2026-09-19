---
title: 'Budget the context before adding tools'
description: 'Every tool definition costs tokens on every turn. Most agent slowdowns are a context problem, not a model problem.'
pubDate: 2026-08-23
problem: 'An agent is slow, expensive, or losing the plot mid-task.'
context: 'Any tool-using agent with more than a handful of tools in its definition list.'
topics: [agentic-development, context-engineering, tools]
draft: false
placeholder: true
---

## Problem

The agent got slower or less accurate, and the first instinct is to add
another tool. But every tool definition occupies space in the context
window on every turn, which means what you add also reduces something
else's share.

## Context

A tool-using agent setup, usually with more than ten tools and a growing
system prompt.

## Approach

Measure the current budget first. How many tokens do the tool
definitions, the system prompt, and the auto-included context files
actually consume? I do not make a decision without knowing this, and in
most setups the number comes out noticeably larger than people expect.

Then look at usage counts: across the last hundred runs, how many times
was each tool called? Almost every setup has tools that were never
called or called once. Removing those buys more than adding a new one.

Next, shorten the definitions. Long descriptions and parameter-heavy
schemas take several times the space of a compact definition doing the
same job. Reducing parameter count lowers both the budget and the rate
of malformed calls.

Finally, group tools by task so that not everything is loaded every
time. Only after those three steps do I consider adding a tool.

## Tradeoffs

Removing a tool leaves the agent stuck in the rare cases where that
capability was genuinely needed, and noticing this takes a while.
Task-based loading introduces configuration complexity: deciding which
task gets which bundle becomes its own maintenance burden.

Shortened definitions can also become ambiguous; trim too far and call
errors rise, spending the budget you saved on retries.

## When this does not work

If the problem is a genuine capability gap, budgeting does not fix it.
When the agent is attempting something it cannot do, the missing
resource is a tool, not tokens.

It also has no payoff in small setups using less than half the window,
where nothing is competing for space in the first place.
