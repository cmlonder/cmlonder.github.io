---
title: 'AGENTS.md neden yeni README haline geldi?'
description: 'Klasik bir README dosyası projeye hızla göz gezdirecek insanlar için yazılırdı, oysa AGENTS.md her çalıştırmada baştan sona ve satır satır okunuyor.'
pubDate: 2026-07-29
status: budding
topics: [agentic-development, conventions]
draft: false
placeholder: true
---

Geleneksel README dosyaları projeye ilk kez göz gezdirecek insanlar için yazılmış bir türdür. İlk kurulum adımları, birkaç durum rozeti ve belki kaba bir mimari şeması içerir. Kimse bu dosyayı her gün baştan sona satır satır okumaz, bu yüzden içindeki bazı bilgilerin eskimesi de kimseyi ciddi şekilde rahatsız etmez.

Oysa `AGENTS.md` bambaşka bir amaca hizmet ediyor, çünkü yapay zeka ajanları tarafından her çalıştırmada baştan sona taranıyor. Bu temel fark, dosyanın nasıl kaleme alınması gerektiğini de kökten değiştiriyor. Bir kural belirsiz yazıldığında insan geliştirici onu sezgileriyle tamamlayabilir ya da görmezden gelebilir. Fakat bir ajan belirsizliği görmezden gelmez, doğrudan yanlış yorumlayarak hatalı kod üretir. Yazılımdaki belirsizliklerin maliyeti ilk defa bu kadar somut hale geldi.

Süreç içinde bende karşılık bulan üç temel alışkanlık oluştu. Öncelikle kuralın kendisini değil, arkasındaki gerekçeyi yazıyorum. Sebebini bilen bir model, daha önce hiç karşılaşmadığı bir ikilemde kaldığında da doğru tercihi yapabiliyor. İkinci olarak yasakları somut örneklerle destekliyorum. "Temiz kod yaz" demek hiçbir anlam ifade etmezken, "bu dizinde şu kalıbı kullanma, onun yerine bunu tercih et" demek ajana net bir sınır çiziyor. Üçüncüsü ise kuralların mekanik olarak doğrulanabilir olmasına özen gösteriyorum. Tek bir komutla kontrol edilemeyen her kural, pratikte uyulup uyulmadığı asla bilinemeyecek bir temenniden ibaret kalıyor.

Henüz net bir çözüme kavuşturamadığım taraf ise dosyanın zamanla şişmesi. Eklenen her yeni kural bağlam bütçesinden pay alıyor ve belli bir hacmin ardından modeller dosyanın ortasında kalan detayları gözden kaçırmaya başlıyor. Şu an önümde iki zorlu seçenek var: Ya kuralları aşırı özetleyip belirsizlik riskini göze alacağım ya da dosyayı modüler parçalara bölüp hangi aşamada hangi bölümün yükleneceğini yöneteceğim. İkinci yol kulağa çok daha sağlıklı geliyor fakat ideal bölme kriterini henüz tam olarak oturtamadım.

