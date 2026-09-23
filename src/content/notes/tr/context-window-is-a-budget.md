---
title: 'Bağlam penceresi bir depo değil, bir bütçedir'
description: 'Belli bir proje boyutundan sonra her şeyi modele yapıştırma alışkanlığının neden çöktüğüne dair sesli düşünceler.'
pubDate: 2026-08-30
status: seedling
topics: [agentic-development, context-engineering]
draft: false
placeholder: true
---

Yapay zeka modellerinin bağlam penceresini uzun süre dipsiz bir depo gibi gördüm. Pencere ne kadar büyükse içeriye o kadar çok dosya atabilirim ve ne kadar çok veri sığdırırsam model o kadar iyi anlar diye düşünüyordum. Küçük kod tabanlarında her şeyi isteme yapıştırmak gerçekten sonuç verdiği için bu yaklaşım hızla yerleşik bir reflekse dönüştü.

Fakat proje büyüdükçe bu taktik aniden iflas ediyor ve işin ilginç yanı sorun pencerenin dolması da değil. Modele sunduğunuz her yeni satır, dikkat mekanizmasının bölüştürülmek zorunda olduğu devasa bir paydaya ekleniyor. İstem içerisine iki bin satırlık ilgisiz bir modülü tıkıştırdığınızda teknik kapasiteyi aşmasanız bile, asıl kritik olan elli satırlık mantığın ağırlığını görünmez hale getiriyorsunuz. Yani bağlam penceresi sınırsızca doldurulacak bir kutu değil, dikkatle harcanması gereken bir bütçedir. Boşa harcanan her token, asıl gereken düşünme payından çalıyor.

Bu gerçeği kabul edince çalışma tarzı da kökten değişiyor. Artık "bu dosyayı da ekleyebilir miyiz" diye sormak yerine "bu dosya yerini alacağı diğer ayrıntılardan daha mı kıymetli" sorusu öne çıkıyor. Üstelik fonksiyon ve araç tanımları da bu bütçenin doğrudan bir parçası. Geliştiricilerin çoğu bunu gözden kaçırıyor, oysa onlarca araç şeması her etkileşim turunda bağlamı sessizce tüketiyor.

Şimdilik aşamadığım açmaz ise şu: Token miktarını ölçmek çok kolay ama bilginin modele kattığı net değeri ölçmek neredeyse imkansız. Hangi dosyanın ajanın aklını gerçekten açtığını anlamanın tek yolu şimdilik onu bağlamdan çıkarıp sonucu gözlemlemek, bu da son derece yavaş ve belirsiz bir deneme süreci yaratıyor. Belki de doğru yöntem dosyaları tek tek tartmak yerine, görev tipine göre optimize edilmiş sabit bağlam paketleri kurgulamaktır.

