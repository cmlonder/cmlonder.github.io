---
title: Künye
description: Bu sitenin arkasındaki mimari kararlar, tasarım tercihleri ve altyapı detayları.
updated: 2026-09-15
---

Bu siteyi tasarlarken temel hedefim, içeriğin doğrudan kaynak kod deposunda düz metin dosyaları olarak yaşamasıydı. Böylece yapay zekâ ajanları içerik üzerinde bağımsız ve güvenilir bir biçimde çalışabiliyor. Aşağıdaki mimari tercihler bu temel tasarım felsefesinin birer sonucudur.

## Teknoloji Yığını

Astro altyapısı üzerine kurulu statik web sitesi, her kod gönderiminde GitHub Actions aracılığıyla otomatik olarak derlenir ve GitHub Pages üzerinden yayınlanır. Sistemde harici bir veritabanı veya dinamik sunucu katmanı yer almaz.

## Tipografi

Başlık ve vurgularda **Fraunces** yazı tipi kullanılıyor. Değişken optik boyut desteği sayesinde tek bir font ailesi hem gösterişli başlıkları hem de akıcı gövde metinlerini dengeli bir biçimde karşılıyor. Arayüz elemanlarında **Lato**, kod bloklarında ise **IBM Plex Mono** tercih edildi. Tüm fontlar derleme aşamasında yerel olarak paketlenir ve harici bir sunucuya istek yapılmadan doğrudan bu alan adından sunulur.

## Renk Sistemi

Açık ve koyu temalar için özenle dengelenmiş altı temel tasarım belirteci (token) kullanılıyor. Renklerin kontrast oranları yayına alınmadan önce WCAG AA erişilebilirlik standartlarına göre test edilir. Gövde metninde yeterli kontrastı sağlamayan ikincil tonlar yalnızca dekoratif ikonlarda kullanılır.

## Ajanlar ve Makineler İçin

Sitedeki her yazının temiz bir Markdown kopyası mevcuttur. Herhangi bir adresin sonuna `.md` ekleyerek ham içeriğe doğrudan ulaşabilirsiniz. Ayrıca yapay zekâ sistemleri için bir [llms.txt](/llms.txt) özeti ve sitenin [tam içerik dizini](/llms-full.txt) sunulmaktadır. Yazı sayfaları, bu Markdown aynalarını referans gösteren JSON-LD üst verileriyle desteklenir.

## İlham ve Teşekkür

Sitenin bilgi mimarisi, tipografi hiyerarşisi ve dijital bahçe yaklaşımı büyük ölçüde [Maggie Appleton](https://maggieappleton.com)'ın çalışmalarından esinlenmiştir. İçeriklerin konuya göre değil, düşüncenin olgunluk seviyesine göre sınıflandırılması fikri bu ilhamın merkezinde yer alıyor.
