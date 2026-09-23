---
title: 'Yapay Zeka Ajanlarının Henüz Başaramadığı Şeyler'
description: 'Uçtan uca otonom yazılım akışlarının tıkandığı gerçek sınır noktalarına dair dürüst ve güncel bir değerlendirme.'
pubDate: 2025-12-11
topics: [agentic-development, limits, workflow]
featured: false
draft: false
placeholder: true
---

Yapay zeka ajanlarının sınırlarına dair yazılan makalelerin çoğu birkaç ay içinde eskir, çünkü genellikle bir sonraki model sürümünün kolayca kapatacağı geçici teknik eksiklikleri tarif ederler. Ben ise modelin salt zekasıyla değil, yazılım geliştirme ortamının ve organizasyonun yapısıyla ilgili olan çok daha derin sınırları tartışmak istiyorum.

## Yazıya dökülmemiş kurumsal hafıza

Bir ajana devredilmesi en zor şey, bugüne kadar hiçbir dokümana veya koda girmemiş olan örtük bilgidir. Bu veritabanı tablosunda neden normalize edilmemiş tuhaf bir sütun var? Fiyatlandırma mantığındaki o anlamsız `if` bloğu hangi eski kurumsal müşteri için ayakta tutuluyor? Yeniden deneme sayısı neden beş değil de yedi olarak ayarlanmış? Bu kritik detayların hiçbiri kaynak kodda yazmaz ve çoğu zaman ekipten kimsenin hafızasında da tam olarak durmaz. Yıllar önce yapılmış plansız bir toplantıda alınmış aceleci bir kararın içinde sessizce yaşar.

Kod tabanını tarayan bir ajan, yer yer mantıksız ve tutarsız görünen bir mimariyle karşılaşır ve ilk refleksi bu karmaşık parçaları temizlemek olur. Bu refleks genel mühendislik prensipleri açısından doğrudur ancak projenin gerçekleri açısından ölümcüldür. Buradaki darboğaz modelin akıl yürütme gücü değildir, bilginin girdiler arasında hiç var olmamasıdır.

Tek kalıcı çözümün daha fazla bağlamı ve mimari gerekçeyi yazıya dökmek olduğunu düşünüyorum. Ancak her dokümantasyon denemesinde yazılmamış ne kadar devasa bir tecrübe yığını olduğunu yeniden keşfediyorum. Bu detayların çoğu da maalesef ancak birisi onu koddan silmeye yeltendiğinde görünür hale geliyor.

## Hesap verebilirlik devredilemez

İkinci büyük sınır da teknik değil, tamamen ahlaki ve kurumsaldır. Alınan bir kararın arkasında durabilecek ve faturasını göğüsleyecek gerçek bir insanın bulunması gerekir. Hesap verebilirlik, yazılımla bir arka plan sürecine devredebileceğiniz bir nitelik değildir. Canlı ortamda büyük bir kesinti yaşandığında kritik soru o hatalı kodu kimin ürettiği değil, o değişikliğin güvenli olduğuna kimin onay verdiğidir. O kişinin de onay verdiği kodu olası bir kriz anında savunabilecek kadar derinlemesine anlamış olması şarttır.

Bu durum hiçbir model iyileştirmesinin aşamayacağı katı bir tavan çizgisi çeker: İnsan zihni hesabını verebileceğinden çok daha fazla kodu dakikalar içinde üretebilir fakat anlamadığı bir değişikliği projeye dahil ettiği anda mühendislik yapmayı bırakıp sessizce kumar oynamaya başlamış olur.

## Neyi yapmamak gerektiğine dair editoryal zevk

Üçüncü ve en az konuşulan sınır ise yapmama iradesidir. Mühendislik mesleğindeki asıl katma değer, neyi yapacağını seçmekten ziyade neyi yapmamaya karar vermekten doğar. Ve bu karar, geliştirme görevinde yazmayan onlarca görünmez parametreyi tartmayı gerektirir: Şirketin gerçek stratejik hedefi nedir, hangi kullanıcı şikayeti geçici bir gürültüden ibarettir ve altı ay sonra hangi özellik kurum içi dinamikler yüzünden tamamen çöpe gidecektir?

Bir ajana görev verdiğinizde görevi harfiyen yerine getirir. O görevin aslında hiç var olmaması gerektiğini söylemez. Bu ajanın bir kusuru değil, döngüdeki pozisyonunun doğal bir sonucudur. Ve bu durum, görevi tanımlayan insanın karar ağırlığının azalmak bir yana katlanarak arttığı anlamına gelir.

## Önümüzdeki dönemde neler değişecek?

İlk sınırın, kod tabanlarına yönelik bağlam mühendisliği araçları geliştikçe ve mimari kararlar daha iyi arşivlendiğinde daralacağını öngörüyorum. İkinci sınır asla daralmayacak, çünkü o yazılımla değil sorumluluk ahlakıyla ilgili insani bir meseledir. Üçüncüsü ise ancak geliştiriciler bir ajana kendi iş arkadaşlarına bile vermekten çekindikleri derin kurumsal sırları ve stratejik hedefleri şeffaflıkla aktarmaya razı olduklarında gevşeyebilir.

Dolayısıyla bugün sorulması gereken doğru soru ajanların neleri yapamadığı değildir. Günlük işlerimizin hangilerinin gerçek bir muhakeme gerektirdiğini, hangilerini ise sırf alışkanlıktan ötürü kendi elimizle yapmaya devam ettiğimizi dürüstçe ayırt edebilmektir.

