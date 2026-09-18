---
title: 'Asıl İş İnceleme'
description: 'Üretim bedavaysa kıt olan kaynak muhakemedir. Bu, kıdemli mühendisin ne işe yaradığını yeniden tanımlar.'
pubDate: 2026-02-22
topics: [agentic-development, solution-architecture]
tags: [code-review, zanaat]
featured: false
draft: false
placeholder: true
---

Kod yazmanın pahalı kısmının yazmak olduğunu varsayarak büyüdüm. Bir
özelliğin maliyetini tahmin ederken kaç gün klavye başında oturulacağını
hesaplıyordum, çünkü kıt olan kaynak oydu. Ajanlarla çalışmaya başladıktan
sonra o varsayımın altı boşaldı. Üretim artık ucuz; bir akşamda beş farklı
yaklaşımın çalışan hâlini görebiliyorum. Ama beş yaklaşımın hangisinin
doğru olduğuna karar vermek hiç ucuzlamadı, hatta göreli olarak çok daha
pahalı hâle geldi.

## Kıtlık yer değiştirdi

Bir kaynağın fiyatı düşünce yanındaki kaynağın değeri artıyor. Kod
üretimi neredeyse bedava olunca darboğaz muhakemeye kaydı: bu değişiklik
gerçekten istediğimiz şey mi, bu soyutlama altı ay sonra bize ne pahalıya
mal olacak, bu testin geçmesi aslında neyi kanıtlıyor. Bunlar zaten hep
önemliydi ama eskiden yazma süresinin gölgesinde kalıyordu. Artık gölge
yok, ve muhakemenin ne kadar yavaş bir şey olduğu ortaya çıktı.

Bunun günlük hayattaki karşılığı şu: gözden geçirme artık işin sonunda
yapılan bir kalite kontrolü değil, işin kendisi. Bir ajana görev verip
çıktısını okumak, eskiden o kodu kendim yazmakla geçirdiğim sürenin
azını değil, benzerini alıyor. Fark şu ki o süreyi artık yazmaya değil,
karar vermeye harcıyorum.

## Okumak yazmaktan zor

Burada rahatsız edici bir gerçek var: kod okumak kod yazmaktan zor.
Yazarken kararları sen veriyorsun ve her kararın gerekçesi kafanda taze
duruyor. Okurken ise başkasının verdiği kararları tersine mühendislikle
çıkarman gerekiyor, üstelik gerekçesiz. Ajan çıktısında bu daha da zor,
çünkü çıktı her zaman kendinden emin görünüyor ve yanlış olduğunda bile
makul duruyor.

Bunu yönetmenin bende işe yarayan tek yolu, okumayı kolaylaştıracak
kısıtları baştan koymak oldu. Küçük değişiklik istemek, her değişikliğin
yanında neyi kanıtladığı belli bir test istemek, ve repoda konvansiyonları
yazılı tutmak. Konvansiyon yazılıysa çıktının ona uyup uymadığına bakmak
saniyeler sürüyor; yazılı değilse her seferinde "acaba biz böyle mi
yapıyorduk" diye düşünüyorum ve asıl yorgunluk oradan geliyor.

## Kıdemin anlamı değişiyor

Kıdemli mühendisin ne işe yaradığı sorusunun cevabı da bu yüzden
kayıyor. Eskiden kıdem, zor olanı yazabilmekti. Şimdi giderek daha çok,
üretilen şeyin nerede yanlış olduğunu hızlı görebilmek anlamına geliyor.
Bu ikisi aynı kas değil. Çok iyi yazan ama başkasının kodunu okurken
sabırsızlanan mühendisler tanıyorum, ve yeni düzende zorlanan taraf
onlar oluyor.

İşin garibi, bu değişim junior seviyeyi de zorlaştırıyor. Muhakeme,
yeterince kötü karar verip sonucunu görerek gelişen bir şey. Yazma
adımını atlayan biri o geri bildirim döngüsünü nereden alacak, bunun
iyi bir cevabını henüz bulamadım. Şimdilik kendi ekibimde yaptığım şey,
ajanın ürettiği çıktıyı gözden geçirme egzersizi olarak kullanmak:
"burada ne yanlış" sorusu, "bunu yaz" sorusundan daha çok öğretiyor.

## Ölçtüğüm şey

Bir süredir kendi haftamı şöyle bölüyorum: ne kadarını üretim, ne
kadarını gözden geçirme aldı. Oran giderek gözden geçirme lehine
değişiyor ve bunu bir sorun olarak görmüyorum. Sorun olarak gördüğüm
şey, gözden geçirmeyi hâlâ ücretsiz bir ek iş gibi planlamak. Takvimde
yeri olmayan bir iş, yapılmıyor demektir; ajanlarla çalışırken
yapılmayan gözden geçirmenin faturası da doğrudan ürüne yazılıyor.
