---
title: 'Veritabanını parçalamadan (sharding) önce okuma kopyaları'
description: 'Veritabanı darboğazı okuma yoğunluğundan kaynaklanıyorsa, mimariyi fiziksel olarak bölmek neredeyse hiçbir zaman ilk doğru tercih değildir.'
pubDate: 2026-02-19
problem: 'Veritabanı kaynakları tükeniyor ve ekip hemen veritabanını parçalama (sharding) projesi başlatmak istiyor.'
context: 'Büyüyen ve okuma trafiği toplam yükün yüzde seksenini aşan tek bölgeli ilişkisel veritabanı kurulumları.'
topics: [scale-and-performance, solution-architecture, postgres, database, capacity]
draft: false
placeholder: true
---

## Problem

Veritabanı artan trafik altında zorlanmaya başladığında masaya gelen ilk büyük öneri genelde sharding projesi olur. Ancak bu talep genellikle gerçek bir teknik teşhisten ziyade ölçek kelimesinin yarattığı yapay heyecanla gündeme gelir.

## Bağlam

Büyümekte olan, veritabanı boyutu birkaç terabaytın altında kalan ve trafiğinin ezici çoğunluğu okumadan oluşan ilişkisel sistemler.

## Yaklaşım

Öncelikle yükün tam olarak hangi tarafta biriktiğini net biçimde ölçüyorum. Bu adımı atlamak bundan sonraki tüm mimari kararları varsayımlara kurban etmek demektir. Okuma ve yazma oranlarına, en uzun süren sorgulara ve kilitlenme noktalarına dikkatle bakıyorum.

Eğer darboğaz okuma tarafındaysa sırayı disiplinle işletiyorum. İlk olarak indeksler ve sorgu planları incelenir. Tek bir eksik indeksin yarattığı devasa yükü sharding ile çözmeye kalkışmak, bir öğleden sonralık işi aylarca sürecek riskli bir dönüşüme çevirmektir. İkinci olarak ağır raporlama ve analiz sorgularını bir okuma kopyasına (replica) aktarıyorum, çünkü bunlar en çok kaynak tüketen fakat anlık tazelik gerektirmeyen işlerdir.

Ardından arama ve listeleme ekranlarını okuma kopyalarından beslemeye başlıyorum. Burada birkaç saniyelik replikasyon gecikmesini kabullenmek çoğu ürün için kullanıcı deneyimini hiç bozmaz. Son adımda ise bağlantı havuzu (connection pool) katmanını optimize ediyorum, çünkü uygulama örnekleri arttıkça asıl tükenen kaynağın veritabanı işlemcisi değil bağlantı sayısı olduğu sıklıkla görülür.

Yük gerçekten yazma tarafındaysa okuma kopyaları bir fayda sağlamaz. O noktada sırasıyla toplu yazma optimizasyonları, gereksiz güncellemelerin budanması ve tablo bazlı bölümlendirme (partitioning) devreye girer. Fiziksel parçalama yani sharding ancak bu seçeneklerin tümü tüketildiğinde masaya gelir.

## Ödünleşimler

Okuma kopyası kullanmak yazılım katmanına veri tazeliği sorusunu getirir: Hangi sorgu birkaç saniyelik bayat veriyi kaldırabilir? Bu ayrımın mantığı kod tabanına dağıldıkça mimariyi yönetmek zorlaşabilir. Kullanıcının bir formu kaydettikten hemen sonra yönlendirildiği ekranda kendi yaptığı değişikliği görememesi, bu yaklaşımda en sık karşılaşılan kullanıcı deneyimi hatasıdır.

## Bu ne zaman işe yaramaz

Tek bir tablo veya müşteri verisi tek bir sunucunun depolama sınırlarını aşıyorsa okuma kopyası çare olmaz. Benzer biçimde yazma hacmi tek bir birincil sunucunun disk hızını veya hareket günlüğü kapasitesini tüketiyorsa veriyi fiziksel olarak parçalamak kaçınılmazdır.

Ayrıca yasal veya coğrafi zorunluluklar nedeniyle verilerin belirli ülkelerde tutulması gerekiyorsa bu bir performans meselesi değildir ve buradaki öncelik sırası geçerliliğini yitirir.

