---
title: 'Read replica ne zaman işe yaramaz oluyor'
description: 'Replika yalnızca okuma doygunluğunu çözer, başka hiçbir şeyi. Bir tane daha eklemenin kendini ödemeyi bıraktığı nokta tam olarak burası.'
pubDate: 2026-01-17
topics: [scale-and-performance, solution-architecture, postgres, database, capacity, interactive]
featured: true
draft: false
placeholder: false
---

Tek veritabanını aşan her ekip aynı tartışmayı yapıyor ve tartışma hep aynı
sırayla ilerliyor. Okumalar yavaşlıyor. Biri replika ekliyor. İşe yarıyor. Biri
bir tane daha ekliyor. Daha az işe yarıyor. Sonra biri *sharding* diyor ve iki
çeyrek dolmuş oluyor.

İşe yarayan şey fikir değil. Replikaların kendini ödemeyi bıraktığı anı
görebilmek.

## Tek veritabanı, replika yok

Aşağıda tek bir birincil düğüm var. İstekler soldan geliyor; okumalar mavi,
yazmalar sıcak renkte. Her düğümün üç servis yuvası ve kısa bir kuyruğu var,
kuyruk doluyken gelen istek düşüyor.

Başlat, sonra kuyruk birikene kadar istek hızını yukarı çek.

<c-replicas rps="18" read-pct="90" replicas="0" style="--ex-height: 150px" description="Replikasız tek bir birincil veritabanı, okuma ağırlıklı bir yükü karşılıyor. İstek hızı artırıldığında kuyruk doluyor ve istekler düşmeye başlıyor.">
</c-replicas>

Yüzde 90 okumada bu yapı sıkıcı bir sebeple çöküyor: bütün işi tek bir düğüm
yapıyor ve o işin çoğu okuma.

## Replika ekle

Şimdi aynı yük, replikalarla. Okumalar aralarında dağılıyor, yazmalar hâlâ
birincile gidiyor.

<c-replicas rps="30" read-pct="90" replicas="2" style="--ex-height: 210px" description="Aynı okuma ağırlıklı yük, iki okuma replikasıyla. Okumalar replikalara dağılırken yazmalar birincilde kalıyor ve düşen istek oranı sıfıra yaklaşıyor.">
</c-replicas>

Herkesin aklında kalan durum bu, ve *sharding'den önce read replica*
tavsiyesinin genelde doğru olmasının sebebi de bu. Düşen istekler neredeyse
sıfıra iniyor. Canını yakan şey artık birincil değil.

## Şimdi yazmaları artır

**Okuma** oranını yüzde 90'dan 50'ye doğru çek ve ne olduğuna bak. Hazır
oradayken üçüncü ve dördüncü replikayı da ekle — seni kurtarmayacak.

<c-replicas rps="30" read-pct="50" replicas="3" style="--ex-height: 250px" description="Okuma ve yazmanın karışık olduğu bir yük, üç replikayla. Her yazma hem birincili meşgul ediyor hem de replikasyon işi olarak her replikaya ulaşıyor, bu yüzden replika eklemek düşen istekleri artık azaltmıyor.">
</c-replicas>

Burada iki şey oluyor ve yalnızca biri bariz.

Bariz olan: yazmalar her zaman birincile gidiyor, yani yazma ağırlıklı bir yük
kaç replika olursa olsun tek bir düğümde toplanıyor.

Gözden kaçan: **her yazma aynı zamanda her replikaya da düşüyor.**
Simülasyondaki gri trafik bu. Replika bedava bir okuma birimi değil; bütün
yazma akışını baştan oynatmak *ve* üstüne okuma servis etmek zorunda olan bir
düğüm. Replika eklemek aynı anda hem okuma kapasitesi hem yazma yükü ekliyor.
Belli bir yazma oranından sonra ikincisi kazanıyor.

## Pratikte ne anlama geliyor

Read replica tek bir spesifik darboğazın çözümü: gerçekten okuma ağırlıklı bir
yükteki okuma doygunluğu. Bir ölçekleme stratejisi değil.

Doygunluğa gelmiş bir veritabanına bakıyorsan, bende işe yarayan sıra şu:

1. Bir şey önermeden önce okuma/yazma oranını ölç. Okuma kabaca yüzde 80'in
   üstünde değilse cevabın replika değil.
2. Okuma ağırlıklıysa replika ekle — açık ara en ucuz doğru çözüm.
3. Değilse sırasıyla yazma çoğalmasına, indekslere ve iki servisin aynı tabloya
   yazıp yazmadığına bak.
4. Sharding en sonda, ve bir değişiklik değil bir proje.

Bunun ödünleşimleri yazılmış kılavuz hali
[Sharding'den önce read replica](/tr/playbooks/read-replicas-before-sharding)
sayfasında.

> Simülasyon bilerek kaba: sabit servis süreleri, ağ yok, replikasyon gecikmesi
> yok, bağlantı havuzu yok. Amacı tek bir ilişkiyi görünür kılmak, senin p99'unu
> tahmin etmek değil.
