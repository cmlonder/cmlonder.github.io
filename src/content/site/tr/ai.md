---
title: 'Yapay zeka kullanımı'
description: 'Bu sitede AI ile üretilen içerik nasıl işaretleniyor ve neden böyle.'
updated: 2026-09-21
---

Kısa cevap: **Yazılar benim. [Radar](/radar) ise AI ile derlenmiş özetler;
onları ben yazmıyorum.**

## Yöntem

Yazı, not, kılavuz ve raflardaki her cümle bana ait. Yazarken ajan
kullanıyorum: düzeltme, araştırma, kod. Ama fikir bildiren ya da "ben" diyen
her cümle benimdir; kural [Simon Willison](https://simonwillison.net/2026/Mar/1/ai-writing/)'ınki. Bu yazılara işaret
koymuyorum.

Radar farklı. İlgimi çeken konularda günlük bültenleri kendi kurduğum boru
hatlarıyla, kendi belirlediğim şablon ve kurallarla üretiyorum. Metni bir ajan
yazıyor: birçok kaynaktan topluyor, özetliyor, yayına hazır dosyayı bırakıyor.
Arada okuyan ya da düzelten kimse yok. Bunun karşılığında iki kural var:

- Her iddianın kaynağı yazının içinde numarayla, tam bağlantısı yazının
  altında. Doğrulamayı okura bırakıyorum.
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

<figure class="ai-ornek" data-kim="meta">
  <div class="ornek-kart" aria-hidden="true">
    <div class="ornek-bas"><span class="ornek-avatar"></span><span class="ornek-ad">bir hesap</span><span class="ornek-zaman">2 sa</span></div>
    <div class="ornek-govde"></div>
    <div class="ornek-etiket"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg> <span>AI info</span></div>
  </div>
  <figcaption>Meta: paylaşımın başlığında "AI info" etiketi. Şematik çizim, ekran görüntüsü değil.</figcaption>
</figure>

**YouTube** yükleyenden gerçekçi görünen AI ya da değiştirilmiş içeriği beyan
etmesini istiyor; video "Altered or synthetic content" etiketi alıyor. Çoğu
videoda genişletilmiş açıklamada, sağlık, haber, seçim ve finans gibi hassas
konularda oynatıcının üstünde. Beyan edilmemişse ve yanıltma ihtimali varsa
YouTube etiketi kendisi de ekleyebiliyor. Mart 2024'ten beri yürürlükte.
[YouTube'un duyurusu](https://blog.youtube/news-and-events/disclosing-ai-generated-content/) ve [yardım sayfası](https://support.google.com/youtube/answer/14328491).

<figure class="ai-ornek" data-kim="youtube">
  <div class="ornek-kart" aria-hidden="true">
    <div class="ornek-bas"><span class="ornek-avatar"></span><span class="ornek-ad">bir kanal</span><span class="ornek-zaman">1,2 Mn görüntüleme</span></div>
    <div class="ornek-govde"></div>
    <div class="ornek-etiket"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg> <span>Altered or synthetic content<span class="ornek-alt">Sound or visuals were significantly edited or digitally generated.</span></span></div>
  </div>
  <figcaption>YouTube: açıklama bölümünde iki satırlık etiket. Şematik çizim, ekran görüntüsü değil.</figcaption>
</figure>

## Etiket

Bu sitedeki karşılığı şu: metnin tamamını bir ajan yazdıysa yazının
künyesinde, tarihin yanında kesik çizgili küçük bir işaret var: **ai üretimi**.
Konu çiplerinden şekli farklı, çünkü bu bir konu değil, köken bilgisi.
Radar bültenleri ve NotebookLM brifinginden çıkan domain bölümleri bu
işareti taşıyor; menüde Radar'ın adının yanında da duruyor. Tıklayınca
buraya geliyor.

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

Yanlış bir iddia görürsen
[depoda bir issue aç](https://github.com/cmlonder/cmlonder.github.io/issues)
ya da yazının altına yorum yaz. Ajanın kaçırdığı her hata, şablona eklenecek
bir kural.
