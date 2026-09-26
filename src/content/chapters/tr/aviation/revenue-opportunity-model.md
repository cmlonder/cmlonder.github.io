---
title: "Gelir fırsat modeli (ROM) ve havayolu gelir yönetimi performansının ölçümü"
domain: "aviation"
summary: "Bir uçuşun geliri mevsimden, rakip fiyatından ve talepten etkilenir; gelir yönetiminin payını bunlardan ayırmak için American Airlines 1987'de gelir fırsat modelini (ROM) geliştirdi. Bu bölüm modelin kontrolsüz, gerçekleşen ve mükemmel kontrol senaryolarını nasıl karşılaştırdığını, kaybı spoilage ve dilution olarak nasıl ayırdığını ve AUS-DFW örneğinde fırsatın yüzde kaçının yakalandığını anlatıyor."
audience: "Gelir yönetimi, envanter ya da raporlama sistemleriyle çalışan ve bir RM sisteminin iyi çalışıp çalışmadığını hangi ölçüyle söyleyeceğini merak eden yazılımcı ve analist. Spill ve show-up bölümlerinin okunmuş olması işe yarar; ROM, mükemmel öngörü, spoilage, dilution, kazanılan gelir yüzdesi, spill rate ve closing rate metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Bir uçuşun geliri geçen yıla göre arttıysa bunun kaç parçası gelir
yönetiminin işi? Talep yükselmiş olabilir, rakip fiyat artırmış olabilir,
bayram o haftaya denk gelmiş olabilir. Gelir rakamı bunların hepsini tek
sayıda topluyor ve RM ekibinin payını görünmez kılıyor. Gelir fırsat modeli
(Revenue Opportunity Model, ROM) bu soruya cevap vermek için kuruldu.
**ROM gelir yönetimini gerçekleşen gelirle değil, o uçuşta mümkün olan en
kötü ve en iyi sonuç arasındaki pencerenin ne kadarının doldurulduğuyla
ölçer; böylece piyasanın getirdiği geliri kontrollerin getirdiğinden
ayırır.**

Kaynak metin modelin kökenini açıkça veriyor: uçuş ve segment bazlı gelir
fırsat modeli 1987'de American Airlines'ta, mükemmel bilgi olsaydı önceki
ayın gelir performansının nasıl iyileştirilebileceğini anlamak için
geliştirildi. Yani ROM baştan bir geriye bakış aracı. Kalkış öncesinde karar
vermiyor; kalkış sonrasında verilen kararları puanlıyor.

## Mükemmel öngörü, belirsizliği denklemden çıkararak bir tavan çiziyor

ROM'un çalışma mantığı basit bir "ne olabilirdi" sorusu. Uçuş kalktıktan
sonra elde kesin veri var: hangi sınıfa kaç kişi talep etti, kaç kişi
uçağa geldi. Kalkıştan önce bunların hepsi tahmindi; kalkıştan sonra bunlar
olgu. Model bu olgularla iki uç senaryoyu yeniden oynatıyor. Birinde
hiçbir envanter kontrolü yok. Ötekinde kontroller mükemmel, yani talebin ve
show-up'ın tam olarak bilindiği varsayılıyor. İkisi arasındaki fark, o
uçuşta gelir yönetiminin oynayabileceği alanın büyüklüğü.

Kaynak metin amacı şöyle tarif ediyor: ROM, mükemmel bir öngörüyle maksimum
geliri elde etmek için en uygun envanter kontrollerini belirliyor ve
kullanılan gerçek kontrollerin görece iyi mi kötü mü olduğuna karar
veriyor. Buradaki kilit kelime "görece". Gerçekleşen gelir mutlak bir
başarı ölçüsü olarak okunmuyor; aynı talep koşullarında mümkün olan en
iyiye göre okunuyor.

Mükemmel kontrollerin pratikte uygulanamayacağı açık. Kimse talebi ve
show-up'ı kalkıştan önce kesin bilemez. Ama bu senaryonun işi uygulanmak
değil, teorik üst sınırı çizmek. Talep tahmini ve show-up belirsizliği
sıfır varsayıldığında ulaşılabilecek gelir, mevcut stratejinin belirsizliği
ne kadar iyi yönettiğini test etmek için bir kıyas noktası oluyor. Kaynak
metin gelir yönetimi sürecinin görevini de bu çerçevede tanımlıyor: talep
tahmini ve show-up belirsizliğiyle ilişkili riski etkili biçimde yönetmek
ve beklenen geliri maksimize etmek. ROM o riskin ne kadar iyi yönetildiğini
sonradan sayıya döküyor.

Yazılım tarafında bunun karşılığı şu: ROM bir optimizasyon motoru değil,
bir yeniden oynatma motoru. Girdisi kalkış sonrası kesinleşmiş talep ve
show-up verisi, çıktısı her uçuş için üç gelir değeri. Bu da demek ki
kısıtlanmamış talebin, yani sınıf kapandığı için kaydı düşmeyen talebin de
bir şekilde elde olması gerekiyor. Satılmayan koltuğun arkasındaki talep
kayıtta yoksa, mükemmel kontrol senaryosu eksik bir talep üzerine kurulur
ve tavan olduğundan alçak görünür.

## Kontrolsüz senaryo, tabanı ilk gelene satarak buluyor

Alt sınırı çizen senaryo kontrol yokluğu. Burada envanter ilk gelen ilk
alır (first-come, first-served) mantığıyla satılıyor. Koltuklar en düşük
ücretli sınıflardan başlayarak doluyor, çünkü erken rezervasyon yapan
yolcu genellikle ucuz sınıfı arayan yolcu. Uçak erken doluyor ve kâğıt
üzerinde bu bir başarı gibi görünüyor: doluluk yüksek, satış erken bitmiş.

Bedeli sonra geliyor. Son dakikada gelen ve daha yüksek ücret ödemeye hazır
yolcu dolu bir uçakla karşılaşıyor ve dışarıda kalıyor, yani spill oluyor.
Kaynak metne göre bu senaryo toplam geliri minimize ediyor. Bu yüzden
kontrolsüz gelir, RM'nin katkısını ölçmek için doğal bir sıfır noktası:
hiçbir şey yapmasaydık ne kazanırdık sorusunun cevabı.

İki senaryonun arası gelir fırsatı. Gerçekleşen gelir bu pencerenin
içinde bir yere düşüyor ve RM ekibinin başarısı, piyasa koşullarından
bağımsız olarak pencerenin ne kadarının doldurulduğuyla ölçülüyor. Talep
zayıf bir ayda pencere daralabilir, güçlü bir ayda genişleyebilir; ölçü
pencerenin boyutuna değil, doluluk oranına bakıyor.

## AUS-DFW örneği: fırsatın yarısından azı yakalanmış

Kaynak metin bu hesabı 100 koltuklu tek bacaklı bir uçuşla, Austin-Dallas
(AUS-DFW) seferiyle somutlaştırıyor. Rakamlar şöyle:

- Mükemmel kontrollerle maksimum gelir: 12.150 $
- Kontrol yokken minimum gelir: 7.100 $
- RM kontrolleriyle gerçekleşen gelir: 9.352 $

Gelir fırsatı maksimum ile minimum arasındaki fark, yani 5.050 $. RM
kontrollerinin kontrolsüz senaryoya göre kazandırdığı ek gelir,
gerçekleşen ile minimum arasındaki fark, yani 2.252 $. İkincinin birinciye
oranı kazanılan gelir yüzdesi (Percent Revenue Gained): yüzde 44,59.

Bu rakamı iki yönden okumak gerekiyor. Birincisi, RM kontrolleri hiçbir
şey yapmamaya göre uçuşa 2.252 $ eklemiş; bu gerçek bir katkı ve gelir
raporunda başka hiçbir kalemin içinde görünmüyor. İkincisi, aynı talep
koşullarında masada kalan tutar 5.050 $ ile 2.252 $ arasındaki fark, yani
2.798 $. Pencerenin yarısından fazlası doldurulamamış. Tek başına 9.352 $
gelir rakamı bu iki bilginin hiçbirini vermiyor.

Kazanılan gelir yüzdesi, kaynak metnin tanımıyla, RM kontrolleri sayesinde
elde edilen ek gelirin toplam mümkün gelir fırsatına oranı. Oran düşükse
iki açıklamadan biri geçerli: ya sistem düşük değerli yolcuyu fazla kabul
edip yüksek değerli talebi kaçırmış, ya da tam tersine yüksek değerli
talep beklerken koltukları boş bırakmış. Bu iki hatanın adı var ve ROM
kaybı bu iki kaleme bölerek teşhisi mümkün kılıyor.

## Kayıp iki yönden geliyor: boş kalan koltuk ve ucuza giden koltuk

Birinci kalem spoilage, yani boşa giden kapasite. Tuhaf olan, talebin
fazla olduğu bir uçuşta bile ortaya çıkabilmesi. Kaynak metne göre
spoilage'ın temel nedeni, show-up oranlarının ya da yüksek değerli
rezervasyon sınıflarına olan talebin olduğundan fazla tahmin edilmesi.
Sistem "bu koltuğu daha pahalıya satarım" diye saklıyor, beklenen talep
gelmiyor ve uçak boş koltukla kalkıyor. Ucuz sınıfta reddedilen yolcu da
kayıp, pahalı sınıfta hiç gelmeyen yolcu da.

İkinci kalem dilution, yani seyrelme. Burada koltuk boş kalmıyor, yanlış
yolcuyla doluyor. Kaynak metin bunu mevcut kapasitenin optimal olmayan bir
yolcu karmasıyla doldurulması olarak tanımlıyor: daha yüksek ücret ödemeye
razı yolcular varken sistemin kapasiteyi daha ucuz sınıflara açması. Bu
yüzden dilution doluluk oranından bağımsız bir sorun. Tam dolu bir uçuş da
seyrelmiş olabilir; hatta kontrolsüz senaryo tam olarak böyle bir uçuş
üretiyor. Kaynak metin dilution'ı maksimum müşteri fırsatı ile gerçekleşen
gelir arasındaki farktan hesaplıyor.

İki hatanın yönü birbirine zıt ve bu, ayrı ölçülmelerinin asıl nedeni.
Spoilage sistemin fazla temkinli, dilution fazla cömert olduğunu
söylüyor. Tek bir "kayıp gelir" rakamı bakan birine hangi yöne
düzeltme yapacağını söylemez; iki ayrı rakam söyler. Show-up tahminini
aşağı çekmek spoilage'ı azaltırken dilution'ı artırabilir, indirim
tahsisatını daraltmak dilution'ı azaltırken spoilage'ı artırabilir. ROM'un
katkısı bu dengeyi görünür hale getirmek.

Yazılım tarafında bunun karşılığı, raporlama katmanında kaybın tek bir
kolon olarak değil, en az iki ayrı ölçü olarak tutulması. Bir panelde
yalnızca kazanılan gelir yüzdesi varsa analist düşüşü görür ama nedenini
göremez.

## Sınıflar arası spill sırası, indirim tahsisatındaki hatayı ele veriyor

ROM uçuş düzeyinde bir karne veriyor. Hatanın hangi sınıfta yapıldığını
görmek için daha ince metriklere iniliyor. Bunlardan ilki spill rate,
yani taşma oranı: bir sınıfa gelen talebin ne kadarının koltuk
bulamadığı için reddedildiği.

Kaynak metnin koyduğu iş kuralı şu: spill rate değerlerinin en yüksek
değerli sınıftan en düşüğe doğru artan bir sırada olması beklenir.
Mantığı açık. İyi çalışan bir sistem koltuğu pahalı yolcu için saklar, ucuz
sınıfları önce kapatır; dolayısıyla taşma en çok ucuz sınıfta, en az pahalı
sınıfta görülmeli. Sıralama bozulmuşsa, örneğin pahalı sınıfta daha çok
taşma varsa, sistem indirimli sınıflara fazla koltuk ayırmış ve bunun
sonucunda yüksek değerli talebi geri çevirmek zorunda kalmış demektir.
Bu, dilution'ın sınıf düzeyindeki izi.

İkinci metrik closing rate, yani kapanış oranı: bir rezervasyon sınıfına
olan talebin o sınıftaki mevcut koltuk sayısını aşma olasılığı. Bu oran
geriye bakan ROM'u ileriye bağlayan halka. Kaynak metne göre kapanış oranı,
gelecekteki kalkışlar için envanterin ne zaman kapatılması gerektiğine
dair otomasyon kararlarına temel oluşturuyor. Geçmiş uçuşlarda bir sınıfın
ne sıklıkla dolduğu, benzer uçuşlarda o sınıfın ne zaman kapatılacağının
girdisi oluyor.

Yazılım tarafında bu iki metrik farklı tüketicilere gidiyor. Spill rate
sıralaması bir teşhis kuralı: sıralama bozulduğunda alarm üreten bir
kontrol olarak yazılabilir. Closing rate ise bir karar girdisi: envanter
kontrol sisteminin kapanış otomasyonunu besliyor. Aynı veri tabanından
hesaplansalar da biri analistin panosuna, öteki envanter sisteminin
parametre akışına bağlanıyor.

## Ölçümün birimi, havayolunun optimizasyon birimiyle aynı olmalı

AUS-DFW örneği tek bacaklı bir uçuş ve hesap orada temiz: bir uçak, bir
kabin, bir pencere. Çok segmentli ağlarda soru değişiyor. Kaynak metin
kuralı açık koyuyor: bacak ve segment bazlı çalışan taşıyıcılar için gelir
fırsatı ölçümleri uçuş bacağı düzeyinde, O&D (Origin & Destination, çıkış
ve varış noktası) bazlı çalışan taşıyıcılar için ise ağ düzeyinde
hesaplanmalı.

Kuralın arkasındaki mantık, ölçümün kararın verildiği birimde yapılması.
O&D taşıyıcısı koltuğu tek bir bacağın gelirine göre değil, yolculuğun
bütününe göre dağıtıyor. Böyle bir sistemi bacak bacak puanlamak, karar
vermediği bir birimde karne kesmek demek; tavan da taban da yanlış yerde
çizilir.

Kaynak metnin önerisi de bu doğrultuda: çok segmentli uçuşlarda lineer
programlama modelleriyle ağ düzeyinde optimizasyon yapmak ve kârlılığı
segment bazında değil ağ genelinde maksimize etmek. Ölçüm tarafında bu,
ROM'un mükemmel kontrol senaryosunun da ağ düzeyinde kurulması demek.
Yazılım tarafında ise ölçüm sisteminin, envanter kontrolünün hangi
birimde karar verdiğini bilmesi gerekiyor. Leg bazlı bir RM'den O&D'ye
geçen bir havayolu, raporlama katmanını aynı anda değiştirmezse yeni
sistemi eski ölçüyle değerlendirir ve geçişin getirisini göremez.

## Yarın işe yarayacak dört çıkarım

1. **Spill sıralaması tersine döndüğünde indirim tahsisatını daralt.**
   Pahalı sınıflardaki taşma ucuz sınıflardakini geçiyorsa, indirimli
   sınıflara ayrılan koltuk kapasitesini kıs. Beklenen sonuç, yüksek
   değerli yolcu hacminde artış.
2. **Spoilage yüksekse tahminleri aşağı revize et.** Boş kalkan koltuğun
   nedeni çoğu zaman şişkin tahmin. Show-up oranı ve yüksek sınıf talep
   tahminlerini aşağı yönlü düzelt; beklenen sonuç doluluk oranında
   (load factor) iyileşme.
3. **Kazanılan gelir yüzdesi düşükse kontrolsüz senaryoyla gerçekleşeni
   yan yana koy.** "No Controls" ile "Actual" arasındaki farkı analiz et,
   kaybın spoilage mı dilution mı olduğunu ayır ve RM algoritmasının
   kurallarını o yöne göre sıkılaştır. Beklenen sonuç toplam uçuş
   gelirinde artış.
4. **O&D taşıyıcısıysan ağ düzeyinde ölç ve optimize et.** Çok segmentli
   uçuşlarda lineer programlama modelleriyle ağ düzeyinde optimizasyon
   yap ve ROM'u da aynı düzeyde hesapla. Hedef segment bazlı değil, ağ
   genelinde maksimum kârlılık.

Bu bölümde ne yok: reddedilen talebin nasıl tahmin edildiği ("Gelir
yönetiminde beklenen kayıp (spill) ve talep analizi"), show-up oranının
nasıl modellendiği ("Havacılıkta overbooking (fazla rezervasyon) ve
show-up modelleme stratejileri") ve ağ optimizasyonunun kendisi (O&D
bölümleri). Bu bölüm o parçaların ürettiği kararların sonradan nasıl
puanlandığını anlatmak için var.
