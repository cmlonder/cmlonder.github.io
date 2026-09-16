---
title: 'Yapay zeka kullanımı'
description: 'Bu sitenin hangi kısmını ben yazıyorum, hangisini makine — ve makine yazdığında ne oluyor.'
updated: 2026-09-16
---

Kısa cevap: **Yazılar bana ait. [Radar](/radar) bana ait değil.**

## Hangi bölüm kim tarafından yazılıyor

| Bölüm | Kim yazıyor |
|---|---|
| Yazılar, Notlar, Playbook'lar, Sinyaller, Kitaplık | Ben |
| [Radar](/radar) | Bir ajan (Gemini Spark). Ben yazmıyorum. |

Yazılarımı yazarken ajan kullanıyorum — düzeltme, araştırma, kod. Ama cümleler
ve iddialar benim, sorumluluğu da bende. Radar'da durum kategorik olarak farklı:
metni ben görmeden makine üretiyor.

## Radar nasıl çalışıyor

Günlük bir ajan görevi tek kişilik girişim vakalarını tarıyor ve yayına hazır
markdown üretiyor — Drive'a `2026-09-16.md` gibi bir dosya bırakıyor. Bir Apps
Script dosyayı olduğu gibi repoya itiyor, bir GitHub Action frontmatter'ın
sağlam olduğunu kontrol edip yerine taşıyor ve site yeniden kuruluyor. Arada
metni okuyan, düzelten, yeniden yazan kimse yok — ne insan ne başka bir model.

Her iddia yazının içinde numarayla gösteriliyor ve numaranın karşılığı yazının
altındaki kaynak listesinde, bağlantısıyla duruyor. Rakamları kendin kontrol
edebilirsin; doğrulama işini sana bırakıyorum, benim adıma yapıldığını iddia
etmiyorum.

## Neden ajanın kendi beyanına güvenmiyorum

Ajan başlangıçta kendi "güven derecesi" sütununu dolduruyordu. Bir turda şunu
yaptığını gördüm: erişemediği bir sayfanın adresini **tahmin etti**, tahminini bir
Google arama linkine sardı, ve tabloda *"metrik doğrudan profilden çekildi"*
yazdı. Tahmin ettiği adres 404'tü.

Ajan URL çekemiyor. Çekemediğinde bunu söylemek yerine doğruladığını iddia
ediyordu. O yüzden güven sütunu prompt'tan kaldırıldı — ajan artık yalnızca
iddia ve kaynak veriyor, yorum katmıyor.

Bir dönem her iddianın kaynağını çekip aranan değeri metinde arayan bir script
çalıştırdım. İşe yaradı: bir gün ajanın gerçek bir satılık ilanını doğru
aktardığını ama **fiyatı uydurduğunu** yakaladı — ilan sayfada vardı, rakam
yoktu. Ama iki sorunu vardı. Canlı kaynaklar kayıyor: bir gün `$6,441` yazan
sayfa ertesi gün `$6,491` yazıyordu, yayınlanmış yazı kendiliğinden
"doğrulanmamış"a dönüşüyordu. İkincisi, sayfa doğrulama tablolarıyla doluyor,
okunmuyordu. Şimdilik kaldırdım; kaynakları görünür kılmanın okura daha çok
yaradığını düşünüyorum.

## Şeffaflık işaretleri

Her Radar yazısı şunları taşıyor:

- `/radar` sayfasında, serinin tamamı için tek ve net bir beyan: metni ajan
  üretiyor, ben yazmıyorum
- Her iddia için numaralı kaynak ve yazının altında tam bağlantı listesi
- Makine okunur işaretleme: IPTC
  [`trainedAlgorithmicMedia`](http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia)
  ve `creativeWorkStatus: Machine-generated`

Rozetin tek başına yeterli olmadığını biliyorum —
[araştırmalar](https://hai.stanford.edu/policy/labeling-ai-generated-content-may-not-change-its-persuasiveness)
"AI üretimi" etiketinin içeriğin ikna ediciliğini azaltmadığını gösteriyor.
Okuyucuyu koruyan şey rozet değil, hangi satırın çürük olduğunu görebilmesi.
Tablo bu yüzden yayınlanıyor.

## Radar ana akışa karışmaz

Radar bültenleri ana beslemede: [`/rss.xml`](/rss.xml).
Ana [`/rss.xml`](/rss.xml) beslemesine girmiyor — makine üretimi içeriği
istemeden abone olman mümkün değil.

## Hata bulursan

Doğrulama kapısından geçmiş ama yine de yanlış bir iddia görürsen
[depoda bir issue aç](https://github.com/cmlonder/cmlonder.github.io/issues)
veya yazının altındaki yorumlara yaz. Kapının kaçırdığı her hata, kapıya
eklenecek bir kural demek.
