---
title: 'Tool eklemeden önce context bütçesi'
description: 'Her tool tanımı her turda token yiyor. Ajan yavaşlamalarının çoğu model sorunu değil, context sorunu.'
pubDate: 2026-08-23
problem: 'Bir ajan yavaş, pahalı ya da görevin ortasında dağılıyor.'
context: 'Tanım listesinde birkaç taneden fazla tool olan her ajan.'
symptoms:
- Bir ajan yavaş ya da pahalı
- Ajan görev ortasında dağılıyor
- Bir şey yavaş ve kimse nedenini bilmiyor
tryFirst: 10
topics: [agentic-development]
tags: [context-engineering, tools]
draft: false
placeholder: true
---

## Problem

Ajan yavaşladı veya isabetsizleşti, ve ilk refleks yeni bir tool
eklemek oluyor. Halbuki her tool tanımı her turda context penceresinde
yer kaplıyor, yani eklediğin şey aynı zamanda bir şeyin payını
düşürüyor.

## Bağlam

Araç kullanan bir ajan kurulumu; genelde on üzeri tool ve büyüyen bir
sistem talimatı.

## Yaklaşım

Önce mevcut bütçeyi ölçüyorum. Tool tanımları, sistem talimatı ve
otomatik eklenen bağlam dosyaları ne kadar token tutuyor, bunu bilmeden
karar vermiyorum. Çoğu kurulumda bu sayı tahminden belirgin şekilde
büyük çıkıyor.

Sonra kullanım sayımına bakıyorum: son yüz çalıştırmada hangi tool kaç
kez çağrıldı? Neredeyse her kurulumda hiç çağrılmayan veya bir kez
çağrılmış toollar oluyor. Onları çıkarmak, yeni bir tane eklemekten
daha çok fayda sağlıyor.

Ardından tanımları kısaltıyorum. Uzun açıklamalar ve bol parametreli
şemalar, aynı işi yapan kısa bir tanımın birkaç katı yer tutuyor.
Parametre sayısını azaltmak hem bütçeyi hem de yanlış çağrı oranını
düşürüyor.

Son olarak toolları göreve göre gruplayıp hepsini her zaman yüklemeyi
bırakıyorum. Ancak bu üç adımdan sonra yeni tool eklemeyi
değerlendiriyorum.

## Ödünleşimler

Tool çıkarmak, o yeteneğin gerçekten gerektiği nadir durumlarda ajanı
çaresiz bırakıyor ve bunu fark etmek zaman alıyor. Göreve göre
yükleme ise kurulum karmaşıklığı getiriyor: hangi görevin hangi
paketi alacağına karar vermek yeni bir bakım işi.

Kısaltılmış tanımlar da belirsizleşebiliyor; fazla kısaltınca çağrı
hataları artıyor ve kazandığın bütçeyi tekrar denemelerde
kaybediyorsun.

## Bu ne zaman işe yaramaz

Sorun gerçekten yetenek eksikliğiyse bütçe düzenlemesi çözmüyor. Ajan
yapamadığı bir şeyi yapmaya çalışıyorsa, eksik olan token değil araç.

Pencerenin yarısından azını kullanan küçük kurulumlarda da bu
kılavuzun getirisi yok; orada zaten sıkışma yaşanmıyor.
