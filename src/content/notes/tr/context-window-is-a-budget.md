---
title: 'Context penceresi bir kap değil, bir bütçe'
description: '"Daha fazla yapıştır" belli bir repo boyutundan sonra neden çalışmıyor — yarım kalmış bir düşünce.'
pubDate: 2026-08-30
status: seedling
topics: [agentic-development]
tags: [context-engineering]
draft: false
placeholder: true
---

Context penceresini uzun süre bir kap gibi düşündüm: ne kadar büyükse o
kadar çok şey sığar, sığdırabildiğim kadar sığdırayım. "Daha fazla
yapıştır" stratejisi küçük repolarda gerçekten çalışıyor da, o yüzden
alışkanlık hâline geliyor.

Belli bir boyuttan sonra çalışmayı bırakıyor ve sebebi kapasite değil.
Pencereye koyduğun her şey, modelin dikkatini bölüştürmek zorunda
olduğu bir paydaya ekleniyor. İlgisiz iki bin satır eklediğinde
pencerenin dolmasından çok önce, asıl ilgili elli satırın ağırlığını
düşürmüş oluyorsun. Yani kap değil bütçe: harcadığın her token,
başka bir şeyin payından gidiyor.

Bunu kabul edince kararlar değişiyor. Soru "bu sığar mı" olmaktan
çıkıp "bu, yerini aldığı şeyden daha mı değerli" hâline geliyor.
Tool tanımları da bu bütçeye dahil, ve genelde kimsenin aklına
gelmiyor; on tane tool tanımı her turda sessizce yer kaplıyor.

Burada takıldığım nokta şu: bütçeyi ölçebiliyorum ama değeri
ölçemiyorum. Hangi dosyanın gerçekten işe yaradığını anlamanın tek
yolu şimdilik çıkarıp sonuca bakmak, bu da yavaş ve gürültülü bir
deney. Belki de doğru yaklaşım, dosyaları tek tek değerlendirmek
yerine görev tipine göre sabit paketler tanımlamak. Emin değilim,
daha denemedim.
