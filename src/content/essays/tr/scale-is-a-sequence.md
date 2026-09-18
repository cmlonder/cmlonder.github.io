---
title: 'Ölçek Bir Varış Değil, Bir Sıra'
description: 'Sistemler ölçekte bozulmaz. Tahmin edilebilir bir sırayla bozulur ve o sırayı bilmek işin çoğudur.'
pubDate: 2026-05-07
topics: [scale-and-performance, solution-architecture]
tags: [kapasite, postgres, kuyruk]
featured: true
draft: false
placeholder: true
---

Ölçek hakkında konuşurken herkesin aklına bir büyüklük geliyor: şu kadar
kullanıcı, şu kadar istek, şu kadar veri. Halbuki pratikte ölçek bir
büyüklük değil, bir sıra. Sistemler belli bir sayıya gelince topluca
bozulmuyor; belli bir sırayla, hep aynı sırayla bozuluyor. O sırayı
bilmek işin büyük kısmını hallediyor, çünkü bir sonraki duvarın nerede
olduğunu biliyorsan bugün neyi yapmaman gerektiğini de biliyorsun.

## Sıra genelde şöyle ilerliyor

İlk duvar neredeyse her zaman tek bir veritabanının yazma tarafı
olmuyor, okuma tarafı oluyor. Rapor sorguları, liste ekranları ve
arama aynı örnek üzerinde birikince gecikme artıyor. Bu noktada
insanların aklına ilk gelen şey sharding oluyor, ama doğru cevap
neredeyse her zaman okuma replikası ve birkaç indeks. Bunu bir kılavuz
olarak ayrıca yazdım, çünkü aynı tartışmayı birden fazla kez yaptım.

İkinci duvar bağlantı havuzu oluyor. Uygulama örneklerini yatayda
artırdıkça her biri kendi havuzunu açıyor ve veritabanı tarafında
bağlantı sayısı, asıl iş yükünden çok önce tükeniyor. Burada çözüm
genelde daha büyük makine değil, araya bir havuzlayıcı koymak ve her
örneğin kaç bağlantı açtığını gerçekten ölçmek oluyor.

Üçüncü duvar senkron çağrı zincirleri. Sistem küçükken A servisi B'yi,
B de C'yi çağırıyor ve toplam gecikme kimsenin dikkatini çekmiyor.
Yük arttığında bu zincir hem gecikmeyi topluyor hem de en zayıf halka
öldüğünde üçünü birden indiriyor. Kuyruğa geçme kararı genelde burada
veriliyor, ve genelde gerekenden geç veriliyor.

Dördüncü duvar, sisteme değil ekibe çarpıyor. Yayın sıklığı artıyor,
ortak kod tabanında bekleyen PR sayısı büyüyor ve asıl darboğaz artık
makine değil, gözden geçirme sırası oluyor. Bunu bir ölçek problemi
olarak görmek ilk başta tuhaf geliyor ama kapasite hesabı burada da
aynı şekilde işliyor.

## Sırayı atlamanın maliyeti

Bu sıranın en faydalı tarafı, hangi işi bugün yapmaman gerektiğini
söylemesi. Üçüncü duvara çarpmadan olay tabanlı mimariye geçersen,
elinde çözülmemiş bir problem için ödediğin bir karmaşıklık faturası
kalıyor. Kuyruk geldiği anda sıralama, tekrar teslim, ölü mektup kutusu
ve gözlemlenebilirlik de geliyor; bunların hepsi gerçek işler ve
hiçbirini o an ihtiyacın olmayan bir dayanıklılık için yapmak
istemiyorsun.

Tersini de gördüm. Sırayı bilmeyen ekipler her duvara ilk kez
çarpıyormuş gibi tepki veriyor, ve çarpma anında verilen kararlar
neredeyse her zaman en pahalı kararlar oluyor. Gece yarısı alınan
"şunu sharding'e bölelim" kararının faturası aylarca ödeniyor.

## Kendi sıramı nasıl çıkardım

Bunu bir teori olarak bulmadım, arkama bakarak çıkardım. Çalıştığım
sistemlerde son beş yılda yaşanan ciddi olayların listesini çıkarıp her
birinin hangi kaynağın tükenmesiyle başladığını yazdım. Liste kısaydı
ve tekrar ediyordu. Sonra aynı listeyi başka sistemler için de yaptım
ve sıranın büyük ölçüde aynı kaldığını gördüm; değişen şey sadece
duvarların hangi kullanıcı sayısında geldiğiydi.

O yüzden bir sisteme yeni başladığımda artık kapasite planı yapmıyorum,
sıra çıkarıyorum. Hangi kaynak ilk tükenecek, onu nasıl ölçüyoruz, ve
tükendiğinde en ucuz doğru hamle ne. Bu üç soruya cevabı olan bir ekip,
tahmini rakamlarla dolu bir kapasite dokümanı olan ekipten çok daha
hazırlıklı oluyor.
