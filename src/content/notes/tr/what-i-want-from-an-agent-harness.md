---
title: 'Bir yapay zeka çalıştırma ortamından (harness) ne bekliyorum?'
description: 'Ajan geliştirme süreçlerinde gözlemlenebilirlik ve çalışma anında müdahale kabiliyetine dair güncel ihtiyaçlar.'
pubDate: 2026-05-10
status: budding
topics: [agentic-development, tools]
draft: false
placeholder: true
---

Süreç içinde biriken ve netleşen bir ihtiyaç listesi. Maddelerin neredeyse tamamı sistemin içini görebilmek ve akışı güvenle durdurabilmekle ilgili.

**Süreci yarıda durdurabileyim ama verilen emek çöpe gitmesin.** Bir ajanı izlerken en çok ihtiyaç duyduğum şey görevi tamamen çöpe atmak değil, gidişatın yönünü hafifçe değiştirebilmektir. Mevcut araçlarda akışı kesmek genellikle tüm bağlamı silip konuşmaya sıfırdan başlamak anlamına geliyor. Bu yüzden yoldan sapan denemeleri sırf toparlar umuduyla olması gerekenden çok daha uzun süre kendi haline bırakıyorum.

**Token tüketimini anlık olarak izleyebileyim.** Görev bittikten sonra gösterilen toplu bir fatura yeterli olmuyor. Çalışma anında bağlam penceresinin ne kadarının araç şemalarına, ne kadarının içeri çekilen dosyalara ve ne kadarının asıl akıl yürütmeye harcandığını canlı görmek istiyorum. Bu dağılımı sürekli tahmin etmeye çalışıyorum ve tahminlerimde neredeyse her zaman yanılıyorum.

**Üretilen farklar çalışma dizinine yazılmadan önce incelenebilsin.** Yapılan değişiklikleri ancak dosyalar doğrudan diske yazıldıktan sonra görebilmek küçük düzeltmeler için sorun yaratmazken, kapsamlı mimari işlerde süreci tam bir karmaşaya çeviriyor. Deneyimli bir meslektaşımdan bekleyeceğim aşamalı ve kontrollü inceleme deneyiminin aynısını arıyorum.

**Çalışmanın tam bir tekrar kaydı olsun.** Bir görev başarısız olduğunda modelin kararlarını ve girdilerini adım adım baştan oynatabilmeliyim. Sadece bir özet metni okumak istemiyorum, çünkü o özeti de hatayı yapan modelin kendisi yazıyor.

**Doğrulama adımı bir tavsiye değil, sistemin birinci sınıf bir kuralı olsun.** Proje kökünde tanımlanmış bir test veya doğrulama komutu varsa çalışma ortamı bunu her değişiklikten sonra otomatik çalıştırmalı ve gelen hatayı gerçek bir başarısızlık kabul etmeli. Doğrulamayı hatırlama yükü bana kalmamalı.

Bu listeyi yazarken fark ettiğim en çarpıcı gerçek şu oldu: Beklentilerimin hiçbiri daha zeki bir model istemekle ilgili değil. Asıl aradığım şey daha akıllı bir ajan değil, süreci güvenle yönetecek sağlam bir kokpit.

