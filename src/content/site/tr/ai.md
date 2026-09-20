---
title: 'Yapay zeka kullanımı'
description: 'Bu sitedeki "ai üretimi" işareti ne anlama geliyor, nerede görürsen gör.'
updated: 2026-09-21
---

Kısa cevap: **İşaretsiz metin benim. İşaretli metni bir ajan üretti.**
Bu işareti sitenin neresinde görürsen gör anlamı aynı; hangi bölümde
olduğu fark etmez.

## Yöntem

İşaret taşımayan her cümle bana ait. Yazarken ajan kullanıyorum: düzeltme,
araştırma, kod. Ama fikir bildiren ya da "ben" diyen her cümle benimdir;
kural [Simon Willison](https://simonwillison.net/2026/Mar/1/ai-writing/)'ınki.
AI'ın yalnızca okuyup düzelttiği yazıya işaret koymuyorum.

İşaretli içerik farklı. Onu kendi kurduğum boru hatlarıyla, kendi
belirlediğim şablon ve kurallarla üretiyorum: bir ajan birçok kaynaktan
topluyor, özetliyor ve yayına hazır metni bırakıyor. Cümleler benim değil;
konu seçimi, şablon ve kurallar benim. Bunun karşılığında iki kural var:

- İddia içeren metinlerde her iddianın kaynağı yazının içinde numarayla,
  tam bağlantısı yazının altında. Doğrulamayı okura bırakıyorum.
- Ajanın kendi "doğruladım" beyanına yer yok. URL çekemediği bir sayfa için
  bile "profilden çekildi" yazdığını gördüm; o sütun kaldırıldı.

## Büyük platformlar ne yapıyor

Aynı sorunu Meta ve YouTube da çözüyor ve ikisi de aynı yere vardı: içeriği
gizlemek değil, **kökenini görünür bir etiketle söylemek**.

**Meta** (Facebook, Instagram, Threads) AI ile üretilen paylaşımlara
"AI info" etiketi koyuyor. Mayıs 2024'te "Made with AI" adıyla başladı,
Temmuz 2024'te adı değişti. Etiket paylaşımın üstünde duruyor; tıklayınca
neyin AI olduğunu anlatan bir panel açılıyor.
[Meta'nın duyurusu](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/).

<figure class="ai-ornek">
  <img src="/img/ai/meta-ai-info.webp" width="1400" height="788" loading="lazy" decoding="async" alt="Meta’nın örnek görseli: Instagram ve Facebook’ta AI ile üretilmiş fotoğrafların köşesinde beyaz “AI info” etiketi.">
  <figcaption>Meta’nın duyurusundan: “AI info” etiketi görselin üstünde. Görsel <a href="https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/">Meta Newsroom</a>’a ait.</figcaption>
</figure>

**YouTube** yükleyenden gerçekçi görünen AI ya da değiştirilmiş içeriği beyan
etmesini istiyor; video "Altered or synthetic content" etiketi alıyor. Çoğu
videoda genişletilmiş açıklamada, sağlık, haber, seçim ve finans gibi hassas
konularda oynatıcının üstünde. Beyan edilmemişse ve yanıltma ihtimali varsa
YouTube etiketi kendisi de ekleyebiliyor. Mart 2024'ten beri yürürlükte.
[YouTube'un duyurusu](https://blog.youtube/news-and-events/disclosing-ai-generated-content/) ve [yardım sayfası](https://support.google.com/youtube/answer/14328491).

<figure class="ai-ornek">
  <img src="/img/ai/youtube-description.webp" width="800" height="744" loading="lazy" decoding="async" alt="YouTube Shorts açıklama paneli: “How this content was made” başlığı altında “Altered or synthetic content — Sound or visuals were significantly edited or digitally generated.”">
  <figcaption>YouTube’un duyurusundan: etiket genişletilmiş açıklamada. Görsel <a href="https://blog.youtube/news-and-events/disclosing-ai-generated-content/">YouTube Official Blog</a>’a ait.</figcaption>
</figure>

<figure class="ai-ornek">
  <img src="/img/ai/youtube-player.webp" width="895" height="672" loading="lazy" decoding="async" alt="İki telefon ekranı: normal videoda başlığın yanında, Shorts’ta kanal adının yanında küçük “AI” etiketi.">
  <figcaption>YouTube’un yardım sayfasından: kısa “AI” etiketi oynatıcının hemen altında ve Shorts’ta. Görsel <a href="https://support.google.com/youtube/answer/14328491">YouTube Help</a>’e ait.</figcaption>
</figure>

## Etiket

Bu sitedeki karşılığı şu: metnin tamamını bir ajan yazdıysa yazının
künyesinde, tarihin yanında kesik çizgili küçük bir işaret var: **ai üretimi**.
Konu çiplerinden şekli farklı, çünkü bu bir konu değil, köken bilgisi. Aynı
işaret liste kartlarında, içindekiler tablosunda ve menüde de çıkıyor;
gördüğün her yerde aynı şeyi söylüyor. Tıklayınca buraya geliyor.

<figure class="ai-ornek" data-kim="biz">
  <div class="ornek-kart ornek-biz" aria-hidden="true">
    <span class="ornek-baslik"></span>
    <span class="ornek-kunye">21 Eylül 2026 <span aria-hidden="true">·</span> <span class="ornek-pill">ai üretimi</span></span>
  </div>
  <figcaption>Bu site: künyede, tarihin yanında.</figcaption>
</figure>

Makine tarafı için de aynı bilgi var: işaretli sayfalarda
`<meta name="ai-disclosure" content="ai-generated">`, yazının `.md` aynasında
`AI: ai-generated` satırı, RSS ve JSON-LD'de IPTC
[`trainedAlgorithmicMedia`](http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia).

## Hata bulursan

İşaretli bir metinde yanlış bir iddia görürsen
[depoda bir issue aç](https://github.com/cmlonder/cmlonder.github.io/issues)
ya da yazının altına yorum yaz. Ajanın kaçırdığı her hata, şablona eklenecek
bir kural.
