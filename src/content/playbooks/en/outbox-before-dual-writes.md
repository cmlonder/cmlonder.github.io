---
title: 'Outbox before dual writes'
description: 'If a write has to land in two places, put it in one place and let a reader fan it out.'
pubDate: 2026-03-28
problem: 'A service must update its database and publish an event, and sometimes only one happens.'
context: 'Any service with a transactional store and a message broker. Especially Kafka.'
symptoms:
- Events are missing downstream
- Database and message broker disagree
- A write succeeded but no event arrived
tryFirst: 30
topics: [solution-architecture, scale-and-performance]
tags: [kafka, consistency, outbox]
draft: false
placeholder: true
---

## Problem

## Context

## Approach

## Tradeoffs

## When this stops working
