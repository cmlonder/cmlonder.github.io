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

## Context

## Approach

## Tradeoffs

## When this stops working
