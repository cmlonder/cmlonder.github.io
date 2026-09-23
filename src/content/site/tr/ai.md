---
title: 'Yapay zeka kullanımı'
description: 'Bu sitedeki "ai üretimi" etiketinin ne anlama geldiği ve içerik üretiminde izlenen şeffaflık ilkeleri.'
updated: 2026-09-21
---

Özetle: **Etiket taşımayan yazılar doğrudan benim kalemimden çıkar. Etiketli içerikler ise yapay zekâ ajanları tarafından derlenip yayına hazırlanır.** Bu ayrım, sitenin hangi sayfasında veya hangi bölümünde olursanız olun değişmeyen temel bir ilkedir.

## Yöntem ve İlkeler

Üzerinde etiket bulunmayan her cümlenin arkasındaki fikir ve sorumluluk bana aittir. Yazım sürecinde yapay zekâ araçlarından elbette yararlanıyorum. Araştırma yaparken, kod yazarken veya metinleri gözden geçirirken modellerden destek alıyorum. Ancak özgün bir düşünceyi savunan ya da doğrudan birinci tekil şahısla kurulan her cümle kendi süzgecimden geçer. Bu yaklaşımı benimserken [Simon Willison](https://simonwillison.net/2026/Mar/1/ai-writing/)'ın ortaya koyduğu temel ilkeyi rehber ediniyorum: Yalnızca dil bilgisi veya biçimsel düzenleme için yapay zekâ desteği alan yazılara etiket koymuyorum.

Etiketli içerikler ise farklı bir kategoriye girer. Bu içerikleri, kendi tasarladığım veri akışları, editoryal kurallar ve şablonlar doğrultusunda üretiyorum. Yapay zekâ ajanları güvenilir kaynakları tarar, önemli bilgileri özetler ve yayına hazır bir taslak haline getirir. Burada cümleler doğrudan bana ait olmasa da, konu seçimi, parametreler ve kalite sınırları benim belirlediğim kurallara dayanır. Bu şeffaflığın gereği olarak iki değişmez kural uyguluyorum:

- İddia içeren metinlerde öne sürülen her bilginin kaynağı yazı içinde numaralandırılır ve tam bağlantısı sayfa sonunda açıkça paylaşılır. Böylece doğrulamayı her zaman okurun kendi değerlendirmesine bırakırım.
- Ajanların kendi kendine sunduğu "doğrulandı" beyanlarına kesinlikle yer verilmez. Modellerin erişemediği bir sayfa hakkında dahi yanıltıcı kaynak bildiriminde bulunabildiğini deneyimlediğim için bu tür otomatik onay adımlarını süreçten tamamen çıkardım.

## Büyük Platformların Yaklaşımı

Aynı şeffaflık ihtiyacı küresel ölçekte Meta ve YouTube gibi dev platformlar tarafından da ele alınıyor. Her iki platform da içerikleri gizlemek veya kısıtlamak yerine, **içeriğin kökenini görünür bir etiketle belirtme** yolunu seçti.

**Meta** (Facebook, Instagram, Threads), yapay zekâ ile üretilen veya manipüle edilen paylaşımlara "AI info" etiketi yerleştiriyor. Mayıs 2024'te "Made with AI" adıyla başlatılan uygulama, Temmuz 2024'te güncellenerek bugünkü adını aldı. Gönderinin üst kısmında yer alan bu etikete tıklandığında, içeriğin hangi bileşenlerinde yapay zekâ kullanıldığını açıklayan bilgilendirici bir panel açılıyor. Ayrıntılar için [Meta'nın resmi duyurusu](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/) incelenebilir.

<figure class="ai-ornek">
  <img src="/img/ai/meta-ai-info.webp" width="1400" height="788" loading="lazy" decoding="async" alt="Meta’nın örnek görseli: Instagram ve Facebook’ta AI ile üretilmiş fotoğrafların köşesinde beyaz “AI info” etiketi.">
  <figcaption>Meta’nın duyurusundan: “AI info” etiketi görselin üstünde. Görsel <a href="https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/">Meta Newsroom</a>’a ait.</figcaption>
</figure>

**YouTube**, içerik üreticilerinden gerçekçi görünen yapay zekâ çıktılarını ya da sentetik içerikleri yükleme esnasında beyan etmelerini istiyor. Bu videolar "Altered or synthetic content" etiketiyle işaretleniyor. Çoğu videoda bu bilgi genişletilmiş açıklama alanında görünürken, sağlık, haber, seçimler ve finans gibi hassas alanlarda doğrudan video oynatıcısının üzerinde yer alıyor. Beyan edilmemiş ve izleyiciyi yanıltma ihtimali bulunan videolarda YouTube etiketi kendisi de ekleyebiliyor. Konuyla ilgili detaylar [YouTube duyurusu](https://blog.youtube/news-and-events/disclosing-ai-generated-content/) ve [yardım sayfası](https://support.google.com/youtube/answer/14328491) üzerinde paylaşılmıştır.

<figure class="ai-ornek">
  <img src="/img/ai/youtube-description.webp" width="800" height="744" loading="lazy" decoding="async" alt="YouTube Shorts açıklama paneli: “How this content was made” başlığı altında “Altered or synthetic content — Sound or visuals were significantly edited or digitally generated.”">
  <figcaption>YouTube’un duyurusundan: etiket genişletilmiş açıklamada. Görsel <a href="https://blog.youtube/news-and-events/disclosing-ai-generated-content/">YouTube Official Blog</a>’a ait.</figcaption>
</figure>

<figure class="ai-ornek">
  <img src="/img/ai/youtube-player.webp" width="895" height="672" loading="lazy" decoding="async" alt="İki telefon ekranı: normal videoda başlığın yanında, Shorts’ta kanal adının yanında küçük “AI” etiketi.">
  <figcaption>YouTube’un yardım sayfasından: kısa “AI” etiketi oynatıcının hemen altında ve Shorts’ta. Görsel <a href="https://support.google.com/youtube/answer/14328491">YouTube Help</a>’e ait.</figcaption>
</figure>

## Bu Sitedeki Etiket Sistemi

Bu yaklaşımın sitemizdeki karşılığı son derece yalındır: Bir yazının metin gövdesi yapay zekâ ajanı tarafından kaleme alınmışsa, sayfa künyesinde tarihin hemen yanında kesikli çerçeveye sahip özel bir işaret yer alır: **ai üretimi**. Bu rozet konu etiketlerinden görsel olarak farklıdır çünkü bir temayı değil, doğrudan içeriğin üretim kökenini temsil eder. Aynı işaret liste kartlarında, menüde ve içindekiler tablosunda da karşınıza çıkar ve tıklandığında bu bilgilendirme sayfasına yönlendirir.

<figure class="ai-ornek" data-kim="biz">
  <div class="ornek-kart ornek-biz" aria-hidden="true">
    <span class="ornek-baslik"></span>
    <span class="ornek-kunye">21 Eylül 2026 <span aria-hidden="true">·</span> <span class="ornek-pill">ai üretimi</span></span>
  </div>
  <figcaption>Bu site: künyede, tarihin yanında.</figcaption>
</figure>

Aynı şeffaflık makine ve tarayıcı seviyesinde de sürdürülür. İşaretli sayfalarda `<meta name="ai-disclosure" content="ai-generated">` etiketi, yazının ham Markdown aynasında `AI: ai-generated` satırı ve RSS ile JSON-LD veri yapılarında IPTC standardına uygun [`trainedAlgorithmicMedia`](http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia) tanımı bulunur.

## Hata Bildirimi ve Geri Bildirim

İşaretli bülten veya yazılarda olgusal bir hata ya da yanıltıcı bir bilgi fark ederseniz, lütfen [GitHub deposu üzerinden bir issue açarak](https://github.com/cmlonder/cmlonder.github.io/issues) veya yazının altına yorum bırakarak bana iletin. Ajanların gözünden kaçan her hata, üretim şablonlarını ve editoryal kurallarımızı daha dayanıklı hale getirmemize yardımcı olur.
