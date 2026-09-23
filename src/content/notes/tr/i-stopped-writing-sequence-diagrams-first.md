---
title: 'Tasarım yaparken ilk sıraya akış diyagramı çizmeyi bıraktım'
description: 'Sistemi kusursuz senaryodan değil de olası hata durumlarından kurgulamaya başlamanın neden çok daha sağlam bir mimari ürettiği üzerine.'
pubDate: 2026-08-17
status: seedling
topics: [solution-architecture, design, diagrams]
draft: false
placeholder: true
---

Geçmişte yeni bir sistem tasarlarken her zaman en pürüzsüz akışı çizerek işe başlardım. Kutular, birbirini izleyen oklar ve isteğin adım adım ilerleyişi. Bu yöntem insanı inanılmaz üretken hissettiriyordu ve toplantılarda herkesin kolayca anlayıp onaylayabileceği şık bir görsel ortaya çıkarıyordu. Bu alışkanlığın bu kadar uzun sürmesinin sebebi de muhtemelen buydu.

Fakat zamanla şunu fark ettim: Pürüzsüz senaryo, bir mimaride üzerine en az tartışılan ve kodlaması en kısa süren bölümdür. Tasarıma oradan başlamak, kolay bir uzlaşmayı öne çekip sistemin kaderini belirleyecek asıl çetin soruları halının altına süpürmekten başka bir işe yaramıyor.

Artık çalışmaya doğrudan hata senaryolarını listeleyerek başlıyorum. Bu ağ çağrısı zaman aşımına uğrarsa ne olacak? İşlem sunucuda başarıyla tamamlanıp dönüş cevabı yolda kaybolursa ne yapacağız? Aynı istek iki kez gelirse sistem nasıl davranacak? Karşı servis ayaktayken bayat veya tutarsız veri dönerse akış nereye evrilecek? İşin büyüleyici tarafı, bu temel sorulara dürüst yanıtlar verdiğinizde asıl ihtiyaç duyulan mimari diyagram kendiliğinden ortaya çıkıyor. Üstelik bu yeni şema, masaya ilk oturulduğunda hayal edilen o tozpembe akıştan çok farklı bir yapıya sahip oluyor.

Bu yaklaşımın önemli bir kültürel faydası da var. Pürüzsüz senaryo diyagramları toplantıda herkesin sadece başını sallamasını sağlar. Hata listesi ise odadaki deneyimli bir mühendisin "bu üçüncü durum iki yıl önce başımıza gelmişti ve sistemi saatlerce kitlemişti" demesini tetikler. Bir mimari değerlendirmede duyulabilecek en değerli cümle de tam olarak budur.

Henüz dengelemekte zorlandığım nokta ise bu sürecin felç edici bir paranoyaya dönüşmesini engellemek. Hayatta her zaman bir sonraki hata senaryosu vardır ve bazılarının gerçekleşme ihtimali için mimariyi şişirmeye değmez. Şimdilik "bunun riskiyle canlıda yüzleşmeyi kabul ediyorum" diyebildiğim sınırda duruyorum, ancak bunu kesin bir kural olarak tanımlamak hala zor.

