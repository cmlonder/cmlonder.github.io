---
title: 'Yeniden denemelerden önce aynı işlem güvencesi (idempotency)'
description: 'Aynı işlem güvencesi sunmayan bir uç noktaya yeniden deneme mekanizması eklemek, görünür bir hatayı sessiz ve tehlikeli bir veri bozulmasına dönüştürür.'
pubDate: 2026-07-17
problem: 'Aralıklı hata veren bir alt servis için doğrudan yeniden deneme mekanizması eklenmek isteniyor.'
context: 'Doğrudan denetiminizde olmayan dış servislerle yapılan eşzamanlı HTTP veya RPC çağrıları.'
topics: [solution-architecture, reliability, retries]
draft: false
placeholder: true
---

## Problem

Dışarıdan bir servis aralıklarla hata vermeye başladığında akla gelen ilk çözüm hemen bir yeniden deneme mekanizması eklemek olur. Bu değişiklik birkaç satırlık basit bir kodla hayata geçtiği için kolayca onaylanır. Ancak asıl tehlike buradadır: Güvenceye alınmamış yeniden denemeler görünür bir sistem hatasını görünmez bir veri kirliliğine çevirir. Bir istek birden fazla kez işlendiğinde alarm çalmayı bırakır fakat veritabanındaki kayıtlar sessizce bozulur.

## Bağlam

Uçtan uca kaynak koduna ya da dağıtım takvimine hakim olmadığınız harici servislerle yapılan senkron iletişimler.

## Yaklaşım

İlk olarak şu sorunun cevabını netleştiriyorum: Bu çağrı aynı parametrelerle bir kez daha çalışırsa ne olur? Cevabı kesin olarak bilmiyorsak yeniden deneme eklemek baştan yasaktır, çünkü belirsiz bir davranışı döngüye sokmak riski katlar.

Ardından aynı işlem güvencesini çağıran tarafa değil, isteği karşılayan sunucu tarafına kuruyorum. İstemci her istek için tekil bir kimlik anahtarı üretir ve sunucu bu anahtarla başarıyla işlediği kayıtları saklar. Aynı anahtar ikinci kez geldiğinde sunucu işlemi yeniden yürütmez, hafızasındaki ilk cevabı doğrudan geri döner. Bu anahtarın saklanma ömrü, olası deneme aralığından belirgin şekilde uzun olmalıdır.

Anahtarın istemci tarafından üretilmesi kritiktir, aksi takdirde her denemede yeni bir kimlik oluşur ve koruma tamamen boşa çıkar.

Tüm bu güvenlik ağı eksiksiz kurulduktan sonra, sınırlı deneme sayısı ve kademeli bekleme süreleriyle yeniden deneme katmanını devreye alıyorum.

## Ödünleşimler

İşlem anahtarlarını saklamak ek bir depolama ve sorgulama yükü getirir. Özellikle yüksek hacimli uç noktalarda bu maliyet göz ardı edilemez. Ayrıca anahtar kaydının asıl veriyle aynı veritabanı işleminde yazılmaması durumunda sistem kendi içinde yeni bir tutarsızlık yaratabilir.

Her istekte yapılan ek sorgu az da olsa bir gecikme payı ekler.

## Bu ne zaman işe yaramaz

Yürütülen işlem zaten doğası gereği idempotent ise bu mekanizmaya gerek yoktur. Örneğin bir kaydın son halini doğrudan üzerine yazan güncellemelerde veya salt okuma çağrılarında ek anahtar tutmanın bir getirisi olmaz.

Ayrıca yan etkisi tamamen harici sistemlerde gerçekleşen senaryolarda da tek başına yetersiz kalır. E-posta gönderimi ya da harici para transferi gibi durumlarda anahtar mükerrer isteği engeller ancak ilk işlemin gerçekte başarıyla tamamlanıp tamamlanmadığını teyit etmek için bağımsız bir mutabakat mekanizması şarttır.

