# Ne, nereye yazılır

Bu dosya sitenin bir parçası değil — repoda duruyor, yayınlanmıyor. Amacı tek
bir soruyu hızlıca cevaplamak: *elimdeki şey hangi bölüme ait?*

Teknik sözleşme (frontmatter alanları, zorunlu başlıklar) [AGENTS.md](./AGENTS.md)'de.
Burada olan şey editoryal: **ne yazılır, ne yazılmaz.**

---

## Önce: hangi bölüm?

Bölümler konuya göre değil, **düşüncenin ne kadar bittiğine** göre ayrılmış.
Aynı konu bugün sinyal, altı ay sonra not, bir yıl sonra yazı olabilir. Bu bir
hata değil, sistemin çalışma şekli.

```
Elinde ne var?
│
├─ Bir link, ve onun hakkında söyleyecek 1-2 cümlen  →  SIGNAL
│
├─ Yarım bir fikir, henüz emin değilsin              →  NOTE
│
├─ Birden fazla kez verdiğin bir karar               →  PLAYBOOK
│
├─ Savunmaya hazır olduğun bir iddia                 →  ESSAY
│
└─ Okuduğun ve tavsiye ettiğin bir kitap             →  LIBRARY
```

**Emin değilsen aşağıdan başla.** Bulgu yazmak beş dakika, yazı yazmak bir
hafta. Yanlış bölüme koymanın maliyeti, hiç yazmamanın maliyetinden düşük.

---

## Signals — link + iki cümle

**Ne için:** Bir şey okudun, önemli buldun, ama hakkında bir yazı yazacak kadar
söyleyecek sözün yok.

**Uzunluk:** 100 kelimeden az. İki cümle ideal.

**Başlık kuralı:** Kaynağın başlığını kopyalama. *Senin* ne gördüğünü söyle.

| Kaynak başlığı | Kötü başlık | İyi başlık |
|---|---|---|
| "Building effective agents" | Building effective agents | Workflow mu agent mı, ve bu ayrım neden önemli |

**Gövdede ne olmalı:** Özet değil, **yorum**. Kaynak zaten orada duruyor;
okuyucu oraya tıklayabilir. Senin katkın "bunu neden paylaştım".

Katılmadığın bir yer varsa onu söyle. Sinyali değerli kılan tam olarak o.

**Ne yazma:**
- Kaynağın özeti ("Bu yazıda X anlatılıyor...")
- "İlginç bir okuma" gibi içi boş cümleler
- Okumadığın bir şey

**Ritim:** Haftada 2-5 tane. Bu bölüm sitenin nabzı; boş kalırsa site ölü
görünür.

---

## Notes — sesli düşünme

**Ne için:** Bir şeyi henüz çözemedin ama düşünmeye başladın. Not yazmak,
anlayıp anlamadığını test etme yöntemi.

**Uzunluk:** 200-800 kelime.

**Olgunluk aşaması** (`status` alanı) dürüst olmalı:

| Aşama | Ne demek |
|---|---|
| `seedling` | Yeni fikir, muhtemelen yanlış. Çoğu not burada kalır ve bu normal. |
| `budding` | Birkaç kez geri dönüp düzelttin, şekillenmeye başladı. |
| `evergreen` | Artık güveniyorsun. Yazıya dönüşmeye aday. |

**Notu iyi yapan şey:** Emin olmadığını söylemek. "Bunu çözemedim", "burada
yanılıyor olabilirim", "şunu anlamıyorum" cümleleri notun en değerli kısmıdır.
Bir yazıda zayıflık olan şey, notta dürüstlüktür.

**Not güncellenebilir.** Fikrin değişince yeni not açma — aynı notu düzelt,
`status` ve `updatedDate` alanlarını güncelle. Değişimin kendisi içerik.

**Ne yazma:**
- Bitmiş gibi davranan yarım fikir. Yarımsa yarım olduğunu söyle.
- Başkasının fikrinin özeti (o bir sinyal)

---

## Playbooks — tekrar eden karar

**Ne için:** Aynı kararı ikinci kez verdiğinde. İlk kez veriyorsan playbook
değil, not.

**Uzunluk:** 500-1500 kelime. Şablon sabit:

```
## Problem      — Hangi durumda bu sayfaya bakılır
## Context      — Hangi ölçek, teknoloji ve sınırlar içinde geçerli
## Approach     — Ne yapılır, hangi sırayla
## Tradeoffs    — Bu kararın maliyeti ne
## When this stops working   — Hangi noktada bu playbook artık yanlış
```

**Son başlığı asla atlama.** Playbook'u dürüst kılan o. Her mimari karar bir
ölçekte doğru, başka bir ölçekte yanlıştır; sınırı söylemeyen tavsiye zararlıdır.

**`problem` ve `context` alanları tek cümle olmalı.** Bunlar karar ağacında ve
kart üzerinde görünüyor:
- `problem`: okuyucunun *yaşadığı* durum — "Veritabanı doyuyor ve ekip sharding öneriyor."
- `context`: nerede geçerli — "Tek bölgeli OLTP Postgres, ~2 TB altı, okuma ağırlıklı."

**`symptoms` alanı** karar ağacını besler. Okuyucunun gördüğü **belirtiyi** yaz,
teşhisi değil:

| Kötü (teşhis) | İyi (belirti) |
|---|---|
| "Okuma replikası gerekiyor" | "Okumalar yavaş, yazmalar normal" |
| "N+1 sorgu problemi" | "Sayfa yavaş ama tek sorgu hızlı görünüyor" |

Aynı belirti birden fazla playbook'ta geçebilir — zaten olması gereken bu.

**`tryFirst`** kaba bir sıra: en ucuz/en az riskli çözüm küçük sayı alır.

---

## Essays — savunmaya hazır iddia

**Ne için:** Bir konuda fikrin oturdu ve birini ikna etmek istiyorsun.

**Uzunluk:** 1000+ kelime. Kısa olacaksa muhtemelen nottur.

**Bir essay'in olması gereken:** Tek bir iddia. "X hakkında düşünceler" değil,
"X şöyledir ve nedeni budur."

Başlık iddiayı taşımalı:

| Kötü | İyi |
|---|---|
| Mikroservisler üzerine | Servis sınırların aslında ekip sınırların |
| AI ve kod kalitesi | Üretim bedavaysa asıl iş inceleme |

**Yapı önerisi** (kural değil):
1. Okuyucunun tanıdığı bir durum — "her ekip aynı tartışmayı yapar"
2. Yaygın cevap ve neden yetersiz olduğu
3. Senin iddian
4. Kanıt: ölçüm, kod, simülasyon, ya da başına gelen şey
5. İddianın sınırı — nerede geçerli değil

**En güçlü kanıt kendi deneyimin.** İkinci en güçlüsü çalıştırılabilir bir şey:
sayı, ölçüm, interaktif simülasyon. En zayıfı başkasının iddiasına atıf.

**İnteraktif açıklayıcı** ekleyebilirsin — bir ilişkiyi görünür kılıyorsa
değerli, süs olacaksa zararlı. Nasıl ekleneceği AGENTS.md'de.

**Ne yazma:**
- "Ultimate Guide to X", "Everything You Need to Know About X"
- Kimsenin itiraz etmeyeceği iddia. İtiraz edilemiyorsa yazmaya değmez.
- Mevcut işvereninle ilgili tanınabilir detay

---

## Raflar — Kitaplık, Filmler, Oyunlar

Üçü aynı şablonu paylaşıyor, alanları farklı: kitabın `author`'ı,
filmin `director`'ı, oyunun `developer`'ı var.

```yaml
---
title: "Factorio"
developer: "Wube Software"     # kitapta author, filmde director
year: 2020
status: "done"                 # done | queued
rating: 5                      # 1-5, isteğe bağlı
note: "Kartta görünen tek cümle: neden burada."
tags: ["sistem", "darboğaz"]
platform: "PC"                 # filmde runtime, kitapta pages
hours: 310
order: 1
---

Gövde metni İNCELEMEDİR. Tekil sayfada bu render ediliyor.
```

**`note` ile gövde farklı işler yapıyor.** `note` kartta görünen tek
cümle — neden bu rafta olduğunu söylüyor. Gövde ise incelemenin kendisi;
tekil sayfada okunuyor. Gövde boş bırakılabilir, kart yine çalışır.

**`status: queued`** öğeyi "Sırada" bölümüne düşürüyor: okumadıkların,
izlemediklerin, oynamadıkların. Maggie'nin *antilibrary* fikri bu — ama
ayrı bir koleksiyon yerine her rafın içindeki bir durum, böylece üç
ortama da genelleşiyor. Sıradakiler soluk gösteriliyor; niyet bir eksik
listesi değil, **bilmediklerini görünür tutmak**.

`rating` zorunlu değil. Vermezsen hiç gösterilmiyor — emin olmadığın
şeye puan vermek zorunda değilsin.

Kitap eklendikten sonra `pnpm covers` çalıştır: Open Library'den kapağı
indirip `src/assets/covers/<slug>.jpg` olarak kaydeder. Zaten varsa
dokunmaz. Çıktıdaki `~` işaretli satırlar başlığın birebir tutmadığını
gösterir — gözden geçir, yanlış kitabın kapağı gelmiş olabilir.

**Film ve oyunlarda kapak görseli yok** ve bu bilinçli: afiş telifi
serbest değil, indirip dağıtmak doğru olmaz. Onlar tipografik kapağa
düşüyor — başlık, yapımcı ve başlıktan türeyen sabit bir ton. Aynı öğe
her zaman aynı tonu alıyor.

---|---|
| "Dağıtık sistemlerin temellerini anlatan klasik bir eser." | "Dağıtık sistemleri folklor değil mühendislik gibi hissettiren tek kitap." |

Beğenmediğin kitabı koyma. Liste bir filtre; her ekleme filtreyi zayıflatır.

Kitap eklendikten sonra `pnpm covers` çalıştır: Open Library'den kapağı
indirip `src/assets/covers/<slug>.jpg` olarak kaydeder. Zaten varsa
dokunmaz. Çıktıdaki `~` işaretli satırlar başlığın birebir tutmadığını
gösterir — onları gözden geçir, yanlış kitabın kapağı gelmiş olabilir.

Kapak bulunamazsa sorun değil: kart tipografik kapağa düşer.

---

## Sabit sayfalar

| Sayfa | Ne |
|---|---|
| `/now` | Şu anda dikkatini ne çekiyor. Özgeçmiş değil, **anlık görüntü**. Üç ayda bir güncelle; eskimişse zararlı. |
| `/about` | Kim olduğun ve sitenin neden var olduğu. Kısa tut. |
| `/uses` | Araçlar. Asıl değerli kısım ajan kurulumu — donanım listesi kimseyi ilgilendirmiyor. |
| `/colophon` | Site nasıl yapıldı. Agentic iddianı destekleyen kanıt. |

---

## Konular (topics)

Altı sabit sütun var ve **yenisi uydurulamaz** — şema zorlar, build patlar.

| Konu | Ne girer |
|---|---|
| `agentic-development` | Ajanlarla uçtan uca geliştirme, harness, context, workflow |
| `solution-architecture` | Sınırlar, sözleşmeler, tasarım kararları, tradeoff'lar |
| `scale-and-performance` | Darboğaz, kapasite, gecikme, kuyruk, veritabanı |
| `solo-company` | Kendi işini kurma, bağımsızlık, küçük kalma |
| `ai-news` | Sektörde olan biten, çoğunlukla sinyal olarak |
| `use-case` | Kendi projelerin, somut uygulamalar |

Bir girdi birden fazla konu taşıyabilir; iki-üç iyi, beş fazla.

Serbest etiket gerekiyorsa `tags` alanı var (`kafka`, `postgres`,
`claude-code`). Konular sabit taksonomi, etiketler serbest.

---

## Bağlantı kurmak

Bu bir bahçe, arşiv değil. Bahçeyi bahçe yapan şey yazıların birbirine
bağlanması — yoksa elinde tarih sırasına dizilmiş bağımsız yazılar kalır.

**Yeni yazı yazarken en az bir eski yazıya bağlan.** Zorlama; doğal bir
yer yoksa bağlanma. Ama genellikle vardır:

- Bir iddiayı savunurken daha önce anlattığın somut vakaya
- Bir kararı anlatırken o kararın çıktığı playbook'a
- Bir sinyali paylaşırken o konudaki kendi denemene

Bağlantı **site içi yol** olarak yazılır, tam URL olarak değil:

    ✅ [okuma replikaları](/playbooks/read-replicas-before-sharding)
    ❌ [okuma replikaları](https://cmlonder.com/playbooks/read-replicas-before-sharding)

Site içi yol, `Buraya bağlananlar` bölümünü besliyor: bağlandığın yazının
altında senin yazın görünüyor. Tam URL yazarsan bu bağ kurulmuyor.

**Türkçe yazı Türkçe yazıya bağlanır.** `/tr/` ile başlayan yollar ayrı bir
ağ; Türkçe bir nottan `/essays/...` (İngilizce) adresine bağlanırsan
backlink oluşmaz.

Eski bir yazıya geri dönüp yeni yazına bağlantı eklemek de meşru — bahçede
yazılar donmuyor. `updatedDate` alanını güncellemeyi unutma.

---

## Olgunluk (status) — yalnızca Notes

Notlarda bir olgunluk seviyesi var ve listede üç çubuklu bir rozetle
görünüyor. Varsayılan `seedling`.

| Seviye | Ne demek | Ne zaman yükseltilir |
|---|---|---|
| `seedling` (Filiz) | Ham. Fikir var, savunma yok. Yanlış olabilir | — |
| `budding` (Fidan) | Bir kez gözden geçirildi, örnekleri oturdu | Geri dönüp düzelttiğinde |
| `evergreen` (Kökleşmiş) | Arkasında duruyorsun, bir yıl sonra da geçerli | Zaman testinden geçtiğinde |

**Neden sadece notlarda:** koleksiyonların kendisi zaten bir olgunluk
ekseni — sinyal (link + iki cümle) → not (sesli düşünme) → playbook
(tekrar eden karar) → deneme (savunmaya hazır iddia). Bir denemeye
"Fidan" demek çelişki olurdu; deneme tanımı gereği bitmiş. Olgunluk
seviyesi notların *içindeki* ikinci eksen, çünkü not olgunlaşır ve
olgunlaştığında ya playbook'a ya denemeye dönüşür.

Rozet okura dürüst bir uyarı. **Yükseltmek için geri dönüp notu gerçekten
düzeltmen gerekiyor** — tarih geçmesi yetmez. Çoğu not Fidan olarak kalır
ve bu normal; bahçenin tamamı Kökleşmiş olsaydı sesli düşünmeye yer
kalmazdı.

---

## Şu An (/now) — silme, ekle

`/now` bir "şu anda ne yapıyorum" sayfası değil, bir **dikkat arşivi**.
Klasik now sayfaları güncellenince eskisini siler; bu sayfa siler değil,
üstüne ekler. Zamanla neye baktığının kaydı oluyor.

Yeni girdi eklerken:

1. Giriş paragrafından **hemen sonra** yeni bir ay başlığı aç:
   `## Ekim 2026`
2. Altına `###` ile kısa bölümler yaz. Başlıklar sabit değil — o ay ne
   varsa o: `Ne yapıyorum`, `Okuduğum`, `Takıldığım şey`, `Vazgeçtiğim`.
3. **Eski ayları silme.** Aşağıda kalsınlar.
4. Frontmatter'daki `updated` tarihini güncelle.

En üstteki ay otomatik olarak vurgulu renkte görünüyor; alt taraf
soluklaşıyor. Yani hiçbir şey yapmadan "en yeni bu" sinyali veriliyor.

Girdiler kısa olsun — iki üç cümle. Uzun bir şey yazacaksan o zaten bir
not ya da deneme.

---

## Dil

İngilizce varsayılan, Türkçe opsiyonel. **Her yazının Türkçesi olmak zorunda
değil** — aynı slug iki dilde varsa site otomatik bağlar, yoksa yazı tek dilde
yaşar.

Çeviri yaparken çevirme, **o dilde yeniden yaz.** Birebir çeviri iki dilde de
kötü okunur.

---

## Genel ton

Bu sitenin sesi, [seangoedecke.com](https://www.seangoedecke.com)'a yakın olmayı
hedefliyor: büyük şirkette çalışan biri, ne gördüğünü sakin ve spesifik
anlatıyor, satış yapmıyor.

Kaçınılacaklar:
- Pazarlama dili ("devrim niteliğinde", "oyun değiştirici")
- Kimsenin itiraz etmeyeceği genellemeler
- Mevcut işvereni tanınabilir kılan detay
- Yapmadığın bir şeyi yapmış gibi anlatmak

Aranacaklar:
- Somut sayı ve isim: "p99 400ms'ti" > "yavaştı"
- Kendi hatan: en çok okunan yazılar genelde bunlar
- İddianın sınırı: "bu şu ölçeğin altında doğru"
