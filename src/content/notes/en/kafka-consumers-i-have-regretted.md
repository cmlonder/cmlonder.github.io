---
title: 'Kafka consumers I have regretted'
description: 'A catalogue of my own mistakes, kept partly as penance and partly as a checklist.'
pubDate: 2026-02-24
updatedDate: 2026-07-28
status: evergreen
topics: [scale-and-performance, kafka, queues]
draft: false
placeholder: true
---

I keep this note as penance. I did all of these myself, some of them more
than once.

**I committed the offset before processing.** It looked faster and it was
faster, right up until a restart silently skipped unprocessed messages.
It took three days to notice the missing data, because nothing anywhere
reported an error. That is the worst class of bug: the kind that removes
things without making noise.

**I made the consumer non-idempotent, then added retries.** Two
reasonable decisions taken at different times, which together started
producing duplicate records. The general lesson I took from it is that
adding retries is not a resilience decision, it is a correctness
decision.

**I confused the partition key with the business key.** Ordering needed
to hold per customer, but I was partitioning by message id. When the
ordering broke, the symptom appeared three systems downstream rather
than anywhere near the queue.

**I put two unrelated jobs in one consumer group.** One got slow and
dragged the other down with it, and separating them later was painful
because the offset history was shared.

**I said we would add a dead letter queue later.** Later never arrived.
A single poison message kept the whole consumer looping for hours.

The common thread, I think, is that none of these came from
misunderstanding Kafka. They all came from not taking on the new
responsibilities a queue brings with it.
