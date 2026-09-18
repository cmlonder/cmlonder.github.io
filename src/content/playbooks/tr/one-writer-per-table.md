---
title: 'Tablo başına tek yazıcı'
description: 'Paylaşımlı bir veritabanının dağıtık monolite dönüşmesini engellemenin en ucuz yolu.'
pubDate: 2026-05-04
problem: 'İki ya da daha fazla servis aynı tabloya yazıyor ve şema değişiklikleri korkutucu hale geldi.'
context: 'Servislere geçiş sürecinin ortasındaki paylaşımlı veritabanı mimarileri.'
symptoms:
- Şema değişiklikleri korkutucu
- İki servis aynı tabloya yazıyor
- Veritabanı ile broker uyuşmuyor
tryFirst: 40
topics: [solution-architecture]
tags: [database, boundaries]
draft: false
placeholder: true
---

## Problem

İki ya da daha fazla servis aynı tabloya yazıyor ve şema değişiklikleri
korkutucu hale geldi. Bir kolon değişikliğinin neyi bozacağını kimse
güvenle söyleyemiyor, bu yüzden şema evrimi duruyor ve etrafında geçici
çözümler birikiyor.

## Bağlam

Servislere geçişin yarısında kalmış paylaşımlı veritabanı mimarileri.

## Yaklaşım

Her tabloya tek bir sahip seç ve diğer bütün yazıcıları onun üzerinden
geçir. Sahip, verinin alanına ait olduğu servis; bu açık değilse sahip,
veri yanlış olduğunda nöbet telefonu çalan kişi.

Okumaları en sona bırak. Yazmalar birleştirilirken diğer servislerin
tabloyu doğrudan okumaya devam etmesi gayet iyi bir ara durum ve her şeyi
aynı anda taşımaktan çok daha ucuz. Doğruluk problemleri yazma tarafında.

Her yabancı yazıcı için doğrudan yazmayı sahibe yapılan bir çağrıyla
değiştir. Hazır oradayken o çağrıyı idempotent yap, çünkü retry isteyeceksin
ve buraya bir daha dönmek istemiyorsun.

Yazmalar tek elde toplandığında şema yeniden değiştirilebilir hale geliyor;
alıştırmanın amacı da bu. Okuyucuları bir API'nin arkasına taşımak sonra
kademeli olarak, o an hangi değişiklik acı veriyorsa ona göre yapılabilir.

## Ödünleşimler

Yazmaları tek elde toplamak, eskiden yerel bir insert olan yollara bir ağ
atlaması ve gecikme maliyeti ekliyor. Ayrıca sahip servisi, üzerinden yazan
herkes için yeni bir erişilebilirlik bağımlılığı haline getiriyor.

Organizasyonel bir maliyeti de var: sahip ekip artık diğer ekiplerden
değişiklik talebi alıyor ve bunları karşılayacak kapasitesi olması
gerekiyor, yoksa herkesin etrafından dolaştığı darboğaz oluyor.

## Bu ne zaman işe yaramaz

Tablo gerçekten alan sahibi olmayan paylaşımlı bir altyapıysa — herkesin
eklediği bir denetim günlüğü gibi — zorla sahip atamak fayda getirmeden bir
boğaz oluşturuyor.

Asıl problem tablonun iki farklı şeyi modelliyor olmasıysa da çözmüyor. O
durumda önce tabloyu bölmek gerekiyor, sahiplik zaten arkasından geliyor.
