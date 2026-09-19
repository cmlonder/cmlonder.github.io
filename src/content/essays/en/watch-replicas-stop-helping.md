---
title: 'Watch read replicas stop helping'
description: 'Replicas fix read saturation and nothing else. Here is the exact point where adding another one stops paying for itself.'
pubDate: 2026-01-17
topics: [scale-and-performance, solution-architecture, postgres, database, capacity, interactive]
featured: true
draft: false
placeholder: false
---

Every team that outgrows a single database has the same argument, and it always
happens in the same order. Reads get slow. Someone adds a replica. It works.
Someone adds another. It works less. Then someone says the word *sharding* and
the next two quarters are spoken for.

The useful thing is not the opinion. It is being able to see the moment replicas
stop paying for themselves.

## One database, no replicas

Below is a single primary. Requests arrive from the left. Reads are blue, writes
are warm. Each node has three service slots and a short queue; anything arriving
at a full queue is dropped.

Start it, then push the request rate up until the queue backs up.

<c-replicas rps="18" read-pct="90" replicas="0" style="--ex-height: 150px" description="A single primary database serving a read-heavy workload with no replicas. Raising the request rate fills the queue and requests begin to drop.">
</c-replicas>

At 90% reads, this falls over for a boring reason: one node is doing all of the
work, and most of that work is reads.

## Add replicas

Now the same workload with replicas. Reads spread across them, writes still go
to the primary.

<c-replicas rps="30" read-pct="90" replicas="2" style="--ex-height: 210px" description="The same read-heavy workload with two read replicas. Reads distribute across replicas while writes stay on the primary, and the drop rate falls to near zero.">
</c-replicas>

This is the case everyone remembers, and it is why the advice *read replicas
before sharding* is usually right. Drops fall to nearly nothing. The primary is
no longer the thing that hurts.

## Now turn the writes up

Drag **Reads** down from 90% toward 50% and watch what happens. Add a third and
fourth replica while you are there — it will not save you.

<c-replicas rps="30" read-pct="50" replicas="3" style="--ex-height: 250px" description="A mixed read and write workload with three replicas. Each write occupies the primary and also arrives at every replica as replication work, so adding replicas no longer reduces drops.">
</c-replicas>

Two things are happening, and only one of them is obvious.

The obvious one: writes always go to the primary, so a write-heavy workload
concentrates on a single node no matter how many replicas exist.

The one people miss: **every write also lands on every replica.** That is the
grey traffic in the simulation. A replica is not a free read unit — it is a node
that must replay the entire write stream *and* serve reads on top of it. Adding
a replica adds read capacity and write load at the same time. Past a certain
write ratio, the second thing wins.

## What this means in practice

Read replicas are a fix for one specific bottleneck: read saturation on a
workload that is genuinely read-heavy. They are not a scaling strategy.

If you are looking at a saturating database, the order that has served me:

1. Measure the read/write split before proposing anything. If it is not above
   roughly 80% reads, replicas are not your answer.
2. If it is read-heavy, add replicas — it is by far the cheapest correct fix.
3. If it is not, look at write amplification, indexes, and whether two services
   are writing the same table, in that order.
4. Sharding is last, and it is a project, not a change.

The playbook version of this, with the tradeoffs written out, is in
[Read replicas before sharding](/playbooks/read-replicas-before-sharding).

> The simulation is deliberately crude: fixed service times, no network, no
> replication lag, no connection pool. It is here to make one relationship
> visible, not to predict your p99.
