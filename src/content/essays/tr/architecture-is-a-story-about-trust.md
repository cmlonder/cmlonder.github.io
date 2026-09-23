---
title: 'Mimari, Güven Üzerine Kurulmuş Bir Hikayedir'
description: 'Bir yazılım sistemindeki her mimari sınır, hangi ekibin diğerini yarı yolda bırakmayacağına dair duyulan güvenin açık bir ifadesidir.'
pubDate: 2026-07-19
topics: [solution-architecture, boundaries, teams]
featured: false
draft: false
placeholder: true
---

Bir mimari diyagrama baktığımda artık kutuların kendisine değil, o kutuları birbirine bağlayan çizgilere odaklanıyorum. İlk bakışta her çizgi salt teknik bir tercih gibi görünür fakat altında neredeyse her zaman derin bir organizasyonel karar yatar: Çizginin öte tarafındaki ekibin beni zora sokmayacağına ne kadar güveniyorum?

Bu gerçeği ilk defa, iki servis arasındaki senkron bir HTTP çağrısını kuyruğa çevirdiğimiz hararetli bir tasarım toplantısında fark etmiştim. Değişiklik gerekçesine resmi olarak "dayanıklılık ve asenkron iletişim" yazmıştık. Bu teknik olarak yanlış değildi fakat asıl sebep bambaşkaydı: Karşı servisin dağıtım takviminden haberdar değildik ve gün ortasında aniden yeniden başlatılıp çağrılarımızı düşürmesinden bıkmıştık. Yani araya koyduğumuz kuyruk, teknik bir çözüm kılığına girmiş açık bir güvensizlik beyanıydı, çünkü karşı tarafın ne zaman ayakta kalacağına dair verilmiş kurumsal bir sözümüz yoktu.

## Sınır, güvenin tükendiği yerde başlar

Bir yazılım sisteminde sınırları nereye çizdiğinizi söylerseniz, kime güvenmediğinizi hemen tahmin edebilirim. Aynı ekip içinde geliştirilen iki dahili modül arasında kimse şema versiyonlama, geriye dönük uyumluluk protokolleri veya sözleşme testleri tartışmaz. Çünkü bir taraf bozulduğunda onu düzeltecek olan yine aynı masada oturan meslektaşıdır ve onarım maliyeti en fazla bir öğleden sonradır. Ancak aynı çizgiyi iki farklı ekibin arasına çektiğiniz anda işin rengi tamamen değişir. O çizgi bir anda resmi API sözleşmelerine, sürüm politikalarına ve onay süreçlerine ihtiyaç duyar. Burada değişen şey teknoloji değildir, olası bir hatanın faturasının kime kesileceğidir.

Bu yüzden mikroservis tartışmalarının büyük kısmını yanlış zeminlerde yürütüyoruz. "Bunu bağımsız bir servis yapalım mı" sorusu genelde ölçeklenebilirlik veya trafik hacmi gibi sunulur, oysa pratikte kararı belirleyen şey ekiplerin organizasyon yapısıdır. Tek bir ekibin sahipliğindeki bir ürünü beş ayrı servise bölmek, güven maliyetini lüzumsuz yere katlamaktan başka bir işe yaramaz. Benzer biçimde, beş farklı ekibin geliştirdiği devasa bir monolitik servisi parçalamamak da ekipler arasındaki sürtüşmeyi görünmez hale getirip sistemi içeriden çürütür.

## Güven ilişkisi değişir fakat diyagramlar yerinde kalır

Yazılım mimarilerinin en aldatıcı yanı, insan ilişkileri yıllar içinde değişse bile çizilmiş sınırların taş gibi yerinde kalmasıdır. Bir servisi üç yıl önce başka bir ekip yazmıştır, sonra o ekip dağılmış ve projenin bakımı bize devredilmiştir. Artık aramızda bağımsız bir servis sınırı tutmanın hiçbir anlamı kalmamıştır fakat o sınır hala çalışır. Üstelik her küçük geliştirmede iki ayrı kod deposu, iki bağımsız derleme hattı ve iki ayrı sürüm dağıtımıyla vakit kaybederiz. Tersi de sıkça yaşanır: Yıllardır dahili bir kütüphane gibi davrandığımız bir modül sessizce başka bir ekibe devredilir ama biz hala onun veritabanı tablolarına doğrudan sorgu atmaya devam ederiz.

Bu nedenle mimari değerlendirmelerde artık şu temel soruyu soruyorum: Bu çizgi bugün hangi güven ilişkisini temsil ediyor ve o ilişki günümüzde hala geçerli mi? Cevap "bilmiyoruz, yıllar önce böyle kurulmuş" ise masada duran şey yaşayan bir mimari değil, fosilleşmiş bir organizasyon şemasıdır.

## Pratikte nasıl bir yol izliyorum?

Yeni bir sistem sınırı önerdiğimde gerekçeyi süslü teknik kavramlarla boğmamaya gayret ediyorum. "Gevşek bağlılık sağlamak için" gibi genel geçer cümleler kurmak yerine kimin kime ne sözü verdiğini açıkça yazıyorum. Örneğin: "Bu ekip şu alanları geriye dönük uyumlu tutmaya söz veriyor, şu tarihe kadar eski sürümleri destekleyecek ve sistem çökerse nöbet alarmı onların telefonunda çalacak." Eğer bu taahhütleri somut isimlerle yazamıyorsam o sınırı hiç koymuyorum, çünkü var olmayan bir güvenin üzerine mimari inşa edilemez.

Bu yaklaşımın en değerli tarafı, tartışmayı doğru zemine taşımasıdır. Sınırın yeri soyut bir mühendislik tercihi olarak sunulduğunda toplantılar en çok bağıranın kazandığı teorik münazaralara döner. Oysa aynı mesele "bu taahhüdün altına kim imza atıyor" diye sorulduğunda cevabı verecek kişi hemen netleşir. Ve çoğu zaman o kişi o an toplantı odasında bile değildir. Onu masaya davet etmek, kutuların yerini tartışmaktan her zaman çok daha kalıcı sonuçlar üretir.

