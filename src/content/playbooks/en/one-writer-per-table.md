---
title: 'One writer per table'
description: 'The cheapest way to keep a shared database from becoming a distributed monolith.'
pubDate: 2026-05-04
problem: 'Two or more services write to the same table and schema changes have become terrifying.'
context: 'Shared-database architectures mid-migration toward services.'
symptoms:
- Schema changes are terrifying
- Two services write the same table
- Database and message broker disagree
tryFirst: 40
topics: [solution-architecture]
tags: [database, boundaries]
draft: false
placeholder: true
---

## Problem

Two or more services write to the same table, and schema changes have
become terrifying. Nobody can say with confidence what a column change
will break, so the schema stops evolving and workarounds accumulate
around it.

## Context

Shared-database architectures partway through a migration toward
services.

## Approach

Pick one owner per table and make every other writer go through it. The
owner is the service whose domain the data belongs to; if that is not
obvious, the owner is whoever gets paged when the data is wrong.

Do the reads last. Letting other services keep reading the table
directly while writes are consolidated is a perfectly good intermediate
state, and it is much cheaper than moving everything at once. Writes are
where the correctness problems are.

For each foreign writer, replace the direct write with a call to the
owner. Take the opportunity to make that call idempotent while you are
there, because you will want retries and you do not want to come back.

Once writes are consolidated, the schema becomes changeable again, and
that is the point of the exercise. Moving readers behind an API can then
happen gradually, table by table, driven by whichever change is
currently painful.

## Tradeoffs

Consolidating writes adds a network hop and a latency cost to paths that
used to be a local insert. It also makes the owning service a new
availability dependency for everyone who writes through it.

There is an organisational cost too: the owning team now receives change
requests from other teams and needs the capacity to serve them, or it
becomes the bottleneck everyone routes around.

## When this does not work

If the table is genuinely shared infrastructure with no domain owner,
such as an audit log that everyone appends to, forcing an owner creates
a chokepoint without a benefit.

It also does not help when the real problem is that the table is
modelling two different things. In that case the fix is to split the
table first, and ownership follows naturally.
