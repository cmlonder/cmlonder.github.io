---
title: 'Yeni araç eklemeden önce bağlam bütçesini hesaplamak'
description: 'Her araç tanımı her turda belirgin bir bağlam alanı tüketir. Ajanların yavaşlaması genellikle modelden değil, şişen bağlam penceresinden kaynaklanır.'
pubDate: 2026-08-23
problem: 'Ajan yavaşlıyor, maliyeti artıyor veya görevin ortasında odağını kaybediyor.'
context: 'Tanım listesinde çok sayıda araç bulunan ve gitgide büyüyen sistem talimatlarına sahip ajan kurulumları.'
topics: [agentic-development, context-engineering, tools]
draft: false
placeholder: true
---

## Problem

Ajan beklenenden yavaş yanıt vermeye veya görevleri şaşırmaya başladığında akla gelen ilk refleks yeni bir araç tanımlamak oluyor. Oysa her yeni araç şeması her etkileşim turunda bağlam penceresinden ciddi bir pay tüketiyor. Yani eklenen her yetenek, modelin asıl akıl yürütme alanından çalıyor.

## Bağlam

Onlarca fonksiyonun ve geniş bir sistem talimatının yüklendiği, birden çok aşamayı yöneten ajan mimarileri.

## Yaklaşım

Öncelikle mevcut bağlam bütçesini net biçimde ölçüyorum. Araç tanımlarının, sistem isteminin ve dinamik olarak eklenen dosyaların toplamda kaç token tuttuğunu kesinleştirmeden hareket etmiyorum. Çoğu zaman bu toplam miktar tahmin edilenden çok daha büyük çıkıyor.

Ardından kullanım sıklıklarını inceliyorum. Son yüz çalıştırmada hangi araç gerçekten çağrıldı? Neredeyse her projede hiç dokunulmamış ya da tek bir defa kullanılmış atıl araçlar bulunuyor. Bu gereksiz tanımları temizlemek, sisteme yeni bir araç eklemekten çok daha hızlı ve kalıcı bir ferahlama sağlıyor.

Sonraki adımda şema tanımlarını sadeleştiriyorum. Upuzun parametre açıklamaları ve karmaşık nesne yapıları yerine işi özetleyen yalın tarifler kullanmak hem bağlam tasarrufu sağlıyor hem de modelin parametreleri yanlış doldurma ihtimalini düşürüyor.

Son olarak araçları görev bağlamına göre gruplayıp yalnızca ihtiyaç duyulan aşamada dinamik olarak yüklüyorum. Ancak bu adımların ardından hala açık bir ihtiyaç varsa yeni bir araç eklemeyi değerlendiriyorum.

## Ödünleşimler

Araçları sistemden çıkarmak, o kabiliyete nadiren de olsa ihtiyaç duyulduğunda ajanı yanıtsız bırakabilir. Göreve göre dinamik yükleme kurgulamak ise yeni bir mimari karmaşıklık getirir, çünkü hangi görevin hangi araç setini yükleyeceğini yönetmek ayrı bir editoryal bakım gerektirir.

Şemaları fazla budamak da risklidir. Aşırı kısaltılan tanımlar belirsizlik yaratabilir, bu da başarısız fonksiyon çağrılarına ve tekrarlanan denemelerle kaybedilen zamana yol açabilir.

## Bu ne zaman işe yaramaz

Sorun gerçekten de eksik bir yetenekten kaynaklanıyorsa bütçe optimizasyonu tek başına sonuç vermez. Modelin elinde veriyi çekecek hiçbir yöntem yoksa asıl ihtiyaç token değil, doğru araçtır.

Ayrıca bağlam penceresinin çok küçük bir kısmını kullanan hafif iş akışlarında bu tür bütçe disiplinleri fazladan efor anlamına gelir çünkü ortada henüz bir darboğaz yoktur.

