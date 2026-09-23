---
title: 'Tablo başına tek yazıcı kuralı'
description: 'Paylaşılan bir veritabanının zamanla kontrol edilemez bir monolite dönüşmesini engellemenin en etkili yolu.'
pubDate: 2026-05-04
problem: 'Birden fazla bağımsız servis aynı veritabanı tablosuna doğrudan yazıyor ve şema değişiklikleri korkutucu hale geldi.'
context: 'Servis odaklı mimariye geçiş aşamasında olan ve ortak veritabanı kullanan sistemler.'
topics: [solution-architecture, database, boundaries]
draft: false
placeholder: true
---

## Problem

Birden fazla bağımsız servis aynı tabloya doğrudan yazmaya başladığında veritabanı şemasını değiştirmek korkulu bir rüyaya dönüşür. Tek bir sütun tipini değiştirmenin hangi servisi çökerteceğini kimse kesin olarak kestiremez. Sonuç olarak şema gelişimi durur, sistem donar ve etrafta geçici yamalar birikmeye başlar.

## Bağlam

Mikroservislere geçişin ortasında kalmış, servislerin hala aynı ilişkisel veritabanını paylaştığı karmaşık mimariler.

## Yaklaşım

İlk adım olarak her tabloya tek bir sahip servis belirliyorum ve diğer tüm yazma işlemlerini bu servisin API'sine yönlendiriyorum. Sahip servis, ilgili verinin iş mantığını barındıran servistir. Eğer bu sınır belirsizse kural basittir: Veri bozulduğunda gece yarısı telefonu çalan ekip o tablonun sahibidir.

Okuma işlemlerini ise ilk etapta olduğu gibi bırakıyorum. Yazma sınırları toparlanırken diğer servislerin doğrudan tablodan okuma yapmaya devam etmesi oldukça kabul edilebilir ve pratik bir geçiş aşamasıdır. Her şeyi tek seferde taşımaya çalışmaktan çok daha az risklidir, çünkü asıl tutarlılık sorunları yazma tarafından kaynaklanır.

Doğrudan yazma yapan her harici servis için bu işlemi sahip servise yapılan açık bir sözleşme çağrısına dönüştürüyorum. Bu çağrıyı baştan aynı işlem güvencesine (idempotent) kavuşturmak gelecekteki olası yeniden deneme ihtiyaçlarını da peşinen çözer.

Yazma yetkisi tek elde toplandığında veritabanı şeması yeniden güvenle geliştirilebilir hale gelir — bu çalışmanın asıl gayesi de budur. Doğrudan okumaları API arkasına taşımak ise daha sonra ihtiyaç duyuldukça parça parça tamamlanabilir.

## Ödünleşimler

Tüm yazmaları tek servis üzerinden geçirmek, eskiden yerel bir kayıt ekleme işlemi olan akışlara bir ağ atlaması ve ek gecikme getirir. Ayrıca ilgili sahip servis, yazma yapan diğer tüm servisler için kritik bir çalışma bağımlılığı haline gelir.

Sürecin operasyonel bir maliyeti de vardır. Tablonun sahibi olan ekip diğer ekiplerden sürekli şema değişikliği talepleri almaya başlar. Bu talepleri hızla eritebilecek bir iş akışı kurulmazsa sahip servis kurum içi bir darboğaza dönüşür.

## Bu ne zaman işe yaramaz

Tablo gerçekten belirli bir iş alanına ait olmayan ortak bir günlükleme ya da denetim izi tablosuysa yapay bir sahip atamak gereksiz bir engel yaratır.

Ayrıca asıl sorun tablonun birbiriyle alakasız iki farklı iş modelini aynı yerde tutmasından kaynaklanıyorsa bu yöntem yetmez. O senaryoda öncelikle tabloyu mantıksal parçalara ayırmak gerekir. Sahiplik sınırları bu bölünmenin ardından kendiliğinden netleşir.


