---
title: 'Read replicas before sharding'
description: 'When read load is the bottleneck, the cheapest correct answer is almost never sharding.'
pubDate: 2026-02-19
problem: 'Database is saturating and the team is proposing a sharding project.'
context: 'Single-region OLTP Postgres/MySQL, under ~2 TB, read-heavy (>80% reads).'
symptoms:
- Database CPU is pinned
- Reads are slow, writes are fine
- Someone proposed sharding
- Query latency rose without a traffic spike
tryFirst: 10
topics: [scale-and-performance, solution-architecture]
tags: [postgres, database, capacity]
draft: false
placeholder: true
---

## Problem

The database got slow and there is a proposal on the table to shard. The
proposal usually arrives on the strength of the word "scale" rather than
on a diagnosis.

## Context

A single relational instance, a growing product, and a schema that has
not been split. Usually Postgres or MySQL.

## Approach

Start by measuring which side the load is on. Skipping this makes every
subsequent decision a guess. Look at the read-to-write ratio, the most
expensive queries, and the wait events.

If the load is on reads, the order goes like this. Indexes and query
plans come first; trying to solve the load created by one missing index
with sharding replaces an afternoon of work with months of it. Then move
reporting and analytics queries to a read replica, since those are
usually the most expensive and the least sensitive to freshness. Then
move list and search screens, accepting replication lag and showing users
data that is a few seconds old, which for most products is fine. Last,
look at the connection pool, because as application instances multiply
the resource that actually runs out is usually connections.

If the load is on writes, replicas do not help. There the order is batch
writes, eliminating no-op updates, and partitioning tables. Sharding
comes at the end of that list.

## Tradeoffs

A read replica introduces a correctness question into the application:
which queries can tolerate stale data? The answer spreads across the
codebase and gets harder to maintain over time. The most common mistake
is routing a read-after-write flow to a replica, so users cannot see what
they just wrote.

## When this does not work

If a single tenant or a single table is too large for one machine, a
replica solves nothing. Likewise if write volume exceeds one instance's
disk or WAL capacity, splitting really is the answer.

And if data must be separated geographically for regulatory reasons, that
is not a performance decision and this ordering does not apply.
