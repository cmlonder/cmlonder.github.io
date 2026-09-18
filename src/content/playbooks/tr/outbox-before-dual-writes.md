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

Bir işlem hem veritabanına yazmalı hem de bir mesaj yayınlamalı. En
kolay yol ikisini arka arkaya yapmak, ama ikisi arasında süreç ölürse
sistem tutarsız kalıyor: kayıt var, mesaj yok. Ya da tersi.

## Bağlam

İlişkisel bir veritabanı ve yanında bir mesaj altyapısı. Genelde
Postgres ve Kafka.

## Yaklaşım

Tek bir yere yazıyorum. İş verisiyle birlikte, aynı veritabanı
işleminde bir `outbox` tablosuna da yayınlanacak mesajı ekliyorum.
İşlem ya ikisini birden yazıyor ya da hiçbirini; arada bir durum
kalmıyor.

Sonra ayrı bir okuyucu bu tabloyu takip edip mesajları asıl kuyruğa
taşıyor. Bu okuyucu en az bir kez teslim garantisiyle çalışıyor, yani
aynı mesajı tekrar gönderebiliyor. Bu yüzden tüketici tarafının
idempotent olması şart, ve bunu ayrı bir kılavuz olarak yazdım.

Okuyucu tarafında iki seçenek var. Basit olanı tabloyu düzenli aralıkla
sorgulamak; gecikme birkaç yüz milisaniye oluyor ve çoğu iş için
yetiyor. Daha düşük gecikme gerekiyorsa veritabanının değişiklik
akışını dinleyen bir yakalama mekanizması kuruluyor, ama bu ciddi bir
işletme yükü getiriyor.

Taşınan satırları hemen silmiyorum, işaretleyip bir süre tutuyorum.
Bir sorun olduğunda neyin gönderildiğini görebilmek, kazanılan disk
alanından daha değerli.

## Ödünleşimler

Outbox tablosu, asıl işlemin yazma maliyetini artırıyor ve yoğun
akışlarda kendisi bir darboğaz hâline gelebiliyor. Temizlik işi de
ihmal edilirse tablo sessizce büyüyor.

Bir de sıralama meselesi var: tek bir okuyucu sırayı koruyor ama
ölçeklenmiyor; paralel okuyucu ölçekleniyor ama sırayı ancak anahtar
bazında koruyabiliyor.

## Bu ne zaman işe yaramaz

Mesajın veritabanı işlemiyle atomik olması gerekmiyorsa gereksiz
karmaşıklık. Bildirim gibi kaybı tolere edilebilen akışlarda doğrudan
yayınlamak yeterli.

Veritabanı ve kuyruk aynı işlemi paylaşabiliyorsa da gerek yok, ama
pratikte bu neredeyse hiç mümkün olmuyor.
