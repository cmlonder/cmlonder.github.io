---
title: 'Gecikme süresi (p99) salt bir metrik değil, bir ekip sınırıdır'
description: 'Bir servisin p99 gecikme hedefini kim sahipleniyorsa, kriz anında nöbet telefonu da onun masasında çalar.'
pubDate: 2026-06-19
status: budding
topics: [scale-and-performance, slo, oncall]
draft: false
placeholder: true
---

Sistem gecikmelerini (p99) uzun yıllar boyunca yalnızca bir performans metriği olarak gördüm. Panolarda dalgalanan bir çizgi, SLO hedefinin altında tutulması gereken matematiksel bir veri. Ancak zamanla asıl işlevinin teknik değil organizasyonel olduğunu fark ettim: p99, gecenin bir yarısı nöbet telefonunun kimin evinde çalacağını belirleyen sınırdır.

Bu mantığın işleyişi oldukça yalındır. Bir uç noktanın yanıt süresinden siz sorumluysanız, o servis yavaşladığında yataktan kalkacak kişi de sizsiniz demektir. Bu durum sizi doğal olarak o yavaşlığa sebep olabilecek tüm bileşenlerin de fiili sahibi haline getirir: Alttaki SQL sorgusu, arka planda çağırdığınız harici servis ve aradaki mesaj kuyruğu. Dolayısıyla bir metriğin sorumluluğunu almak, ilk bakışta görünenden çok daha geniş bir etki alanını sahiplenmeyi gerektirir.

Bunun pratik yansıması şudur: Ekipler arasında p99 hedefi belirlemek, aslında kurumun organizasyon şemasını çizmekle eşdeğerdir. "Biz bu servis için 200 milisaniye taahhüt ediyoruz" demek, o taahhüdü yerine getirmek için gereken tüm bağımlılıklar üzerinde doğrudan söz hakkı talep etmek anlamına gelir. Bu yetki ve söz hakkı verilmeden sıkı hedefler üstlenen ekipler sürekli tükenir, çünkü kontrol edemedikleri faktörlerin faturası kendilerine kesilir.

Bu yüzden artık bir servis seviyesi hedefi tartışılırken ilk sorduğum soru hedefin kaç milisaniye olacağı değil, bu hedefi yakalamak için gereken değişikliklerde kimin nihai karar verici olacağıdır. Bu soruya net bir yanıt verilemiyorsa masada konuşulan şey bir mühendislik hedefi değil, sadece iyi niyetli bir temennidir.

Bu konuda zihnimde henüz netleşmeyen senaryo ise birden fazla ekibin ortaklaşa sahip olduğu karmaşık uç noktalarda bu sınırların nasıl adil paylaştırılacağıdır.

