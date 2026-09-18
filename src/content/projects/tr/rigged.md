---
title: "RIGGED"
summary: "Hackathon işi: tek bir Reddit post'unun içinde yaşayan günlük fizik oyunu."
what: "Oyuncular bir fizik düzeneği kuruyor, sonra birbirinin donmuş düzeneğine çalışır mı çalışmaz mı diye karar veriyor."
status: "shipped"
started: 2026-07-04
updated: 2026-07-19
stack: ["Devvit", "Phaser 4", "Matter.js", "TypeScript", "Hono", "Redis"]
url: "https://www.reddit.com/r/RiggerGame/comments/1uxg0xy/"
event:
  name: "Reddit — Games with a Hook"
  url: "https://devpost.com/software/rigged"
metrics:
  - label: "Fizik parçası"
    value: "11"
  - label: "Rotasyon günü"
    value: "24"
  - label: "Drift yüzünden çıkan level"
    value: "3"
order: 5
---

Tek bir Reddit post'unun içinde çalışan günlük bir fizik oyunu; Reddit'in
Games with a Hook hackathon'u için yazıldı. Her gün engelleri ve hedefi olan
bir sahne geliyor. 11 parçadan bir düzenek kuruyorsun, simüle ediyorsun,
yayınlıyorsun. Diğerleri senin düzeneğini **donmuş** halde görüyor — daha
çalışmadan — ve karar veriyor: WILL WORK mü, WILL FLOP mu? Sonra düzenek
çalışıyor.

Bunu bulmacadan ayırıp oyun yapan şey puanlama. Kuran kişi temiz çözdüğü için
puan almıyor; **surprise rate** ile puan alıyor, yani kaç tahminciyi yanılttığı
ile. Çalışmayacak gibi duran ama çalışan bir düzenek, kesin çalışacak gibi
duran düzenekten daha değerli.

## Asıl problem determinizmdi

Her açılış, kaydedilmiş video değil, izleyenin cihazında canlı yeniden
simülasyon. Yani aynı düzenek her yerde aynı sonucu vermek zorunda, yoksa oyun
yalan söylüyor demektir.

"Aynı" iki koşum, body'lerin eklenme sırası kadar küçük bir şeyde ayrışabiliyor.
Çözüm frame loop'a güvenmeyi bırakmak oldu: dünya sabit `1000 / 60` adımıyla
elle step'leniyor, ve bir Node harness'ı Phaser'ın kendi Matter build'ini
çalıştırıp bot düzeneklerini önceden simüle ediyor, her level'ın çözülebilir
olduğunu doğruluyor.

Yine de her level için yetmedi. Bell level'larının üçü 24 günlük rotasyondan
çıkarıldı: kazanan düzenekleri kubbeyi bir pikselden az farkla sıyırıyor ve top
temas anında hâlâ hareket halinde. Bake ile reveal arasındaki en ufak drift
WORK'ü FLOP'a çeviriyor. Rotasyonda kalanlar topun durduğu settle hedefleri;
orada iki motor aynı cevapta buluşuyor.

Kimin doğru okuduğu konusunda ara sıra yalan söyleyen bir oyun yayınlamaktansa
üç level'ı çıkarmayı tercih ettim.

## Metin kutusu olmadan kullanıcı içeriği

Oyuncular kendi challenge'larını yayınlayabiliyor ve hiçbiri serbest metin
değil. Girdiler preset'lerden geliyor, sunucu her gönderimi yeniden doğruluyor,
ve bir challenge ancak yazarı kendi level'ını çözdükten sonra canlıya çıkıyor.
Hiç üretmediğin moderasyon problemi, en ucuz moderasyon problemidir.

## Ne yanlış yaptım

Ekranları, çalışan prototipten değil, prototipin kodundan ve iş mantığından
çıkardım. Detay gibi duruyor. Bedeli şu oldu: tek bir `@keyframes` bloğu
karşıya geçmedi, renkler, parça detayları, eleman konumları kaydı, ve sadece
prototip gerçekten çalışırken görünen birkaç akış tamamen eksik kaldı.

Ders sıkıcı ve ben bunu tekrar tekrar öğreniyorum: **kaynağı okumak, o şeyin
çalışmasını izlemekle aynı şey değil.** Artık her ekran dosyasıyla değil,
çalışan prototiple karşılaştırılıyor.
