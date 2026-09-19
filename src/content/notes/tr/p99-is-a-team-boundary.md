---
title: 'p99 bir metrik değil, bir ekip sınırı'
description: 'p99''un sahibi kim ise nöbet telefonunun sahibi de o. Gerisi bundan türüyor.'
pubDate: 2026-06-19
status: budding
topics: [scale-and-performance, slo, oncall]
draft: false
placeholder: true
---

p99'u yıllarca bir performans metriği olarak gördüm. Grafikte bir çizgi,
hedefin altında kalması gereken bir sayı. Sonra fark ettim ki asıl işlevi
teknik değil: p99, nöbet telefonunun kimde çalacağını belirleyen sınır.

Mantık şöyle işliyor. Bir uç noktanın p99'u sana aitse, o uç nokta
yavaşladığında uyanan sensin. Bu da seni doğal olarak o yavaşlığın
sebebi olabilecek her şeyin sahibi yapıyor: altındaki sorgu, çağırdığın
downstream servis, kullandığın kuyruk. Yani p99 sahipliği, göründüğünden
çok daha geniş bir sorumluluk alanı çiziyor.

Bunun pratik sonucu şu: p99 hedefini pazarlıkla belirlemek, aslında
organizasyon şeması çizmek. "Biz 200 milisaniye taahhüt ediyoruz"
demek, o taahhüdü tutturmak için gereken her şeyin üzerinde söz hakkı
istemek anlamına geliyor. Söz hakkı olmadan taahhüt veren ekipler
sürekli yanıyor, çünkü kendi kontrol etmedikleri bir sayıdan sorumlu
tutuluyorlar.

O yüzden artık bir SLO tartışmasına girdiğimde ilk sorduğum şey hedefin
kaç olacağı değil, bu hedefi tutturmak için nelerin değişmesi
gerektiğinde kimin evet diyebileceği. Cevap "kimse" ise, konuştuğumuz
şey bir hedef değil, bir temenni.

Not olarak eksik kalan kısım: birden fazla ekibin ortak sahip olduğu
uç noktalarda bu nasıl işliyor, henüz iyi bir cevabım yok.
