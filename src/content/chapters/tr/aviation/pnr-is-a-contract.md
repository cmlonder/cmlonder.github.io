---
title: "PNR bir kayıt değil, bir sözleşme"
domain: "aviation"
summary: "Rezervasyonu bir satır olarak modellersen ilk ay çalışır, ikinci ay çöker. Sebebi PNR'ın ne olduğunu değil, neyi temsil ettiğini yanlış anlamak."
pubDate: 2026-09-10
topics: ["solution-architecture"]
crossRef:
  domain: "ecommerce"
  slug: "cart-is-a-time-window"
  why: "Sepet de aynı şekilde bir kayıt değil, süreli bir söz."
placeholder: true
---

Yeni birinin havayolu rezervasyon sistemine baktığında yaptığı ilk çizim
neredeyse her zaman aynı:

```
reservations
  id, passenger_name, flight_no, seat, status, created_at
```

Bu tablo ilk ay çalışır. İkinci ay çöker. Sebebi performans değil; **PNR'ın
ne olduğunu değil, neyi temsil ettiğini** yanlış anlamak.

## PNR ne değildir

PNR — Passenger Name Record — bir yolcunun kaydı değil. **Bir seyahatin
kaydı.** İçinde birden fazla yolcu, birden fazla uçuş, birden fazla hizmet
olabilir; ve bu parçaların her biri farklı zamanlarda, farklı taraflarca
değiştirilebilir.

Somut olarak tek bir PNR şunları aynı anda taşıyabilir:

- İki yetişkin, bir bebek (bebeğin kendi koltuğu yok ama kendi bileti var)
- Gidiş İstanbul-Londra, dönüş Londra-Edinburgh-İstanbul (dönüş iki bacak)
- Bir bacağı başka bir havayolunun işlettiği kod paylaşımlı uçuş
- Ayrı satın alınmış bir bagaj hakkı ve bir koltuk seçimi
- Acentenin eklediği, havayolunun göremediği bir not

Bu yapının veri modelindeki karşılığı bir satır değil, **bir ağaç**. Ve ağacın
dalları birbirinden bağımsız yaşıyor: bir bacağı iptal etmek diğerini iptal
etmiyor, bir yolcuyu çıkarmak PNR'ı silmiyor.

## Asıl mesele: PNR bir sözleşme

Modelleme hatasının kaynağı şu varsayım: *"rezervasyon, sistemimdeki bir
durumun kaydıdır."*

Değil. PNR **taraflar arasında bir sözleşmenin şu anki hali.** Taraflar:
yolcu, bilet satan acente, taşıyan havayolu, ve bazen ortak havayolu. Her
birinin kayıt üzerinde farklı yetkisi var ve hiçbiri tek başına sahibi değil.

Bunun üç somut sonucu var.

**Birincisi: değişiklik silme değildir.** Yolcu ismi düzeltildiğinde eski isim
kaybolmaz. Sözleşmenin kim tarafından, ne zaman değiştirildiği kanıtlanabilir
olmak zorunda — ihtilaf çıktığında bakılacak yer burası. Yani PNR'ın doğal
saklama biçimi *üzerine yazılan bir satır* değil, **eklenen bir olay
günlüğü**. Bunu baştan böyle kurmazsan, altıncı ayda "bu isim ne zaman
değişti" sorusuna cevap veremezsin.

**İkincisi: bölünme temel bir işlem.** Dört kişilik bir rezervasyonda bir
kişinin uçuşu değişirse, o kişi PNR'dan çıkarılıp **yeni bir PNR'a**
taşınıyor; ikisi arasında bir bağ bırakılıyor. Buna sektörde *split* deniyor
ve bir kenar durum değil, günlük bir işlem. Tek tablo modelinde bunun
karşılığı yok.

**Üçüncüsü: sahiplik devredilebilir.** Acente üzerinden alınmış bir PNR'ın
kontrolü havayoluna geçebilir. Kaydın "sahibi" alanı, kaydın ömrü boyunca
değişen bir alan.

## Neden hâlâ altı karakter

PNR'ı bulmak için kullanılan `A3F9KL` gibi kod — *record locator* — altı
alfanümerik karakter. Bu sınır 1960'ların terminal ekranlarından kalma ve
hâlâ duruyor, çünkü sektördeki her sistem onu bekliyor.

Pratik sonucu: **bu kod benzersiz değil.** Aynı locator farklı havayollarında
farklı rezervasyonları gösterebilir, ve yeterince zaman geçtikten sonra aynı
havayolunda bile yeniden kullanılabilir. Locator'ı birincil anahtar yapan
sistemler bu yüzden yıllar sonra tuhaf çakışmalar yaşıyor.

Doğrusu şu: locator bir **arama anahtarı**, kimlik değil. Kimlik senin kendi
sistemindeki kalıcı kimlik olmalı, locator ise dış dünyayla konuşma dili.

## Ne yapmalı

Rezervasyonu bir **olay günlüğü** olarak modelle; bugünkü hali o günlükten
türeyen bir görünüm olsun. "Şu anki durum" ayrı bir tablo olabilir ama
doğrunun kaynağı olmamalı.

Ağaç yapısını gerçekten ağaç olarak kur: yolcular, bacaklar ve hizmetler ayrı
varlıklar, PNR onları bir arada tutan kap. Bölme işlemini ilk sürümde
desteklemesen bile, modelin buna izin verdiğinden emin ol — sonradan eklemek
neredeyse yeniden yazmak demek.

Record locator'ı asla birincil anahtar yapma.

Bunların hiçbiri havacılığa özgü değil, sadece havacılıkta sonuçları daha
erken görünüyor. Aynı hatayı e-ticarette sepet modellerken de yapıyoruz.
