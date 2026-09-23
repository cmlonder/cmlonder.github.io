---
title: 'Yazılımda Asıl İş Artık İncelemedir'
description: 'Kod üretimi ucuzladığında en kıt kaynak mühendislik muhakemesi haline gelir. Bu değişim kıdemli mühendis kavramını baştan tanımlıyor.'
pubDate: 2026-02-22
topics: [agentic-development, solution-architecture, code-review, craft]
featured: false
draft: false
placeholder: true
---

Yazılım geliştirmenin en pahalı ve zahmetli kısmının kod yazmak olduğu inancıyla büyüdüm. Bir özelliğin teslim süresini tahmin ederken klavye başında kaç gün geçirileceğini hesaplardım, çünkü en kıt ve değerli kaynak o saatlerdi. Yapay zeka ajanlarıyla çalışmaya başladıktan sonra bu temel varsayım tamamen çöktü. Kod üretimi inanılmaz derecede ucuzladı. Artık tek bir akşamda beş farklı mimari yaklaşımın çalışan prototipini görebiliyorum. Ancak bu beş yaklaşımdan hangisinin doğru olduğuna karar vermek hiç ucuzlamadı, hatta göreceli olarak çok daha kritik ve pahalı hale geldi.

## Kıt olan kaynak yer değiştirdi

Ekonomide temel bir kural vardır: Bir kaynağın maliyeti sıfıra yaklaştığında onun hemen yanındaki tamamlayıcı kaynağın değeri katlanarak artar. Kod üretmek neredeyse bedava olunca ana darboğaz doğrudan mühendislik muhakemesine kaydı. Bu değişiklik gerçekten çözmek istediğimiz soruna mı hizmet ediyor? Bu yeni soyutlama altı ay sonra başımıza ne tür belalar açacak? Bu testin yeşil yanması gerçekte neyi kanıtlıyor? Bu sorular her zaman önemliydi fakat eskiden günlerce süren kod yazma mesaisinin gölgesinde kalıyordu. Artık o gölge kalktı ve insani muhakemenin gerçekte ne kadar yavaş işleyen bir süreç olduğu tüm çıplaklığıyla ortaya çıktı.

Bunun günlük çalışma rutinine yansıması çok nettir: Kod inceleme (review) artık sürecin en sonunda alelacele yapılan bir kalite kontrolü değil, mühendislik işinin ta kendisidir. Bir ajana kapsamlı bir görev verip dönen çıktıyı satır satır sindirmek, eskiden o kodu bizzat yazarken harcadığım zamandan daha azını almıyor. Tek fark şu: Artık o saatleri mekanik yazmaya değil, mimari kararlar almaya ve olası riskleri tartmaya harcıyorum.

## Okumak yazmaktan her zaman daha zordur

Burada yazılımcıların çok iyi bildiği rahatsız edici bir gerçek var: Kod okumak kod yazmaktan katbekat zordur. Kodu bizzat yazarken kararları siz verirsiniz ve her tercihin arkasındaki gerekçe hafızanızda tazedir. Okurken ise başkasının verdiği kararları tersine mühendislikle çözmeniz gerekir, üstelik gerekçeleri bilmeden. Ajanların ürettiği kodlarda bu süreç daha da yıpratıcıdır, çünkü çıktılar her zaman son derece kendinden emin görünür ve tamamen yanlış olduklarında bile ilk bakışta makul dururlar.

Bunu yönetebilmek için okuma sürecini kolaylaştıracak kesin sınırlar koymak şarttır: Küçük ve odaklanmış değişiklikler istemek, her geliştirmenin yanında tam olarak neyi kanıtladığı belli olan testler beklemek ve projedeki kuralları yazılı hale getirmek. Kurallar açıkça yazılıysa çıktının projeye uyup uymadığını anlamak saniyeler sürer. Yazılı olmadığında ise her satırda zihinsel bir kararsızlık yaşanır ve asıl yorgunluk oradan doğar.

## Kıdemli mühendis tanımı değişiyor

Kıdemli bir mühendisin ekibe kattığı değer de tam bu noktada dönüşüyor. Eskiden kıdem, en karmaşık algoritmaları tek başına yazabilme gücüydü. Bugün ise üretilen devasa kod yığınının içindeki gizli kusurları ve tasarım gediklerini hızla teşhis edebilme kabiliyetine evriliyor. Bu ikisi tamamen farklı kaslardır. Mükemmel kod yazan fakat başkasının kodunu incelerken sabırsızlanan harika mühendisler tanıyorum ve yeni çalışma düzeninde en çok zorlananlar da maalesef onlar oluyor.

İşin daha da düşündürücü tarafı, bu dönüşümün sektöre yeni başlayan mühendislerin gelişimini de zorlaştırmasıdır. Sağlam bir muhakeme yeteneği ancak yeterince kötü karar verip o kararların acı sonuçlarıyla yüzleşerek kazanılır. Yazma adımını tamamen ajanlara devreden bir genç mühendisin bu tecrübe döngüsünü nasıl edineceğine dair henüz net bir modelimiz yok. Kendi ekibimde uyguladığım yöntem, ajanın ürettiği çıktıyı bir inceleme egzersizi olarak kullanmak: "Burada hangi mimari risk var" sorusu, "bunu sıfırdan yaz" görevinden çok daha fazla şey öğretiyor.

## Artık neyi ölçüyorum?

Bir süredir çalışma haftamı dikkatle gözlemliyorum: Zamanımın ne kadarı üretime, ne kadarı inceleme ve değerlendirmeye gidiyor? İbre her geçen gün inceleme lehine kayıyor ve bunu bir verimsizlik olarak görmüyorum. Asıl tehlike, kod incelemeyi hala araya sıkıştırılacak ücretsiz bir ek iş gibi planlamaktır. Takvimde resmi yeri olmayan bir iş gerçekte yapılmıyor demektir ve yapay zeka ile çalışırken hakkıyla yapılmayan bir incelemenin faturası doğrudan canlıdaki ürüne kesilir.

