---
title: 'AGENTS.md yeni README'
description: 'README bir kere göz gezdirecek insan için yazılmıştı. Bu dosya her çalıştırmada baştan sona okunuyor.'
pubDate: 2026-07-29
status: budding
topics: [agentic-development, conventions]
draft: false
placeholder: true
---

README bir kere göz gezdirecek insan için yazılmış bir tür. İlk kurulum
adımları, bir rozet sırası, belki bir mimari şeması. Kimse onu her gün
baştan sona okumuyor, o yüzden eskimesi de kimseyi rahatsız etmiyor.

`AGENTS.md` bambaşka bir dosya, çünkü gerçekten her çalıştırmada baştan
sona okunuyor. Bu tek fark, dosyanın nasıl yazılması gerektiğini de
değiştiriyor. Bir kural belirsizse insan onu görmezden geliyor; ajan
görmezden gelmiyor, yanlış yorumluyor. Belirsizliğin maliyeti ilk kez
gerçek oldu.

Bende işe yarayan üç alışkanlık şöyle oluştu. Kuralı değil, kuralın
sebebini yazıyorum; çünkü sebebi bilen bir ajan yeni durumda da doğru
tarafı seçebiliyor. Yasakları örnekle yazıyorum, çünkü "temiz kod yaz"
hiçbir şey söylemiyor ama "şu dosyada şu kalıbı kullanma, yerine bunu
kullan" bir şey söylüyor. Bir de kuralın kanıtlanabilir olmasına
dikkat ediyorum: bir komutla kontrol edilemeyen kural, uyulup
uyulmadığını kimsenin bilmediği kural demek.

Henüz çözemediğim kısım, dosyanın büyümesi. Her yeni kural context
bütçesinden yiyor ve belli bir boyuttan sonra ajan dosyanın ortasındaki
şeyleri kaçırmaya başlıyor. Şu an elimde iki kötü seçenek var: ya
kuralları kısaltıp belirsizleştireceğim ya da dosyayı bölüp hangi
parçanın ne zaman yükleneceğine karar vereceğim. İkincisi daha doğru
geliyor ama bölme kriterini henüz bulamadım.
