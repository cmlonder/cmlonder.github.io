Solo Kurucu Bülteni: Dağıtımın Gücü, Otonom Büyüme Miti ve Yerel Çıkarım

date: 2026-09-16
title: Solo Kurucu Bülteni — 16 Eylül 2026
summary: Pieter Levels portföy analizi, AppAlchemy vaka incelemesinde otonom ajan mitinin çürütülmesi ve Mac Studio ile yerel token arbitraj mimarisi.
promptVersion: v7

Bugün incelediğim iki gerçek vaka, yapay zeka araçlarıyla tek gecede ürün çıkarmanın kolaylaştığı bir dönemde asıl meselenin ürün geliştirmek değil, sürdürülebilir dağıtım kanalı kurmak olduğunu gösteriyor. Pieter Levels'ın on yılı aşkın süredir koruduğu kaleyi neden neredeyse ücretsiz hale getirdiğini incelerken, 2025'te otonom büyüme vaadiyle başlayıp hızla irtifa kaybeden AppAlchemy örneğiyle ajan masallarının sahadaki sınırlarına bakıyoruz. Son bölümde ise ajanslar için yerel modellerle kurgulanabilecek pratik bir B2B arbitraj modelini ele aldım.

## Pieter Levels — Nomad List & Remote OK

Pieter Levels, tek bir PHP dosyası, yalın jQuery ve tek bir Ubuntu sunucusu üzerinde çalışan zamanlanmış betiklerle kurduğu portföyüyle solo girişimciliğin yaşayan en bilinen örneği olmaya devam ediyor. Fast-SaaS ve sektör analizlerinde portföyünün yıllık cirosunun 3 milyon dolar bandında olduğu belirtilse de bu rakam tek bir ürünün değil, Photo AI ve Interior AI dahil tüm projelerinin toplam gelirini yansıtıyor. Girişimin arkasında hiçbir kurucu ortak, yatırımcı veya bordrolu çalışan bulunmuyor; operasyonel işler dışarıdan çalışan bağımsız uzmanlarla yürütülüyor.

Levels, geçtiğimiz günlerde on yılı aşkın süredir işleyen Nomad List platformunu spam önleme amaçlı sembolik bir dolar haricinde tamamen ücretsiz hale getirdiğini duyurdu. Şehir yaşam maliyetleri ve uzaktan çalışma verilerinin yapay zeka arama motorları tarafından kolayca derlenebilir hale gelmesi, salt veri listesi satma modelini zayıflattı. Ancak Levels'ın asıl gücü veritabanı değil; yıllar içinde inşa ettiği Google alan adı otoritesi, X üzerindeki açık geliştirme kültürü ve Remote OK üzerindeki doğrudan kurumsal işveren ağıdır. Bugün sıfırdan genel bir liste sitesi açmak anlamını yitirmiş olsa da, belirli bir alana odaklanan dikey dizinlerin marka gücü hâlâ değerini koruyor.

## AppAlchemy: otonom büyüme miti

Şubat 2025'te Diego Roshardt tarafından kurulan AppAlchemy, yapay zeka kodlama araçlarıyla geliştirilen ürünlerin karşılaştığı en temel dağıtım krizini belgeliyor. Roshardt, Cursor desteğiyle iki haftada inşa ettiği bu mobil arayüz oluşturucuyu Starter Story ve YouTube yayınlarında anlatmış, ürün Ağustos 2025'te ayda 17 bin dolar net ciroya kadar ulaşmıştı. Ancak TrustMRR üzerindeki doğrulanmış canlı gelir profili, tablonun hızla tersine döndüğünü gösteriyor; işletmenin cirosu bugün 6,441 dolar seviyesine gerilemiş durumda ve zirve noktasından yüzde 62 oranında kan kaybetmiş görünüyor.

Bu vaka, özellikle kendi kendini yöneten ve büyüyen otonom ajan ordusu söyleminin sahadaki sınırlarını açıkça gösteriyor. Roshardt'ın TrustMRR profilindeki satış notunda belirttiği gibi, 2026 başında Reddit üzerindeki aktif topluluk pazarlamasını bıraktığı anda gelir düşüşe geçti. Arkasında otonom çalışan bir dağıtım mekanizması bulunmadığı için ürün Mart 2026'da 45k bedelle satışa çıkarıldı. İnternette çok konuşulan Post Bridge veya GenPPT gibi girişimleri de inceledim ancak bunlar 2024 sonbaharında kuruldukları için aradığım 2025/2026 dönemi tanımına tam olarak uymuyor.

## Mac Studio: yerel token arbitrajı

Bu bölüm doğrulanmış bir kurucu vakası değil; Apple Silicon donanım imkanları üzerine kurguladığım teknik bir mimari modeldir. Birleşik bellek mimarisine sahip bir Mac Studio Ultra donanımında llama.cpp veya MLX ile çalışan hafif modeller, şirketlerin bulut yapay zeka harcamalarını radikal biçimde düşürebilir. Yazılım ekiplerinin Claude veya GPT-4o gibi büyük modellere gönderdiği isteklerin önemli bir bölümü aslında JSON şema doğrulaması, girdi sınıflandırma veya metin temizleme gibi rutin adımlardan oluşur.

Yerel bir ters vekil olarak konumlandırılan 7 milyar parametreli bir model, bu rutin iş yükünün yüzde 70'ini sıfır API maliyetiyle çözerken sadece derin muhakeme gerektiren görevleri bulut servislerine iletir. Aylık API faturası birkaç bin doları bulan yazılım ajanslarına yönelik yerel ağ geçidi kurulumu ve optimizasyonu, 2.500 dolar tek seferlik kurulum ve 500 dolar aylık bakım retainer'ı üzerinden 10 kurumsal müşteriyle ayda 5.000 dolar düzenli nakit akışına dönüştürülebilir. Bu yaklaşım pasif bir SaaS değil, uzmanlığa dayalı ürünleştirilmiş bir teknik mimari hizmetidir.

## Bugünden çıkanlar

Yapay zeka araçları kod yazmayı ve prototip üretimini neredeyse maliyetsiz hale getirdi ancak dağıtım ve müşteri edinme hâlâ insan emeğine muhtaç. Pieter Levels'ın yalın altyapısı karmaşık framework'lerin operasyonel yükünden kaçınmanın değerini gösterirken, AppAlchemy örneği aktif pazarlama kesildiğinde ürünün tek başına yaşayamayacağını kanıtlıyor. Önümüzdeki dönemde tüketiciye dönük genel yapay zeka araçları üretmek yerine, şirketlerin bulut faturalarını ve veri işleme maliyetlerini doğrudan düşüren yerel çözümler sunmak sürdürülebilir nakit akışına ulaşmanın en gerçekçi yolunu sunuyor.

```claims
iddia | url | tarih | tür | aranacak
Pieter Levels ~3M $ ARR portföy cirosu | https://www.fast-saas.com/blog/pieter-levels-success-story/ | 2025-10-29 | İkincil vaka analizi | 3M
Pieter Levels tek kurucu ve sıfır çalışan | https://levels.io/nomad-list-founder | 2017-01-07 | Kurucunun resmi blogu | levels.io
Pieter Levels Nomads.com ücretsiz yapıldı | https://levels.io/tag/nomad-list | 2026-09-05 | Kurucunun resmi blog arşivi | nomads.com free
Diego Roshardt (AppAlchemy) lansman Şubat 2025 | https://www.starterstory.com/appalchemy-breakdown | 2025-08-19 | Kurucu mülakatı | February 2025
Diego Roshardt (AppAlchemy) zirve dönem 17K | https://www.starterstory.com/appalchemy-breakdown | 2025-08-19 | Kurucu mülakatı | 17K
Diego Roshardt (AppAlchemy) canlı ciro 6,441 | https://trustmrr.com/startup/appalchemy | 2026-09-16 | Doğrulanmış gelir platformu | 6,441
Diego Roshardt (AppAlchemy) satılık ilanı 45k | https://trustmrr.com/startup/appalchemy | 2026-09-16 | Doğrulanmış gelir platformu | 45k
Diego Roshardt (AppAlchemy) Cursor ile 2 haftada inşa | https://medium.com/@yumaueno/a-genius-who-grew-an-ai-tool-built-in-2-weeks-to-30-000-in-4-months-3c034e9c4b15 | 2025-07-21 | Kurucu mülakatı analizi | Cursor
Post Bridge kuruluş Eylül 2024 ve 35K MRR | https://www.indiehackers.com/post/tech/hitting-35k-mrr-after-struggling-to-make-money-online-for-four-years-CNVpxrwIVqxcsfZ4fERw | 2026-06-17 | Kurucu mülakatı | 35K
GenPPT ilk dönem ciro 701 | https://www.starterstory.com/genppt-breakdown | 2024-10-25 | Kurucu mülakatı | 701
Mac Studio yerel token arbitraj modeli |  | 2026-09-16 | Kurgusal teknik model | 

```
