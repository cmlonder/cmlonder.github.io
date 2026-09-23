---
title: 'Çift yazma yerine outbox deseni'
description: 'Verinin aynı anda iki farklı sisteme yazılması gerekiyorsa önce tek bir işleme yazın, kuyruğa dağıtımı arka planda çalışan bir okuyucu üstlensin.'
pubDate: 2026-03-28
problem: 'Bir servis hem veritabanını güncelleyip hem de olay kuyruğuna mesaj bırakmak zorunda, ancak süreçler sık sık yarıda kalıyor.'
context: 'İlişkisel veritabanı ile mesaj kuyruğunu birlikte kullanan tüm dağıtık servis mimarileri.'
topics: [solution-architecture, scale-and-performance, kafka, consistency, outbox]
draft: false
placeholder: true
---

## Problem

Bir iş sürecinin hem veritabanına kayıt atması hem de harici bir mesaj kuyruğuna olay fırlatması gerektiğinde akla gelen en kolay yol bu iki işlemi peş peşe çağırmaktır. Ancak tam iki adım arasında sunucu çöker veya ağ koparsa sistem tutarsızlığa gömülür: Kayıt veritabanına girmiş ama mesaj hiç iletilmemiştir ya da tam tersi yaşanmıştır.

## Bağlam

Postgres gibi ilişkisel bir veritabanı ile Kafka veya RabbitMQ gibi bir mesaj altyapısının bir arada çalıştığı tüm senkron servisler.

## Yaklaşım

Çözüm için tüm akışı tek bir veritabanı işleminde topluyorum. Asıl iş verisini güncellerken, aynı işlem sınırları içinde fırlatılacak mesajı da bir `outbox` tablosuna satır olarak ekliyorum. Veritabanının atomik güvencesi sayesinde ya iki kayıt birden yazılıyor ya da ikisi birden iptal ediliyor, arada gri bir bölge kalmıyor.

Ardından bağımsız bir arka plan süreci bu outbox tablosunu dinleyerek bekleyen kayıtları asıl mesaj kuyruğuna güvenle aktarıyor. Bu aktarıcı süreç en az bir kez teslim garantisiyle çalışır. Bu da olası bir kesinti anında aynı mesajın kuyruğa mükerrer düşebileceği anlamına gelir. Bu nedenle mesajı alan tüketici servislerin mutlaka aynı işlem güvencesine sahip olması gerekir.

Mesaj aktarımında iki temel yol izlenebilir. En yalın yaklaşım tabloyu belirli aralıklarla sorgulamaktır, birkaç yüz milisaniyelik gecikme çoğu sistem için fazlasıyla kabul edilebilirdir. Eğer sıfıra yakın gecikme isteniyorsa veritabanının hareket günlüğünü (CDC) dinleyen araçlar devreye sokulabilir fakat bu tercih beraberinde ciddi bir operasyonel yönetim yükü getirir.

İletilen mesajları tablodan anında silmek yerine iletildi olarak işaretleyip belirli bir süre arşivde tutuyorum. Bir aksaklık yaşandığında nelerin kuyruğa verildiğini geriye dönük izleyebilmek, kazanılacak birkaç megabaytlık disk alanından çok daha kıymetlidir.

## Ödünleşimler

Outbox tablosu asıl işlemin yazma yükünü artırır ve yüksek trafik altında kendisi başlı başına bir veritabanı darboğazına dönüşebilir. Eski kayıtların temizliği düzenli bir otomasyona bağlanmazsa tablo zamanla şişer.

Ayrıca mesaj sırasının korunması dikkat gerektirir: Tek bir aktarıcı süreç sırayı kusursuz korur ancak ölçeklenemez. Paralel aktarıcılar ise ölçeklenir fakat sıra garantisini ancak belirli anahtarlar bazında verebilir.

## Bu ne zaman işe yaramaz

Fırlatılan mesajın veritabanı kaydıyla birebir tutarlı olması gerekmiyorsa bu desen fazladan karmaşıklık yaratır. Örneğin anlık bildirimler gibi kaybı tolere edilebilen akışlarda doğrudan kuyruğa yazmak yeterlidir.

Ayrıca veritabanı ile mesajlaşma sistemi ortak bir dağıtık işlemi (2PC) yerel olarak destekliyorsa gerek kalmaz, ancak modern bulut mimarilerinde bu durum neredeyse hiçbir zaman tercih edilmez.

