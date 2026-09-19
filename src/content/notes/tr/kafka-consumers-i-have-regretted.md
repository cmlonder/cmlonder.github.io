---
title: 'Pişman olduğum Kafka consumer''ları'
description: 'Kendi hatalarımın kataloğu; yarısı kefaret, yarısı kontrol listesi.'
pubDate: 2026-02-24
updatedDate: 2026-07-28
status: evergreen
topics: [scale-and-performance]
tags: [kafka, queues]
draft: false
placeholder: true
---

Bu notu kendime kefaret olsun diye tutuyorum. Hepsini bizzat yaptım,
bazılarını birden fazla kez.

**Offset'i işlemden önce commit ettim.** Hızlı görünüyordu ve gerçekten
hızlıydı, ta ki bir yeniden başlatma sırasında işlenmemiş mesajları
sessizce atlayana kadar. Kayıp veriyi fark etmek üç gün sürdü, çünkü
hiçbir yerde hata görünmüyordu. En sinsi hata tipi bu: gürültü
çıkarmadan eksilten hata.

**Tüketiciyi idempotent yazmadım, sonra retry ekledim.** İkisi ayrı
zamanlarda alınmış iki makul karardı ve bir araya geldiklerinde
mükerrer kayıt üretmeye başladılar. Buradan çıkardığım genel ders şu:
retry eklemek bir dayanıklılık kararı değil, bir doğruluk kararı.

**Partition anahtarını iş anahtarıyla karıştırdım.** Sıralamanın
müşteri bazında korunması gerekiyordu ama ben mesaj kimliğine göre
dağıtmıştım. Sıralama bozulduğunda hata, kuyruğun kendisinde değil
üç sistem ötede ortaya çıktı.

**Tek bir tüketici grubuna iki ayrı işi yaptırdım.** Biri yavaşlayınca
diğeri de geride kaldı, ve ikisinin birbiriyle hiçbir ilgisi yoktu.
Ayırmak sonradan zor oldu, çünkü offset geçmişi ortaktı.

**Ölü mektup kutusunu sonra ekleriz dedim.** Sonra hiç gelmedi.
Zehirli tek bir mesaj, bütün tüketiciyi saatlerce döngüde tuttu.

Ortak nokta şu galiba: hataların hiçbiri Kafka'yı yanlış anlamaktan
çıkmadı. Hepsi, bir kuyruğun getirdiği yeni sorumlulukları
üstlenmemekten çıktı.
