---
title: 'Measure before caching'
description: 'A cache added without a measurement is a correctness risk you took for an unknown gain.'
pubDate: 2026-06-10
problem: 'Something is slow and the proposed fix is to put Redis in front of it.'
context: 'Read paths where staleness has a real cost and the access pattern is not yet known.'
topics: [scale-and-performance, cache, redis]
draft: false
placeholder: true
---

## Problem

Something is slow and the proposed fix is to put Redis in front of it. A
cache added without a measurement is a correctness risk taken in exchange
for an unknown gain.

## Context

Read paths where staleness has a real cost and the access pattern is not
yet understood.

## Approach

Find out where the time actually goes before deciding anything. In most
"we need a cache" situations the latency turns out to be concentrated in
one query with a bad plan, and fixing that removes the problem without
adding a second source of truth.

If the time really is in repeated identical reads, measure the hit rate
you would get before building it. Sample the actual request stream and
count how many reads would have been served from cache. A cache with a
forty percent hit rate is usually not worth its invalidation cost.

Then decide the staleness contract explicitly and write it down. How old
can this data be before someone is harmed? If nobody can answer, you do
not yet know enough to cache it.

Only then choose where the cache lives. In-process is cheapest and
simplest but multiplies stale copies by instance count. A shared cache
has one truth but adds a network hop and a new dependency in the
critical path.

## Tradeoffs

Every cache introduces a second place the truth can live and a new
failure mode when the two disagree. Invalidation logic tends to spread
across the codebase over time, and the bugs it produces are intermittent
and hard to reproduce.

There is also a capacity trap: a cache that works well enough hides the
underlying problem until the day it is cold, and a cold start then takes
the system down at exactly the worst moment.

## When this does not work

For data that must always be current, such as balances or inventory
counts, caching the read is the wrong layer; the fix belongs in how that
data is computed.

If write volume is the bottleneck, a read cache does nothing at all.
