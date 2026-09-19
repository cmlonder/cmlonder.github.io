---
title: 'I stopped drawing sequence diagrams first'
description: 'Trying to articulate why starting with the failure modes produces a better design than starting with the happy path.'
pubDate: 2026-08-17
status: seedling
topics: [solution-architecture, design, diagrams]
draft: false
placeholder: true
---

I used to start a design by drawing the happy path. Boxes, arrows, the
request going through in order. It felt productive and it produced
something I could show in a meeting, which is probably why the habit
lasted as long as it did.

The problem is that the happy path is the part nobody argues about. It
is also the part that takes the least time to build. Drawing it first
front-loads the easy agreement and defers every question that actually
determines the design.

What I do now is start from the failure list. What happens if this call
times out. What happens if it succeeds but the response is lost. What
happens if it runs twice. What happens if the downstream is up but
returning stale data. The interesting thing is that answering those four
questions usually produces the diagram for free, and the diagram it
produces is not the one I would have drawn.

There is a social benefit too. A happy path diagram invites nodding. A
failure list invites the one senior person in the room to say "that
third case has bitten us before," which is the single most valuable
sentence in any design review.

What I have not worked out is how to do this without it becoming
paralysing. There is always another failure mode, and some of them are
not worth designing for. Right now I stop when the remaining cases are
ones I would accept an incident for, but I cannot defend that as a rule.
