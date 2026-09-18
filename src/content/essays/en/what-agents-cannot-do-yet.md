---
title: 'What Agents Still Cannot Do'
description: 'An honest list, kept up to date, of where the end-to-end agentic workflow still falls over.'
pubDate: 2025-12-11
topics: [agentic-development]
tags: [limits, workflow]
featured: false
draft: false
placeholder: true
---

Most of what gets written about agent limitations ages badly within a
few months, because it describes a capability gap that the next model
closes. I want to write about the limitations that do not seem to be
about capability at all, the ones that come from the shape of the
arrangement rather than the strength of the model.

## Knowing what is not written down

The hardest thing to hand off is the knowledge that never made it into
the repository. Why this table has a denormalised column, which customer
the odd branch in the pricing code exists for, why the retry count is
seven and not five. None of it is in the code, and most of it is not in
anyone's head either; it lives in a decision someone made in a meeting
four years ago.

An agent reading the repository sees a system that looks arbitrary in
places, and its instinct is to clean up the arbitrary parts. That
instinct is right in general and wrong here. The limitation is not
reasoning. It is that the information genuinely does not exist in the
inputs.

I keep thinking the fix is to write more of it down, and I keep
discovering how much there is. Most of it only becomes visible at the
moment someone proposes removing it.

## Being accountable

The second limitation is not technical either. Someone has to be
answerable for a decision, and answerability is not a property you can
delegate to a process. When a change causes an incident, the question
that matters is not who typed it but who decided it was acceptable. That
person needs to have understood it well enough to defend it.

This puts a real ceiling on throughput that no model improvement
touches. I can generate more changes than I can be accountable for, and
the moment I accept a change I did not understand, I have quietly moved
from engineering to gambling.

## Taste about what not to build

The third one is the least discussed. Most of the value in engineering
work comes from deciding what not to build, and that decision requires
knowing things that are not in the request: what the company is actually
trying to do, which user complaints are noise, what will be politically
impossible in six months.

When I give an agent a task, it does the task. It does not tell me the
task should not exist. That is not a flaw in the agent, it is a
consequence of where it sits in the loop, and it means the person
writing the request carries more weight than before, not less.

## What I expect to change

I think the first limitation shrinks as more context gets written down,
and the tooling for that is improving quickly. The second does not
shrink, because it is a question about organisations rather than
software. The third might shrink, but only for people willing to give an
agent the kind of context they currently do not give their own
colleagues.

So the useful question is probably not what agents cannot do. It is
which of the things I currently do are actually about judgement, and
which ones I have just been in the habit of doing myself.
