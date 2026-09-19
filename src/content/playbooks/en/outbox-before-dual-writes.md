---
title: 'Outbox before dual writes'
description: 'If a write has to land in two places, put it in one place and let a reader fan it out.'
pubDate: 2026-03-28
problem: 'A service must update its database and publish an event, and sometimes only one happens.'
context: 'Any service with a transactional store and a message broker. Especially Kafka.'
topics: [solution-architecture, scale-and-performance, kafka, consistency, outbox]
draft: false
placeholder: true
---

## Problem

An operation needs to write to the database and publish a message. The
easy path is to do both in sequence, but if the process dies between
them the system is left inconsistent: the record exists and the message
does not, or the other way around.

## Context

A relational database alongside a messaging system. Usually Postgres and
Kafka.

## Approach

Write to one place. In the same database transaction as the business
data, insert the message to be published into an `outbox` table. The
transaction either writes both or neither, and there is no state in
between.

A separate reader then follows that table and moves messages to the real
queue. That reader operates with at-least-once delivery, meaning it can
send the same message twice. This is why the consumer side has to be
idempotent, which I wrote up as its own playbook.

There are two options on the reader side. The simple one polls the table
on an interval; latency lands in the hundreds of milliseconds and that
is fine for most work. If you need lower latency, you set up something
that follows the database's change stream, but that carries a real
operational burden.

Do not delete moved rows immediately; mark them and keep them for a
while. Being able to see what was sent when something goes wrong is
worth more than the disk space.

## Tradeoffs

The outbox table adds write cost to the main transaction and can itself
become a bottleneck on busy paths. If cleanup is neglected, the table
grows quietly.

There is also ordering: a single reader preserves order but does not
scale, while parallel readers scale but can only preserve order per key.

## When this does not work

If the message does not need to be atomic with the database
transaction, this is unnecessary complexity. For flows like
notifications where loss is tolerable, publishing directly is enough.

It is also unnecessary if the database and the queue can share a
transaction, though in practice that is almost never available.
