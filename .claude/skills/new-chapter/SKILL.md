---
name: new-chapter
description: Bir domain'e sunum destekli bölüm ekler. Kullanıcı domain adı, başlık, sunum PDF'i ve brifing metni verdiğinde kullan — NotebookLM brifingi + slayt destesini tek bir bölüme dönüştürür. "Bölüm ekle", "havacılığa bunu ekle", "şu sunumu yazıya çevir" gibi isteklerde tetiklenir.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Sunum destekli bölüm ekle

Girdi dört parça: **domain**, **başlık**, **sunum PDF'i**, **brifing metni**.
Eksik olanı sor, uydurma.

Çıktı tek bir bölüm dosyası. **Ayrı bir sunum sayfası ya da sayfa sonunda
slayt galerisi YOK** — slaytlar yazının içine, anlattıkları yerin yanına
girer. Sunumun tamamı yazıya dağılır; PDF indirme bağlantısı verilmez.

## 1. Domain'i doğrula

```bash
ls src/content/domains/tr/ src/content/domains/en/
```

Domain yoksa **dur ve sor**. Yeni domain açmak bu skill'in işi değil.

Bölümün outline'daki yerini seç: `src/content/domains/<dil>/<domain>.md`
içindeki `outline` listesine bak, hangi `part` altına ve kaçıncı sıraya
gireceğine karar ver. Tarihsel/temel anlatı genelde başa gider.

## 2. Slaytları üret

```bash
pnpm deck <deck-slug> <pdf-yolu>
```

`deck-slug` kebab-case ve bölüm slug'ından bağımsız olabilir (bir deste
birden fazla bölümde kullanılabilir). Script `public/decks/<slug>/` altına
`NN.webp`, `NN@800.webp` ve `slides.json` yazar, sonra yapıştırılacak
markdown satırlarını basar.

## 3. Slaytları OKU

NotebookLM PDF'lerinde **metin katmanı yoktur** — her sayfa tek bir görsel.
Üretilen `public/decks/<slug>/NN.webp` dosyalarının **hepsini Read ile aç**
ve ne anlattıklarını çıkar. Bunu atlama: alt metnini ve altyazıyı slayta
bakmadan yazamazsın, uydurursan yanlış olur.

Her slayt için iki şey üret:

- **alt**: slaytta ne olduğunu anlatan cümle(ler). Ekran okuyucu bunu
  okuyacak; "slayt 4" demek yetmez, içindeki bilgiyi anlat.
- **altyazı** (`title`): slaytın yanına düşecek TEK cümle. Slaytı tekrar
  etme — okuyucunun dikkatini nereye çekmek istediğini söyle.

## 4. Bölümü yaz

Yol: `src/content/chapters/<dil>/<domain>/<slug>.md`

```yaml
title:       # başlık (kullanıcının verdiği)
domain:      # 1. adımdaki domain
summary:     # tek cümle, standfirst olarak çıkıyor
pubDate:     # bugün — `date +%F`, tahmin etme
topics:      # src/config.ts TOPICS enum'undan; uydurma
ai: generated   # ZORUNLU, metni makine yazdıysa; künyede "ai üretimi" işareti çıkarır
crossRef:    # opsiyonel: başka domain'de kardeş bölüm varsa
```

`ai: generated` künyede tarihin yanında "ai üretimi" işareti çıkarıyor;
araç adı yazıya girmiyor, /ai sayfası anlatıyor. Metin makineden geldiyse
**atlanmaz** — radar'daki kuralın aynısı.

Gövde kuralları:

- Brifingi olduğu gibi aktarma. Q&A yapısını düz anlatıya çevir,
  alıntıları kendi cümlelerinin içine yerleştir, "Aksiyon Alınabilir
  Öngörüler" bölümünü yazının sonundaki çıkarım başlığına dönüştür.
- Her `##` başlığı bir iddia taşısın, konu adı olmasın.
- Sayı ve tarih brifingden gelir. Brifingde olmayan sayıyı yazma.
- Kapanış: okuyucunun yarın uygulayabileceği çıkarımlar. Motivasyon yok.

Slaytı şu satırla yerleştir — tek başına, boş satırlarla ayrılmış:

```markdown
![Alt metni](/decks/<deck-slug>/04.webp "Altyazı cümlesi.")
```

Gerisini `plugins/remark-slides.mjs` yapar: `<figure class="slide">`,
`srcset`, `width`/`height`, `<figcaption>`. **Elle `<figure>` yazma.**

Yerleştirme: slayt, anlattığı paragrafın hemen ardına. Arka arkaya iki
slayt konabilir ama üç konmaz — arada metin olmalı, yoksa galeri olur.
Sunumun sırası yazının sırası değildir; slaytı konunun geçtiği yere koy.

## 5. Outline'a ekle

`src/content/domains/tr/<domain>.md` **ve** `en/<domain>.md` içindeki
`outline` listesine gir. Bölüm tek dilde yazıldıysa bile **iki outline'a
da** ekle: yazılmamış dilde "sözü verilmiş bölüm" olarak görünür, site
bunu zaten destekliyor.

```yaml
  - slug: <bölüm-slug>
    title: "<o dildeki başlık>"
    promise: "<bölüm yazılmamışken görünecek vaat — tek cümle>"
    part: "<mevcut part adlarından biri>"
```

## 6. Doğrula

```bash
pnpm verify
```

Eklenti iki şeyi build zamanı zorlar, ikisi de hata verir:

- alt metni boş slayt
- `slides.json`'da olmayan slayt numarası

`check-build.mjs` ayrıca `/decks/` altındaki eksik görselleri yakalar.
Build geçmeden bitirme.

## Kurallar

- **PDF'i repoya koyma, indirme bağlantısı verme.** Slaytlar WebP olarak
  duruyor; 11 MB'lık PDF'in sitede işi yok.
- Sunumdaki her slaytı kullanmak zorunda değilsin. Anlatıya hizmet
  etmeyen slaytı atla — ama atladığını kullanıcıya söyle.
- Kapak slaytı genelde girişten sonra iyi durur; gerisi konuya göre.
- Çeviriyi kullanıcı istemedikçe üretme.
