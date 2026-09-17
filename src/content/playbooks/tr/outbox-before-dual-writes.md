---
title: 'Çift yazımdan önce outbox'
description: 'Bir yazım iki yere düşecekse tek yere yaz, oradan bir okuyucu dağıtsın.'
pubDate: 2026-03-28
problem: 'Bir servis hem veritabanını güncelleyip hem olay yayınlamalı, bazen sadece biri oluyor.'
context: 'İşlemsel deposu ve mesaj broker''ı olan her servis. Özellikle Kafka.'
symptoms:
- Olaylar downstream'e ulaşmıyor
- Veritabanı ile broker uyuşmuyor
- Yazma başarılı ama olay gelmedi
tryFirst: 30
topics: [solution-architecture, scale-and-performance]
tags: [kafka, tutarlılık, outbox]
draft: false
placeholder: true
---

## Problem

## Bağlam

## Yaklaşım

## Tradeoff'lar

## Bu ne zaman işe yaramaz
