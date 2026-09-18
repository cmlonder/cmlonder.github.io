---
title: 'Yarım kalmış soyutlamanın bedeli'
description: 'Yarım soyutlama hiç soyutlama olmamasından kötü, ve ajanlar hem üretimini ucuzlatıyor hem fark edilmesini zorlaştırıyor.'
pubDate: 2026-08-03
status: seedling
topics: [agentic-development, solution-architecture]
tags: [abstraction]
draft: false
placeholder: true
---

Eksik bir soyutlama can sıkıcı ama görülmesi kolay: aynı mantık dört yerde
duruyor ve dördünü birden değiştirmeyi hatırlaman gerekiyor. Yarım kalmış
bir soyutlama daha kötü, ve görülmesi çok daha zor.

Şekli hep benzer oluyor. Biri ortak parçayı çıkarıyor, beş çağrı yerinden
üçünü kapsıyor, kalan ikisi eski yöntemle devam ediyor. Artık kod tabanında
iki doğru var. Okuyan kişi soyutlamayı buluyor, onu yetkili sanıyor ve
yanılıyor. Sonraki kişi kendi durumu için soyutlamayı genişletiyor, bu da
onu biraz daha genel ve gerçekte neyi kapsadığı konusunda biraz daha az
dürüst yapıyor.

Bedel tekrar değil. Bedel, soyutlamanın kodun tutmadığı bir söz vermesi ve
sonraki her okuyucunun bunu keşfetmek için ödemesi.

Son dönemde değişen şey ekonomi. Soyutlama çıkarmak eskiden yeterince
yavaştı, o yüzden önce düşünüyordun ve başladıysan bitiriyordun. Ajanla
hızlı, yani yarım kalanlar daha kolay üretiliyor. Gözden geçirmede
yakalanmaları da zor, çünkü fark temiz bir çıkarma gösteriyor ve geride
bırakılan çağrı yerleri hakkında hiçbir şey söylemiyor.

Şimdiye kadar bulduğum tek önlem mekanik: bir soyutlama girdiğinde, aynı
değişiklikte taşınmamış çağrı yerlerinin listesini de iste. O liste boş
değilse değişiklik bitmemiş demektir. Bunu sevmiyorum, çünkü sormayı
hatırlamama bağlı.
