---
title: "RewindBPF"
summary: "Hackathon işi: ajanı tek kullanımlık bir filesystem transaction'ı içinde çalıştır, sonra geri al ya da kabul et."
what: "Ajana dağıtabileceği bir workspace, insana da kabul edip reddedeceği bir diff veriyor."
status: "shipped"
started: 2026-07-17
updated: 2026-07-22
stack: ["Go", "eBPF", "OverlayFS", "Landlock", "cgroup v2", "Codex"]
url: "https://rewind.cmlonder.com"
repo: "https://github.com/cmlonder/rewind-bpf"
event:
  name: "OpenAI Build Week"
  url: "https://devpost.com/software/rewindbpf"
metrics:
  - label: "Gün"
    value: "6"
  - label: "Commit"
    value: "213"
  - label: "Tam zorlanan platform"
    value: "1 / 3"
order: 4
---

Altı gün, 213 commit, bir hackathon deadline'ı. Bu OpenAI Build Week için
yazıldı; ürün değil, ve sayfadaki sayılar işin gerçek boyutu. Burada duruyor
çünkü fikir hafta sonundan uzun yaşadı.

Dosya yazabilen bir ajan aynı zamanda bir kaynak klasörünü silebilir, bir
config dosyasının üzerine yazabilir ya da kimse fark etmeden bir secret
okuyabilir. Alışıldık cevap, yasaklı shell komutlarının listesi. O listenin
etrafından dolaşmak kolay, her koşumdan önce bütün projeyi kopyalamak ise
pahalı.

RewindBPF sınırın yerini değiştiriyor. Gerçek workspace değişmez bir alt
katman oluyor. Ajan birleşik görüntüyü görüp normal çalışıyor, ama bütün
yazma ve silme işlemleri tek kullanımlık bir üst katmana düşüyor. Koşum
bitince tam olarak iki sonuç var: **üst katmanı çöpe at, ya da conflict
kontrolünden geçirip kabul et.** Okuma ayrı bir policy — `.env` dosyasını
sihirli bir isim olarak koda gömmek yerine `**/*.env` veya `**/*.pem`
pattern'ini reddediyorsun.

Git bunun yerine geçmiyor, bu da Git'in yerine geçmiyor. Git, geliştiricinin
zaten commit'lediğini koruyor. Rewind ise o commit daha ortada yokken olan
koşumu koruyor; üstelik track edilmeyen ve ignore edilen dosyalar da dahil:
görseller, binary'ler, üretilmiş asset'ler, workspace içindeki her şey.

## Neyi geri almıyor

Sınır, korunan workspace içindeki dosya yollarından ibaret. Yani veritabanı
yazmalarını, cloud/API çağrılarını, network trafiğini, cihaz durumunu, kernel
değişikliklerini ve workspace dışındaki dosyaları geri almıyor.

Bir submission sayfasının genelde atladığı kısım burası. Ajan koşum sırasında
bir API'ye istek attıysa, üst katmanı çöpe atmak o isteği geri çağırmıyor.

## Gerçekten zorlanan tek platform var

Referans yol Linux: OverlayFS/FUSE copy-on-write, Landlock ile okuma
kısıtlama, eBPF filesystem telemetrisi, cgroup-v2 ile process kapsamı.
Yetki isteyen testler Ubuntu 24.04 VM'inde koşuyor.

macOS'ta APFS clone'larına dayanan native bir yol var. Local supervisor'ı,
Control Plane arayüzünü, okuma policy'sini, staged diff'i, rollback ve
commit'i çalıştırmaya yetiyor — yani demoyu laptop'ta kaydetmeye yetiyor.
eBPF veya OverlayFS zorlamasını kanıtlamıyor, ben de kanıtlıyor demiyorum.
Windows'ta sadece fail-closed bir sözleşme var, fazlası yok.

Yukarıdaki ölçüm bu yüzden "cross-platform" değil, 1 / 3 diyor.

## Ajanlar hakkında, bir ajanla yazıldı

Codex içinde, GPT-5.6 ile implementasyon ve review partneri olarak yazdım.
Altı günde 172 Go dosyası tek başına yazma hızı değil. Ajan güvenliğiyle
ilgili bir projede bunun aksini ima etmek tuhaf bir başlangıç olurdu.

Ajanlar için guardrail kuruyorsan ucuz soru "hangi komutları yasaklayacağım"
değil. Soru şu: **yazma işlemi tam olarak nereye düşüyor?** Gerisi o cevaptan
çıkıyor.
