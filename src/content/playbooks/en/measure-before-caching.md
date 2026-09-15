---
title: 'Measure before caching'
description: 'A cache added without a measurement is a correctness risk you took for an unknown gain.'
pubDate: 2026-09-15
problem: 'Something is slow and the proposed fix is to put Redis in front of it.'
context: 'Read paths where staleness has a real cost and the access pattern is not yet known.'
symptoms:
- Something is slow and nobody knows why
- A cache was proposed as the fix
- Reads are slow, writes are fine
tryFirst: 20
topics: [scale-and-performance]
tags: [cache, redis]
draft: false
placeholder: true
---

## Problem

## Context

## Approach

## Tradeoffs

## When this stops working
