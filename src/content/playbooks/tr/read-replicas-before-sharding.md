---
title: 'Sharding''den önce read replica'
description: 'Darboğaz okuma yüküyse en ucuz doğru cevap neredeyse hiçbir zaman sharding değildir.'
pubDate: 2026-02-19
problem: 'Veritabanı doyuyor ve ekip bir sharding projesi öneriyor.'
context: 'Tek bölgeli OLTP Postgres/MySQL, ~2 TB altı, okuma ağırlıklı (>%80 okuma).'
symptoms:
- Veritabanı CPU'su dibe vurmuş
- Okumalar yavaş, yazmalar normal
- Biri sharding önerdi
- Trafik artmadan sorgu gecikmesi yükseldi
tryFirst: 10
topics: [scale-and-performance, solution-architecture]
tags: [postgres, veritabanı, kapasite]
draft: false
placeholder: true
---

## Problem

Veritabanı yavaşladı ve masada "sharding'e geçelim" önerisi var. Öneri
genelde doğru teşhisle değil, ölçek kelimesinin çağrışımıyla geliyor.

## Bağlam

Tek bir ilişkisel veritabanı örneği, büyüyen bir ürün, ve henüz
bölünmemiş bir şema. Genelde Postgres veya MySQL.

## Yaklaşım

Önce yükün hangi tarafta olduğunu ölçüyorum. Bu adımı atlamak,
sonrasındaki her kararı tahmine dayandırıyor. Okuma ve yazma oranına,
en pahalı sorgulara ve bekleme olaylarına bakıyorum.

Yük okuma tarafındaysa sıra şöyle ilerliyor. En başta indeksler ve
sorgu planları geliyor; tek bir eksik indeksin yarattığı yükü sharding
ile çözmeye çalışmak, aylar sürecek bir işi bir öğleden sonralık bir
işin yerine koymak demek. Sonra raporlama ve analitik sorgularını
okuma replikasına taşıyorum, çünkü bunlar genelde en pahalı ve en az
tazelik gerektiren sorgular. Ardından liste ve arama ekranlarını
replikaya alıyorum; burada replikasyon gecikmesini kabul edip
kullanıcıya birkaç saniyelik eskimeyi göstermek çoğu ürün için sorun
olmuyor. En son da bağlantı havuzuna bakıyorum, çünkü uygulama örneği
sayısı arttıkça asıl tükenen kaynak genelde bağlantı oluyor.

Yük yazma tarafındaysa replika işe yaramıyor. Orada sırayla toplu
yazma, gereksiz güncellemelerin ayıklanması ve tabloların bölümlenmesi
geliyor. Sharding bu listenin en sonunda duruyor.

## Ödünleşimler

Okuma replikası, uygulamaya bir doğruluk sorusu getiriyor: hangi
sorgu bayat veriyi kaldırabilir? Bu sorunun cevabı kod tabanına
dağılıyor ve zamanla bakımı zorlaşıyor. Yazıdan hemen sonra okuyan
akışlar replikaya gönderildiğinde kullanıcı kendi yazdığını
göremiyor, ki bu en sık karşılaşılan hata.

## Bu ne zaman işe yaramaz

Tek bir kiracı veya tek bir tablo, tek makineye sığmayacak kadar
büyükse replika bir şey çözmüyor. Aynı şekilde yazma hacmi tek örneğin
disk veya WAL kapasitesini aşıyorsa, doğru cevap gerçekten bölmek
oluyor.

Bir de düzenleyici sebeplerle verinin coğrafi olarak ayrılması
gerekiyorsa, bu bir performans kararı değil ve sıra burada geçerli
değil.
