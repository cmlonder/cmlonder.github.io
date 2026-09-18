---
title: 'Mimari, Güven Hakkında Bir Hikâyedir'
description: 'Bir sistemdeki her sınır, hangi ekibin seni bozmayacağına güvendiğinin ifadesidir.'
pubDate: 2026-07-19
topics: [solution-architecture]
tags: [sınırlar, ekipler]
featured: false
draft: false
placeholder: true
---

Bir mimari diyagrama baktığımda artık kutuları değil, kutuların arasındaki
çizgileri okuyorum. Her çizgi teknik bir karar gibi duruyor ama altında
neredeyse her zaman sosyal bir karar yatıyor: karşı taraftaki ekibin beni
bozmayacağına ne kadar güveniyorum?

Bunu ilk net olarak fark ettiğim tartışma, senkron bir çağrıyı kuyruğa
çevirdiğimiz bir tasarım toplantısıydı. Gerekçe olarak dayanıklılık
yazmıştık ve bu yanlış da değildi. Ama asıl sebep, o servisin deploy
takvimini bilmememiz ve ortasında habersiz yeniden başlamasıydı. Kuyruk
burada teknik bir çözüm kılığına girmiş bir güvensizlik beyanıydı, çünkü
karşı tarafın ne zaman ayakta olacağına dair bir sözümüz yoktu.

## Sınır, güvenin bittiği yerdir

Bir sistemde nereye sınır koyduğunu söyle, sana kime güvenmediğini
söyleyeyim. Aynı ekibin içinde kalan iki modül arasında kimse şema
versiyonlama, geriye dönük uyumluluk veya sözleşme testi konuşmuyor;
çünkü bir şey bozulursa aynı kişi düzeltecek ve düzeltme maliyeti bir
öğleden sonra. İki ekip arasına aynı çizgiyi koyduğun anda o çizgi birden
bire sözleşmeye, sürüm politikasına ve yayın sırasına ihtiyaç duyuyor.
Değişen şey teknoloji değil, hatanın kime fatura edildiği.

Bu yüzden mikroservis tartışmalarının çoğunu yanlış yerden yapıyoruz.
"Bunu ayrı bir servis yapalım mı" sorusu genelde ölçek sorusu gibi
sunuluyor ama pratikte cevabı belirleyen şey ekip sayısı oluyor. Tek bir
ekibin sahip olduğu bir sistemi beş servise bölmek, ödemeyi sevmediğin
bir güven bedelini boşuna ödemek anlamına geliyor. Beş ekibin ortak
sahip olduğu tek bir servisi bölmemek ise o bedeli görünmez hâle
getiriyor, ki daha kötüsü bu.

## Güven zamanla değişiyor, diyagram değişmiyor

Sistemlerin en sinsi tarafı, güven ilişkisinin yıllar içinde
değişmesine rağmen sınırların yerinde kalması. Bir servisi üç yıl önce
başka bir ekip yazmıştı, sonra o ekip dağıldı ve kod bize geçti. Artık
aramızda bir sınır olmasının hiçbir gerekçesi yok, ama sınır duruyor;
üstelik her değişiklikte iki repo, iki pipeline ve iki yayın süreci
ödüyoruz. Tersi de oluyor: yıllardır iç modül gibi davrandığımız bir
parça sessizce başka bir ekibe geçiyor ve biz hâlâ onun iç tablolarına
doğrudan yazıyoruz.

O yüzden mimari gözden geçirmelerinde artık şunu soruyorum: bu sınır
bugün hangi güven ilişkisini tarif ediyor, ve o ilişki hâlâ geçerli mi?
Cevap "bilmiyorum, öyle gelmiş" ise, elimizdeki şey mimari değil,
fosilleşmiş bir organizasyon şeması.

## Pratikte ne yapıyorum

Bir sınır önerdiğimde artık gerekçeyi teknik terimlerle yazmamaya
çalışıyorum. "Gevşek bağlılık için" demek yerine, kimin neye söz
verdiğini yazıyorum: bu ekip şu alanları geriye dönük uyumlu tutmaya söz
veriyor, şu tarihe kadar eski sürümü destekliyor, bozarsa nöbet telefonu
onlarda çalıyor. Bu cümleyi kuramıyorsam sınırı koymuyorum, çünkü
kuramadığım şey zaten var olmayan bir güven.

Bunun güzel tarafı, tartışmayı doğru odaya taşıması. Sınırın yeri
teknik bir tercih olarak sunulduğunda mühendisler tartışıyor ve genelde
en gürültülü olan kazanıyor. Aynı soru "bu sözü kim veriyor" diye
sorulduğunda ise cevabı verebilecek kişi belli oluyor, ve o kişi
çoğunlukla odada bile değil. Onu odaya çağırmak, çizgiyi nereye
çizeceğimizi tartışmaktan daha faydalı oluyor.
