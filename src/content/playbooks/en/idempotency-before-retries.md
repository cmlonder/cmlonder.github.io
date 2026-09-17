---
title: 'Idempotency before retries'
description: 'Adding retries to a non-idempotent endpoint converts a visible failure into an invisible one.'
pubDate: 2026-07-17
problem: 'A flaky downstream is causing errors and someone has opened a PR adding retry logic.'
context: 'Synchronous HTTP or RPC between services you do not own end to end.'
symptoms:
- A downstream is flaky
- Retries were added and things got worse
- Duplicate records are appearing
tryFirst: 30
topics: [solution-architecture]
tags: [reliability, retries]
draft: false
placeholder: true
---

## Problem

## Context

## Approach

## Tradeoffs

## When this stops working
