---
title: 'Sonradan pişman olduğum Kafka tüketici kararları'
description: 'Kendi yaptığım mimari hataların samimi bir dökümü — hem bir yüzleşme hem de geleceğe yönelik bir kontrol listesi.'
pubDate: 2026-02-24
updatedDate: 2026-07-28
status: evergreen
topics: [scale-and-performance, kafka, queues]
draft: false
placeholder: true
---

Bu notu kendi adıma bir kontrol listesi ve mesleki bir yüzleşme olarak tutuyorum. Aşağıdaki hataların hepsini bizzat yaşadım, hatta bazılarını birden fazla projede tekrarladım.

**Mesajı işlemeden önce ofseti kaydettim.** Kağıt üzerinde çok hızlı görünüyordu ve gerçekten de öyleydi, ta ki bir yeniden başlatma sırasında henüz tamamlanmamış onlarca mesaj sessizce atlanana kadar. Kayıp veriyi fark etmemiz üç tam gün sürdü, çünkü loglarda en ufak bir hata görünmüyordu. Yazılımdaki en sinsi problemler de zaten bunlardır: Arkasında hiçbir gürültü çıkarmadan veriyi eksilten hatalar.

**Tüketiciyi aynı işlem güvencesine almadan yeniden deneme mekanizması ekledim.** Farklı zamanlarda alınmış iki son derece masum karardı. Ancak bir araya geldiklerinde ağdaki ilk aralıkta mükerrer kayıtlar üretmeye başladılar. Bu tecrübeden çıkardığım ders nettir: Bir akışa yeniden deneme eklemek salt bir dayanıklılık tercihi değil, doğrudan veri doğruluğu kararıdır.

**Bölümleme (partition) anahtarı ile iş mantığı anahtarını birbirine karıştırdım.** Mesaj sıralamasının müşteri bazında garanti edilmesi gerekiyordu fakat ben yükü eşit dağıtmak için rastgele bir mesaj kimliği seçmiştim. Sıralama bozulduğunda çıkan faturanın bedeli kuyrukta değil, üç servis ötedeki muhasebe veritabanında patladı.

**Tek bir tüketici grubuna iki farklı iş yaptırdım.** Süreçlerden biri yavaşlayıp tıkanınca tamamen bağımsız olan diğer iş de geride kalmaya başladı. Aralarındaki bağı sonradan koparmak çok sancılı oldu çünkü geçmiş ofset kayıtları tek bir kümede birbirine dolanmıştı.

**Hata kuyruğunu (dead letter queue) sonra kurarız dedim.** O "sonra" hiçbir zaman gelmedi. Formatı bozuk tek bir zehirli mesaj, bütün tüketici havuzunu saatlerce anlamsız bir döngüde kilitledi.

Geriye dönüp baktığımda gördüğüm ortak ders şu: Bu hataların hiçbiri Kafka teknolojisini yanlış anlamaktan çıkmadı. Hepsi, bir mesaj kuyruğunun sisteme getirdiği yeni sorumlulukları zamanında üstlenmemekten kaynaklandı.

