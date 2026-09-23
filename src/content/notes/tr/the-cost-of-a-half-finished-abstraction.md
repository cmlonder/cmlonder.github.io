---
title: 'Yarım bırakılmış soyutlamaların ağır maliyeti'
description: 'Yarım kalmış bir soyutlama, hiç soyutlama yapılmamasından çok daha tehlikelidir ve yapay zeka araçları bu eksik yapıların üretimini inanılmaz hızlandırıyor.'
pubDate: 2026-08-03
status: seedling
topics: [agentic-development, solution-architecture, abstraction]
draft: false
placeholder: true
---

Kod tabanında hiç soyutlanmamış yinelenen bir mantık görmek can sıkıcıdır fakat tespiti son derece kolaydır. Aynı iş kuralı dört ayrı yerde durur ve bir değişiklik gerektiğinde dördünü birden güncellemeniz gerektiğini bilirsiniz. Yarım bırakılmış bir soyutlama ise bundan çok daha tehlikelidir, çünkü arkasında sahte bir düzen hissi bırakır.

Senaryo her zaman benzer biçimde gelişir. Geliştirici ortak mantığı fark edip yeni bir soyutlama katmanı oluşturur. Mevcut beş kullanım noktasından üçünü bu yeni yapıya taşır fakat kalan ikisi eski haliyle çalışmaya devam eder. Artık sistemde aynı işi yapan iki farklı doğru vardır. Kodu yeni okuyan biri bu soyutlamayı görünce tüm projenin bu kuralla işlediğini varsayar ve yanılır. Ardından gelen kişi kendi özel senaryosunu da kapsasın diye o soyutlamayı biraz daha esnetir, bu da yapıyı hem daha karmaşık hem de neyi çözdüğü konusunda daha belirsiz bir hale getirir.

Buradaki asıl maliyet kodun tekrar etmesi değildir. Asıl bedel, soyutlamanın projenin geneli adına tutamayacağı bir söz vermesi ve sonraki her geliştiricinin bu tutarsızlığı kendi mesaisiyle keşfetmek zorunda kalmasıdır.

Son dönemde bu denklemi değiştiren en büyük etken ise yapay zeka ajanları oldu. Eskiden bir soyutlama kurmak zaman ve dikkat gerektirirdi, bu yüzden başlamadan önce derinlemesine düşünülür ve başlanan iş genellikle sonuna kadar götürülürdü. Ajanlarla birlikte kod yazmak çok hızlandı, bu da yarım kalan soyutlamaların çok daha zahmetsizce ve sıkça üretilmesine zemin hazırlıyor. Üstelik kod incelemelerinde bunları yakalamak da zordur, çünkü sunulan değişiklik gayet derli toplu bir fonksiyon sunarken, projenin unutulan diğer köşeleri hakkında hiçbir ipucu vermez.

Şimdilik uygulayabildiğim tek pratik kural mekanik bir disiplinden ibaret: Projeye yeni bir soyutlama eklendiğinde, aynı değişiklik içinde eski yöntemle bırakılmış tüm kullanım noktalarının dökümünü istiyorum. Eğer taşınmamış yerler varsa o değişiklik henüz tamamlanmamış demektir. Ancak bu yöntemi de bütünüyle tatmin edici bulmuyorum, çünkü her seferinde bunu hatırlayıp denetlemeyi yine insan iradesine bırakıyor.

