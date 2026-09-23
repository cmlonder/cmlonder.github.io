---
title: "Sepet bir veritabanı tablosu değil, bir zaman penceresidir"
domain: "ecommerce"
summary: "Fiyat sepete eklerken mi dondurulmalı, yoksa ödeme anında mı? Bu sorunun cevabı salt bir teknik tercih değil, müşteriye verilen ticari sözün tanımıdır."
pubDate: 2026-09-15
topics: [solution-architecture]
placeholder: true
---

Sepet, modern e-ticaret mimarilerinde en çok hafife alınan kavramların başında gelir. Dışarıdan bakıldığında son derece yalın görünür: Ürün kimliği, seçilen adet ve kullanıcı bilgisi.

Oysa gerçekte sepet sabit bir kayıt değil, dinamik bir **zaman penceresidir**. İçindeki her değer, dış dünyadaki koşullar değiştikçe kaçınılmaz olarak eskir ve geçerliliğini yitirir.

## Sepetteki her bilgi hızla bayatlayabilir

Bir müşteri herhangi bir ürünü sepetine eklediği anda sistemdeki pek çok veri anlık olarak geçerlidir:

| Alan | Ne kadar süre sonra bayatlar? |
|---|---|
| Fiyat | Kampanya sona erdiğinde ya da fiyat güncellendiğinde, bazen saniyeler içinde |
| Stok | Başka bir müşteri ürünü satın aldığında |
| Kargo ücreti | Teslimat adresi değiştiğinde veya sepet toplamı ücretsiz kargo limitini aştığında |
| İndirim kuponu | Sepete yeni bir ürün eklendiğinde ya da kuponun süresi dolduğunda |
| Vergi oranları | Teslimat yapılacak şehir veya ülke seçildiğinde |

Dolayısıyla sepet, bir kere kaydedilip öylece saklanan **donuk bir fotoğraf** değildir. Her sayfa yenilemesinde ve her sipariş adımında baştan hesaplanması gereken türetilmiş bir durumdur. Sepeti sıradan bir tablo gibi kurgulayıp içine doğrudan nihai fiyatı yazan sistemler, o fiyatın ne zaman güncelleneceği sorusuyla er ya da geç yüzleşmek zorunda kalır — genellikle de canlı ortamda öfkeli bir müşteri şikayetiyle.

## Fiyat tam olarak ne zaman sabitlenmeli?

Bu ikilemin tek bir teknik yanıtı yoktur, sistem olarak **hangi ticari sözü verdiğinizi** seçmeniz gerekir.

**Fiyat sepete ekleme anında sabitleniyorsa**, müşteriye "ekranda gördüğün rakam senindir" taahhüdünü vermiş olursunuz. Ancak bunun doğrudan bir maliyeti vardır: Sepette iki hafta boyunca bekleyen bir ürün eski fiyatından satın alınabilir ve özellikle enflasyonist dönemlerde sepetler adeta birer finansal opsiyon sözleşmesine dönüşür. Eğer bu duruma sıkı bir son geçerlilik süresi koymadıysanız, faturayı doğrudan şirket bilançosunda görürsünüz.

**Fiyat ödeme adımında kesinleşiyorsa**, müşteri sepetine eklediği tutardan farklı bir toplamla karşılaşabilir. Doğru ve güncel olan yaklaşım budur fakat bunun kullanıcıya şeffaflıkla bildirilmesi gerekir. Önceden uyarılmayan bir müşterinin sepette 100 lira gördüğü ürün için ödeme ekranında 120 lira ile karşılaşması telafisi zor bir güven kaybı yaratır.

**En yaygın ara çözüm** ise fiyatı belirli bir süre boyunca (genellikle 15 ile 30 dakika arasında) dondurmaktır. Süre dolduğunda sepet arka planda yeniden değerlenir ve bir fiyat farkı oluşmuşsa kullanıcıya açık bir bildirimle gösterilir.

Hangi yöntemi seçerseniz seçin, bu mantığın **kod tabanında tek bir merkezde** kurgulanması şarttır. Bu kararın iki farklı serviste iki farklı yaklaşımla işletildiği sistemler gördüm. Sonuç, yazılımcıların yerel ortamda asla yeniden üretemediği fakat ayda birkaç kez canlıda patlayan esrarengiz tutarsızlıklardır.

## Sepetin gerçek sahibi kimdir?

Sıklıkla gözden kaçan bir diğer konu ise sepetin mülkiyetidir.

Sisteme henüz giriş yapmamış anonim bir ziyaretçinin sepeti tarayıcı çerezinde ya da geçici bir oturumda yaşar. Kullanıcı hesabına giriş yaptığı anda ne olmalıdır? Mevcut sepet hesaptaki eski sepetle **birleştirilecek midir**, eskisinin üzerine mi yazılacaktır, yoksa tercih doğrudan kullanıcıya mı bırakılacaktır?

Bu üç senaryonun da kendi içinde mantıklı gerekçeleri vardır. Kabul edilemez olan, bu mimari tercihin baştan netleştirilmemiş olmasıdır. Kural tanımlanmadığında davranış hangi servisin önce yanıt verdiğine bağlı olarak rastgele şekillenir ve kullanıcılar durup dururken sepetlerinin boşaldığını görür.

Aynı problem çoklu cihaz kullanımında da baş gösterir: Bir müşterinin hem cep telefonunda hem de bilgisayarında aynı anda açık duran iki ayrı sepet. Sağlam bir birleştirme politikanız yoksa son işlem yapan cihaz diğerini ezer ve müşteri ne olduğunu anlayamaz.

## Terk edilen sepetler bir sistem hatası değildir

E-ticarette sepete eklenen ürünlerin çok büyük bir kısmı siparişe dönüşmez ve bu son derece doğal bir kullanıcı davranışıdır. Sepet nihai bir satın alma taahhüdü değil, sadece bir **satın alma niyeti sinyalidir**.

Bu gerçeği kabul etmek mimariyi iki açıdan rahatlatır. İlk olarak, geçici sepet verilerini kalıcı sipariş kayıtlarıyla aynı veritabanında tutma zorunluluğu ortadan kalkar, böylece farklı yaşam döngülerine sahip veriler aynı depolama maliyetine katlanmaz. İkincisi, terk edilmiş sepetler veritabanında bir temizlik yükü olarak değil, ürün yönetimi için **paha biçilmez bir veri kaynağı** olarak görülür. Müşterinin tam olarak hangi adımda vazgeçtiğini izlemek, ürün ekibinin elindeki en kıymetli analiz girdisidir.

Sepeti kalıcı bir tablo yerine geçici bir zaman penceresi olarak modellemek, hem teknik depolama kararlarını hem de ürünün işleyişini baştan sona berraklaştırır.

