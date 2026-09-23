---
title: 'Okuma kopyaları (read replica) ne zaman fayda sağlamayı bırakır?'
description: 'Okuma kopyaları yalnızca okuma yoğunluğunu çözer, yazma yükünü değil. Sisteme yeni bir kopya eklemenin maliyetini kurtarmadığı kritik eşik.'
pubDate: 2026-01-17
topics: [scale-and-performance, solution-architecture, postgres, database, capacity, interactive]
featured: true
draft: false
placeholder: false
---

Tek bir veritabanının sınırlarını aşan her yazılım ekibi kaçınılmaz olarak aynı tartışmayı yaşar ve süreç hep aynı sırayla işler: Okuma sorguları yavaşlar. Biri sisteme bir okuma kopyası (replica) ekler. Performans anında düzelir. Yük biraz daha artınca bir kopya daha eklenir. Bu kez kazanç daha düşük kalır. Ardından masaya biri çıkıp "veritabanını sharding ile bölelim" der ve ekip sonraki iki çeyreği bu devasa dönüşüme kurban eder.

Burada asıl mesele yeni teknolojilere atlamak değil, okuma kopyalarının sisteme fayda sağlamayı bıraktığı o görünmez kırılma anını vaktinde teşhis edebilmektir.

## Tek veritabanı, sıfır kopya

Aşağıda tek bir birincil veritabanı düğümü yer alıyor. İstekler soldan akıyor, okuma işlemleri mavi ve yazma işlemleri sıcak renkle gösteriliyor. Her düğümün üç işlem yuvası ve kısa bir bekleme kuyruğu var, kuyruk taştığında gelen istekler düşmeye başlıyor.

Simülasyonu başlatın ve kuyruk dolup taşana kadar istek hızını yukarı çekin:

<c-replicas rps="18" read-pct="90" replicas="0" style="--ex-height: 150px" description="Replikasız tek bir birincil veritabanı, okuma ağırlıklı bir yükü karşılıyor. İstek hızı artırıldığında kuyruk doluyor ve istekler düşmeye başlıyor.">
</c-replicas>

Trafiğin yüzde 90'ının okuma olduğu bir senaryoda bu mimari son derece öngörülebilir bir sebeple tıkanır: Tüm iş yükünü tek bir sunucu göğüslüyor ve bu yükün ezici çoğunluğu sadece veri okumaktan ibaret.

## Okuma kopyalarını devreye almak

Şimdi aynı trafik yükünü iki adet okuma kopyasıyla karşılayalım. Okuma istekleri kopyalar arasında dengeli biçimde paylaştırılıyor, yazma işlemleri ise doğrudan birincil sunucuya yönlendiriliyor:

<c-replicas rps="30" read-pct="90" replicas="2" style="--ex-height: 210px" description="Aynı okuma ağırlıklı yük, iki okuma replikasıyla. Okumalar replikalara dağılırken yazmalar birincilde kalıyor ve düşen istek oranı sıfıra yaklaşıyor.">
</c-replicas>

Mühendislerin zihninde yer eden o mucizevi rahatlama anı tam olarak budur ve "veritabanını bölmeden önce mutlaka okuma kopyası kurun" kuralının geçerliliği de buradan gelir. Düşen istek oranı hızla sıfıra iner ve veritabanı derin bir nefes alır.

## Şimdi yazma oranını artıralım

Aşağıdaki simülasyonda **okuma** oranını yüzde 90'dan yüzde 50 seviyesine doğru çekin ve sistemin nasıl tepki verdiğine bakın. İsterseniz sisteme üçüncü ve dördüncü kopyaları da ekleyin, göreceksiniz ki düşen istekleri durdurmaya yetmeyecek:

<c-replicas rps="30" read-pct="50" replicas="3" style="--ex-height: 250px" description="Okuma ve yazmanın karışık olduğu bir yük, üç replikayla. Her yazma hem birincili meşgul ediyor hem de replikasyon işi olarak her replikaya ulaşıyor, bu yüzden replika eklemek düşen istekleri artık azaltmıyor.">
</c-replicas>

Burada aynı anda iki farklı dinamik gerçekleşiyor ve bunlardan sadece biri ilk bakışta fark ediliyor.

Görünür olan gerçek şudur: Yazma işlemleri her zaman ana sunucuya gitmek zorundadır. Dolayısıyla yazma ağırlıklı bir trafikte kaç tane kopya açarsanız açın, ana sunucu tek başına boğulmaya devam eder.

Gözden kaçan sinsi gerçek ise şudur: **Veritabanına gelen her yazma işlemi, aynı zamanda tüm okuma kopyalarına da iletilmek zorundadır.** Simülasyonda gri çizgilerle akan trafik tam olarak bu replikasyon yüküdür. Bir okuma kopyası sisteme sıfır maliyetle eklenen bedava bir kaynak değildir. Ana sunucudaki tüm yazma hareketlerini kendi diskinde baştan oynatmak ve bunun üstüne bir de kullanıcılara okuma hizmeti vermek zorunda olan bağımsız bir düğümdür. Yani sisteme her yeni kopya eklediğinizde hem okuma kapasitesini artırırsınız hem de genel replikasyon yükünü büyütürsünüz. Yazma oranı belirli bir eşiği aştığında bu ikinci faktör kaçınılmaz olarak galip gelir.

## Pratikte nasıl kararlar almalıyız?

Okuma kopyası sihirli bir büyüme aracı değil, son derece somut tek bir darboğazın ilacıdır: Okuma trafiğinin ezici çoğunlukta olduğu sistemlerde okuma doygunluğunu çözmek.

Yavaşlayan bir veritabanıyla karşılaştığınızda izlemeniz gereken öncelik sırası şöyle olmalıdır:

1. Herhangi bir mimari değişiklik önermeden önce okuma ve yazma oranını kesin olarak ölçün. Okuma oranı kabaca yüzde 80'in üzerinde değilse aradığınız çare kesinlikle okuma kopyası değildir.
2. Trafik gerçekten okuma ağırlıklıysa hemen bir kopya ekleyin, bu sektördeki en ucuz ve en etkili mühendislik hamlesidir.
3. Sorun yazma kaynaklıysa sırasıyla toplu yazma optimizasyonlarına, gereksiz güncellemelerin budanmasına, indekslerin temizlenmesine ve iki bağımsız servisin aynı tabloya yazıp yazmadığına bakın.
4. Fiziksel parçalama yani sharding ancak bu listenin en sonunda yer alır ve basit bir altyapı iyileştirmesi değil, aylarca sürecek çok riskli bir kurumsal projedir.

Bu yaklaşımın tüm ödünleşimlerini ve adımlarını [Veritabanını parçalamadan önce okuma kopyaları](/tr/playbooks/read-replicas-before-sharding) kılavuzunda detaylarıyla bulabilirsiniz.

> Buradaki simülasyon mantığı berraklaştırmak adına bilerek sadeleştirilmiştir: Sabit yanıt süreleri kullanılmış, ağ dalgalanmaları ve bağlantı havuzu sınırları kapsam dışı bırakılmıştır. Temel amaç p99 gecikmesini tahmin etmek değil, mimarideki temel ilişkiyi gözler önüne sermektir.

