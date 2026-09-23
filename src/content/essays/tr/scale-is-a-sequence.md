---
title: 'Ölçek Bir Varış Noktası Değil, Bir Sıradır'
description: 'Yazılım sistemleri ani bir patlamayla çökmez, öngörülebilir bir sırayla tıkanır ve bu sırayı bilmek mimarlığın büyük kısmını oluşturur.'
pubDate: 2026-05-07
topics: [scale-and-performance, solution-architecture, capacity, postgres, queues]
featured: true
draft: false
placeholder: true
---

Ölçek kelimesi geçtiğinde çoğu insanın aklına devasa bir büyüklük gelir: Milyonlarca kullanıcı, saniyede binlerce istek ya da terabaytlarca veri. Oysa pratik mühendislikte ölçek bir büyüklük değil, katı bir sıradır. Sistemler belirli bir kullanıcı sayısına ulaştıklarında rastgele çökmez. Neredeyse her zaman tahmin edilebilir ve birbirini izleyen belirli bir sırayla tıkanır. Bu sırayı bilmek işin büyük kısmını çözer, çünkü bir sonraki teknik duvarın nerede beklediğini biliyorsanız, bugün hangi karmaşık çözümü yapmamanız gerektiğini de peşinen bilirsiniz.

## Sistemler genelde hangi sırayla tıkanır?

İlk duvar neredeyse hiçbir zaman veritabanının yazma kapasitesi olmaz, doğrudan okuma tarafında yaşanır. Raporlama sorguları, arama filtreleri ve anasayfa listeleri aynı birincil veritabanına yüklendikçe sorgu süreleri uzar. Bu aşamada ekiplerin aklına gelen ilk refleks hemen veritabanını parçalama (sharding) projesi başlatmak olur. Ancak doğru yanıt neredeyse her zaman bir okuma kopyası (read replica) açmak ve eksik birkaç indeksi eklemektir.

İkinci duvar bağlantı havuzlarında patlar. Uygulama sunucularını yatayda artırdıkça her yeni örnek veritabanına onlarca bağlantı açar. Kısa süre sonra veritabanı işlemcisi doymadan önce bağlantı havuzu tükenir ve sistem istekleri reddetmeye başlar. Buradaki çare sunucu boyutunu büyütmek değil, araya PgBouncer gibi hafif bir bağlantı havuzlayıcı koymak ve her sunucunun gerçekte kaç bağlantı tükettiğini sıkı kontrol etmektir.

Üçüncü duvar senkron çağrı zincirleridir. Sistem küçükken A servisi B'yi, B de C'yi senkron olarak çağırır ve aradaki toplam gecikmeyi kimse dert etmez. Ancak trafik arttıkça bu zincir hem gecikmeyi katlar hem de zincirin en zayıf halkası çöktüğünde tüm servisleri peşinden sürükler. Mesaj kuyruklarına geçiş kararı genellikle bu aşamada verilir ve maalesef çoğu zaman fazlasıyla gecikilmiş olur.

Dördüncü duvar ise sisteme değil, doğrudan ekibin kendisine çarpar. Dağıtım sıklığı artar, paylaşılan ana kod deposundaki bekleyen PR sayısı kontrolden çıkar ve projedeki asıl darboğaz makineler değil, kod inceleme süreçleri haline gelir. Bunu bir ölçekleme meselesi olarak görmek ilk başta şaşırtıcı gelebilir fakat kapasite sınırları insan organizasyonunda da aynı kurallarla işler.

## Sırayı atlamanın ağır faturası

Bu sıralamayı bilmenin en büyük kıymeti, bugün hangi işi kesinlikle yapmamanız gerektiğini söylemesidir. Üçüncü duvara çarpmadan olay tabanlı mikroservis mimarisine geçerseniz, henüz ortada olmayan bir sorunu çözmek için devasa bir operasyonel karmaşıklık faturası ödersiniz. Bir sisteme mesaj kuyruğu soktuğunuz anda mesaj sıralaması, mükerrer iletimler, ölü mektup yönetimi ve dağıtık izleme gibi onlarca yeni problem doğar. Henüz ihtiyacınız olmayan bir dayanıklılık için bu yükü sırtlanmak enerjinizi boşa harcamaktır.

Tersini de sıkça gördüm. Bu sırayı takip etmeyen ekipler her teknik duvara sanki tarihte ilk kez yaşanıyormuş gibi panikle tepki verir. Ve kriz anında alınan kararlar neredeyse her zaman en pahalı ve sancılı tercihler olur. Gece yarısı telaşla başlatılan gereksiz bir sharding projesinin getirdiği operasyonel borç yıllarca ödenemez.

## Bu sıralamayı nasıl keşfettim?

Bu yaklaşımı akademik bir teoriden değil, bizzat geriye dönük tecrübelerimden çıkardım. Çalıştığım projelerde son beş yıl içinde yaşanan tüm büyük kesintileri listeledim ve her bir krizin hangi kaynağın tükenmesiyle tetiklendiğini tek tek çıkardım. Liste hem oldukça kısaydı hem de kendini şaşırtıcı bir tutarlılıkla tekrar ediyordu. Ardından farklı ekiplerin ve şirketlerin tecrübelerini incelediğimde de tablonun değişmediğini gördüm. Değişen tek şey, bu duvarların kaçıncı kullanıcıda veya hangi trafik eşiğinde ortaya çıktığıydı.

Bu yüzden yeni bir mimariye başlarken artık afaki kapasite tahminleri yapmıyorum, doğrudan bu öncelik sırasını netleştiriyorum. Hangi kaynağın ilk tükeneceğini, bunu hangi metriğe bakarak izleyeceğimizi ve o an geldiğinde atılacak en ucuz doğru adımın ne olduğunu belirliyorum. Bu üç soruya net yanıt verebilen bir ekip, sayfalarca farazi tahminle dolu kapasite dokümanları hazırlayan ekiplerden her zaman katbekat hazırlıklıdır.

