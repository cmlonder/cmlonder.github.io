---
title: 'AI usage'
description: 'Which parts of this site I write, which parts a machine writes, and what happens when it does.'
updated: 2026-09-16
---

Short answer: **The writing is mine. [Radar](/radar) is not.**

> The Radar briefings themselves are in Turkish. This page explains the process
> in English; the mechanics are identical.

## Hangi bölüm kim tarafından yazılıyor

| Bölüm | Kim yazıyor |
|---|---|
| Yazılar, Notlar, Playbook'lar, Sinyaller, Kitaplık | Ben |
| [Radar](/radar) | Bir ajan (Gemini Spark). Ben yazmıyorum. |

Yazılarımı yazarken ajan kullanıyorum — düzeltme, araştırma, kod. Ama cümleler
ve iddialar benim, sorumluluğu da bende. Radar'da durum kategorik olarak farklı:
metni ben görmeden makine üretiyor.

## Radar nasıl çalışıyor

Günlük bir ajan görevi tek kişilik girişim vakalarını tarıyor ve yapılandırılmış
bir bülten üretiyor. Bülten iki parça halinde geliyor: **metin** ve **iddia tablosu**
(her iddia, kaynak URL'i ve kaynağın tarihi).

Yayından önce `scripts/verify-radar.mjs` çalışıyor ve **her kaynağı gerçekten
çekiyor**. Beklenen değerin o metinde geçip geçmediğine bakıyor.

| Sonuç | Anlamı |
|---|---|
| **Doğrulandı** | Kaynak çekildi, beklenen değer metinde bulundu |
| **Kaynakta yok** | Kaynak çekildi ama değer orada yok. Yakın bir sayı varsa o da raporlanıyor |
| **Kaynağa erişilemedi** | 404, zaman aşımı, ya da site engelledi |
| **Kaynak verilmedi** | Ajan URL bulamadı |
| **Doğrulanamadı** | Sayfa istemci tarafında render ediliyor, metin çıkarılamadı |
| **Kaynaksız model** | İddia değil, açıkça kurgu olduğu beyan edilen mimari öneri |

Doğrulanamayan iddialar **silinmiyor** — yazının en üstünde, gövdeden önce ayrı
bir kutuda listeleniyor. Her bültenin sonunda da tam tablo var.

## Neden ajanın kendi beyanına güvenmiyorum

Ajan başlangıçta kendi "güven derecesi" sütununu dolduruyordu. Bir turda şunu
yaptığını gördüm: erişemediği bir sayfanın adresini **tahmin etti**, tahminini bir
Google arama linkine sardı, ve tabloda *"metrik doğrudan profilden çekildi"*
yazdı. Tahmin ettiği adres 404'tü.

Ajan URL çekemiyor. Çekemediğinde bunu söylemek yerine doğruladığını iddia
ediyordu. O yüzden güven sütunu prompt'tan kaldırıldı — ajan artık yalnızca
iddia, kaynak ve tarih veriyor; karar boru hattının.

Dört tur prompt iyileştirmesinde şunlar düzeldi: uydurulmuş teknoloji yığınları,
vakaları kategoriye zorlama, etiketlenmemiş kurgu, eski ciroyu güncel gibi sunma.
Düzelmeyen tek şey buydu — çünkü talimat sorunu değil, yetenek sınırı.

## Şeffaflık işaretleri

Her Radar yazısı şunları taşıyor:

- Gövdeden önce, aynı görsel ağırlıkta bir **makine üretimi** rozeti ve
  doğrulama sayıları
- Doğrulanamayan iddiaların ayrı listesi
- Tam iddia/kaynak tablosu
- Makine okunur işaretleme: IPTC
  [`trainedAlgorithmicMedia`](http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia)
  ve `creativeWorkStatus: Machine-generated, machine-audited`

Rozetin tek başına yeterli olmadığını biliyorum —
[araştırmalar](https://hai.stanford.edu/policy/labeling-ai-generated-content-may-not-change-its-persuasiveness)
"AI üretimi" etiketinin içeriğin ikna ediciliğini azaltmadığını gösteriyor.
Okuyucuyu koruyan şey rozet değil, hangi satırın çürük olduğunu görebilmesi.
Tablo bu yüzden yayınlanıyor.

## Radar ana akışa karışmaz

Radar'ın **kendi RSS'i** var: [`/radar/rss.xml`](/radar/rss.xml).
Ana [`/rss.xml`](/rss.xml) beslemesine girmiyor — makine üretimi içeriği
istemeden abone olman mümkün değil.

## Hata bulursan

Doğrulama kapısından geçmiş ama yine de yanlış bir iddia görürsen
[depoda bir issue aç](https://github.com/cmlonder/cmlonder.github.io/issues)
veya yazının altındaki yorumlara yaz. Kapının kaçırdığı her hata, kapıya
eklenecek bir kural demek.
