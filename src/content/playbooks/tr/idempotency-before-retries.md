---
title: 'Retry''dan önce idempotency'
description: 'Idempotent olmayan bir endpoint''e retry eklemek, görünür bir hatayı görünmez bir hataya çevirir.'
pubDate: 2026-07-17
problem: 'Kararsız bir downstream hata üretiyor ve biri retry ekleyen bir PR açtı.'
context: 'Uçtan uca sahibi olmadığın servisler arası senkron HTTP veya RPC.'
symptoms:
- Bir downstream kararsız
- Retry eklendi, işler kötüleşti
- Mükerrer kayıtlar oluşuyor
tryFirst: 30
topics: [solution-architecture]
tags: [güvenilirlik, retry]
draft: false
placeholder: true
---

## Problem

Downstream bir servis ara ara hata veriyor ve biri retry ekleyen bir PR
açtı. Değişiklik üç satır, gerekçesi makul, ve gözden geçirmeden kolayca
geçiyor. Sorun şu ki retry, görünür bir hatayı görünmez bir hataya
çeviriyor: istek iki kez işlendiğinde artık alarm çalmıyor, sadece veri
yanlış oluyor.

## Bağlam

Uçtan uca sahibi olmadığın servisler arası senkron HTTP veya RPC
çağrıları. Karşı tarafın kodunu okuyamıyorsan veya deploy takvimini
bilmiyorsan bu kılavuz sana lazım.

## Yaklaşım

Önce şunu netleştiriyorum: bu çağrı tekrar edildiğinde ne oluyor? Cevap
"bilmiyorum" ise retry eklemek yasak, çünkü bilmediğin bir davranışı
çoğaltmış oluyorsun.

Sonra idempotency'yi çağıran tarafa değil, çağrılan tarafa koyuyorum.
Her isteğe istemcinin ürettiği bir anahtar ekleniyor ve sunucu o anahtarı
gördüğü işlemlerin kaydını tutuyor. Aynı anahtar ikinci kez geldiğinde
işlem tekrarlanmıyor, ilk sonucun kendisi dönüyor. Anahtarın ömrü,
retry penceresinden rahatça uzun olmalı; genelde birkaç gün tutuyorum.

Anahtarı istemcinin üretmesi önemli, çünkü sunucunun ürettiği bir
kimlik retry sırasında değişiyor ve hiçbir işe yaramıyor.

Ancak bu mekanizma yerinde olduktan sonra retry ekliyorum, üstelik
üstel geri çekilme ve sınırlı deneme sayısıyla.

## Ödünleşimler

Idempotency anahtarı tutmak bir depolama ve bir de arama maliyeti
getiriyor; yüksek hacimli uç noktalarda bu maliyet gerçek. Ayrıca
anahtar kaydının kendisi, asıl işlemle aynı işlemde yazılmazsa yeni
bir tutarsızlık kaynağı oluyor.

Bir de gecikme var: her istek artık bir kontrol daha yapıyor.

## Bu ne zaman işe yaramaz

Çağrı zaten doğası gereği idempotent ise gereksiz. Bir kaydın son
hâlini yazan bir güncelleme veya salt okuma çağrısı için bu mekanizmaya
ihtiyaç yok.

Yan etkisi dışarıda olan çağrılarda da yetmiyor. Bir e-posta gönderen
veya para çeken uç noktada idempotency anahtarı ikinci çağrıyı
engelliyor ama ilk çağrının gerçekten tamamlanıp tamamlanmadığını
söylemiyor; orada ayrıca bir mutabakat adımı gerekiyor.
