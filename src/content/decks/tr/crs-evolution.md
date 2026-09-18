---
title: "Havacılıkta Rezervasyon Sistemlerinin Evrimi"
source: "NotebookLM"
pdf: "/decks/crs-evolution.pdf"
pdfSize: "10.9 MB"
transcript: "agent"
slides:
  - n: 1
    title: "Havacılıkta Rezervasyon Sistemlerinin Evrimi"
    notes: "Sunum, havayolu BT ekosisteminin temel tarihini kapsıyor. Modern gelir yönetimi ve teklif/sipariş kavramlarına girmeden önce sektörün manuel defterlerden merkezi bilgisayarlı rezervasyon sistemine (Host CRS) nasıl geçtiğini anlamak gerekiyor. Host CRS, bütün modern havayolu envanteri ve yolcu akışları için merkezi yürütme motoru."
  - n: 2
    title: "Başlangıç: odak noktası yolcu değil, postaydı"
    notes: "Alan terimleri: kapasite, envanter kontrolü, uygunluk durumu (availability), faydalı yük (payload). 1925 Kelly Act ile posta ofisi tekeli bitti, hava posta hizmeti özel şirketlere açıldı. Posta uçaklarında ticari yolcu için tek bir koltuk ayrılıyordu; yolcu kalkış şehrini arıyor, koltuk boşsa rezervasyon yapılıyordu. Uçağın faydalı yükü kargo için optimize edildiğinden yolcu envanteri kalıntı (residual) bir yan üründü. Modern terimle bu, fiziksel alanın sınırladığı sabit bir kontenjan (allotment) modeli; birincil gelir devlet posta sözleşmeleri olduğu için getiri (yield) kavramı henüz yok."
  - n: 3
    title: "Sıkı yönetim dönemi: Sivil Havacılık Kurulu (CAB)"
    notes: "1938-1970'ler. CAB rotaları, tarifeleri ve birleşmeleri mikro düzeyde yönetti: hangi havayolunun hangi rotada uçacağı ve her rotanın bilet fiyatı devletçe belirlendi. Fiyat rekabeti yasak olduğu için havayolları yalnızca operasyonel verimlilik ve hizmet kalitesiyle öne çıkabiliyordu. Tarifeler sabit olduğundan dinamik fiyatlandırma yeteneği yoktu; ne zaman rezervasyon yaparsanız yapın koltuğun fiyatı aynıydı. Getiri yönetimi, 1970'lerin sonundaki deregülasyon yasası CAB'nin fiyat kontrolünü kaldırana kadar gerçek anlamda var olamadı."
  - n: 4
    title: "1930'lar: manuel envanter kontrolünün evrimi"
    notes: "Alan terimleri: uçuş bacağı bazlı envanter (leg-based inventory), AVS, stop sale. Eski yöntem talep ve yanıt (request and reply): acente kalkış şehrini arar, boş yer sorar, onay gelince PNR kartına yazılır ve teletiple iletilir. Yavaş, telefon trafiği ağır. Yeni yöntem sat ve bildir (sell and report, 1939 Boston): uçak dolana kadar acenteler serbestçe satar, eşik aşılınca satışı durdur (stop sale) mesajı yayınlanır ve sistem eski mantığa döner. Teknik olarak bu, her satışta senkron kilit yerine asenkron nihai tutarlılık (eventual consistency) modeli. Bu mesaj, bugünkü GDS dağıtımında hâlâ kullanılan AVS mesajlarının büyükbabası."
  - n: 5
    title: "Elektromekanik köprü: Reservisor dönemi"
    notes: "İkinci Dünya Savaşı sonrası havacılık büyüdü ama süreçler eskiydi. Boston Reservisor (1946) kart sisteminin yerini alan ilk cihaz; Magnetronic Reservisor (1952) LaGuardia'da kuruldu ve 10 gün boyunca 1000 uçuşun verisini saklayıp aynı anda sorgulama imkânı sundu. Sınırlamalar: operatör ve acente hâlâ telefonun iki ucunda; satılan koltuk ile yolcu isim kaydı (PNR) manuel eşleştiriliyor; çifte rezervasyonu (oversale) önlemek için sistemde satılmayan yedek koltuklar tutuluyor. Envanterin (kaç koltuk kaldı) siparişten/PNR'dan (koltukları kim aldı) fiziksel olarak ayrılması havayolu bilişiminin ilk günahı. Tamponlar spoilage'a yol açar; modern gelir yönetiminin amacı overbooking'i doğru yönetirken spoilage'ı en aza indirmek."
  - n: 6
    title: "1953: gökyüzündeki tesadüf ve büyük fikir"
    notes: "American Airlines CEO'su C.R. Smith ile genç IBM satıcısı R. Blair Smith, Los Angeles-New York uçuşunda yan yana oturdu. Blair Smith'in anlattığı makine, sadece uygunluk durumunu tutmakla kalmayıp yolcunun adını, seyahat programını (itinerary) ve telefon numarasını da kaydedebilecekti. O uçuştan önce havayolu bilgisayarları envanter sayıları için birer hesap makinesiydi; bu fikir temelde ilişkisel bir veritabanı konsepti: sayısal envanter varlığını alfasayısal müşteri varlığına bağlamak. Modern PNR kavramı bu anda doğdu."
  - n: 7
    title: "SABER projesi: fikirden fizibiliteye"
    notes: "IBM CEO'su Thomas J. Watson Jr.'ın onayıyla ortaklık başladı. Araştırma aşaması, yolcu adı ile koltuk envanterini eşleştiren bir PNR sisteminin teknik fizibilitesini kanıtlamayı hedefliyordu. O döneme kadar yalnızca donanım satan IBM projeyi yüksek riskli gördü ve Arthur D. Little değerlendirmesiyle yazılım geliştirmeye de yatırım yapma kararı aldı. 1958'de araştırma tamamlandı ve dünyanın ilk PNR sistemi için resmî sözleşme imzalandı. IBM'in donanımdan yazılıma yönelmesi, modern havayolu BT tedarikçi modelini (Amadeus, Sabre, Travelport) doğurdu."
  - n: 8
    title: "SAGE'den ticari sektöre: askeri teknolojinin uyarlanması"
    notes: "Uçakları takip eden askeri savunma teknolojisi (SAGE, 1951) koltukları takip etmek için altyapı sundu. SAGE'in sağladığı teknik temeller: etkileşimli gerçek zamanlı hesaplama, manyetik çekirdek bellek, aktif yedekli çift işlemci, ses bantları üzerinden dijital iletişim sağlayan modemler ve takip cihazlarından anlık veri alan iletişim arayüzü. Bu altyapı devasa bir merkezi veri tabanına saniyeler içinde erişilmesini sağladı. SAGE doğrudan IBM'in ACP'sine (Airline Control Program), o da sonra TPF'ye (Transaction Processing Facility) dönüştü; TPF bugün hâlâ büyük GDS'lerin çekirdeğini çalıştırıyor."
  - n: 9
    title: "İlk kod satırları ve uygulama: 99 Park Avenue"
    notes: "IBM ve American Airlines ortak ekibi Manhattan'daki genel merkeze taşınarak modern rezervasyon sistemini kodlamaya başladı. Roger Burkhardt ve Fred Plugge American Airlines adına itici güç, Mal Perry geliştirmenin merkezindeki matematikçi, Bill Elmore dünyanın eşleştirilmiş ilk PNR kodunu yazan programcı. 1961'de SABRE'ın aşamalı kurulumu (phased deployment) resmen başladı. Buradaki aşamalı kurulum yaklaşımı, bugün havayolları için hâlâ standart olan PSS (yolcu hizmet sistemi) geçişlerinin atası; bu geçişler son derece karmaşık ve yüksek riskli kalp nakli operasyonları."
  - n: 10
    title: "Sentez: modern rezervasyon mimarisinin doğuşu"
    notes: "SABRE'ın kurulumu Host CRS mimarisinin küresel standartlarını belirledi. Beş soru, beş modül: programlar (nereye, ne zaman uçulacak), envanter (hangi uçuşta kaç koltuk satılabilir), PNR (yolcu kim ve seyahat detayları neler), biletleme (ödeme ve taşıma belgesi), DCS (havalimanı check-in ve biniş). PNR, biletleme ve envanterin ayrı modüller olması 1961'de verilmiş bir karar ve bugün hâlâ peşimizi bırakmıyor: e-biletler ile PNR'lar kolayca senkronizasyonu kaybedebiliyor. IATA ONE Order girişimi, PNR, bilet ve EMD'yi tek bir perakende siparişi olarak birleştirerek bu ayrılığı geri almaya çalışıyor."
---
