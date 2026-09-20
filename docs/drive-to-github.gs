/**
 * Spark -> Drive (ana dizin) -> seri klasörü + GitHub  (Google Apps Script)
 *
 * Spark her bülteni Drive'ın ANA DİZİNİNE şu adla yazıyor:
 *
 *     <Seri Adı>-PARSE-YYYY-MM-DD.md
 *     örn. Solo-Girisimci-Bulteni-PARSE-2026-09-18.md
 *
 * Bu script dört iş yapıyor:
 *   1. Ana dizinde bu kalıba uyan dosyaları bulur — başka hiçbir şeye dokunmaz
 *   2. Addaki seri adını /radar/series.json ile eşleştirip slug'ı bulur
 *   3. GitHub'a inbox/radar/<slug>/<tarih>.md olarak iter
 *   4. Drive'da seri klasörüne taşıyıp adını <tarih>.md yapar (klasör yoksa açar)
 *
 * SIRA ÖNEMLİ: önce GitHub, sonra taşıma. Push başarısız olursa dosya ana
 * dizinde kalıyor ve bir sonraki koşuda tekrar deneniyor. Bu yüzden eski
 * sürümdeki "gönderildi mi" defteri kaldırıldı — dosyanın yeri zaten defter.
 *
 * SERİ LİSTESİ BU DOSYADA YOK. Repodaki src/config.ts içindeki RADAR_SERIES
 * tek kaynak; site onu /radar/series.json olarak yayınlıyor. Yeni seri açmak
 * için buraya dokunmuyorsun: config.ts'e bir satır, deploy, bitti.
 *
 * KURULUM (bir kez):
 *   1. script.google.com -> Yeni proje -> bu dosyanın içeriğini yapıştır
 *   2. Proje ayarları -> Script properties:
 *        GITHUB_TOKEN = fine-grained PAT, cmlonder.github.io reposunda
 *                       "Contents: Read and write" izniyle
 *      (FOLDER_ID artık gerekmiyor — ana dizin taranıyor.)
 *   3. Bir kez kur() çalıştır -> izinleri onayla; günlük tetikleyici kurulur
 *
 * Bir şey taşımadan ne olacağını görmek için: deneme()
 */

const REPO       = 'cmlonder/cmlonder.github.io';
const BRANCH     = 'main';
const SERIES_URL = 'https://cmlonder.com/radar/series.json';

/** <Seri Adı>-PARSE-YYYY-MM-DD.md — ana dizinde SADECE buna uyanlara dokunulur. */
const AD_KALIBI = /^(.+)-PARSE-(\d{4}-\d{2}-\d{2})\.(?:md|markdown)$/i;

/** Gövde bundan kısaysa dosya yarım yazılmıştır; kuyruğa sokmuyoruz. */
const ASGARI_UZUNLUK = 200;

function kur() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('bultenleriIsle').timeBased().everyDays(1).atHour(8).create();
  Logger.log('Günlük tetikleyici kuruldu (08:00). Şimdi bir kez deneme yapıyorum…');
  bultenleriIsle();
}

/**
 * Karşılaştırma anahtarı: Türkçe harfler katlanır, küçültülür, harf ve
 * rakam dışındaki her şey atılır.
 *
 *   "Solo Girişimci Bülteni" -> sologirisimcibulteni
 *   "Solo-Kurucu-Bulteni" -> solokurucubulteni
 *   "solo-founder"        -> solofounder
 *
 * Ayırıcıyı tamamen atmasının sebebi bu: Spark dosya adında boşluk yerine
 * tire kullanıyor ve Türkçe harfleri düşürüyor. İkisi de aynı anahtara
 * çıkmak zorunda.
 */
function anahtar(s) {
  var TR = { 'ç':'c','Ç':'c','ğ':'g','Ğ':'g','ı':'i','İ':'i','ö':'o','Ö':'o','ş':'s','Ş':'s','ü':'u','Ü':'u' };
  return String(s).split('').map(function (c) { return TR[c] || c; })
    .join('').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** { anahtar -> { slug, name, driveFolder } }. Hem seri adı hem slug eşleşir. */
function seriHaritasi() {
  var res = UrlFetchApp.fetch(SERIES_URL, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) {
    throw new Error('Seri listesi alınamadı (' + res.getResponseCode() + '): ' + SERIES_URL);
  }
  var seriler = JSON.parse(res.getContentText()).series || [];
  if (!seriler.length) throw new Error('Seri listesi boş döndü: ' + SERIES_URL);

  var harita = {};
  seriler.forEach(function (s) {
    harita[anahtar(s.name)] = s;
    harita[anahtar(s.slug)] = s;
  });
  return harita;
}

/** 'Radar/Solo Girişimci Bülteni' -> klasörü bulur, yoksa sırayla oluşturur. */
function klasorYolu(yol) {
  var parca = yol.split('/').filter(function (p) { return p.trim().length; });
  var klasor = DriveApp.getRootFolder();
  for (var i = 0; i < parca.length; i++) {
    var alt = klasor.getFoldersByName(parca[i]);
    klasor = alt.hasNext() ? alt.next() : klasor.createFolder(parca[i]);
  }
  return klasor;
}

/** Aynı adda dosya varsa "2026-09-18 (2).md" diye ilerler. */
function benzersizAd(klasor, ad) {
  if (!klasor.getFilesByName(ad).hasNext()) return ad;
  var nokta = ad.lastIndexOf('.');
  var govde = ad.slice(0, nokta), uzanti = ad.slice(nokta);
  for (var i = 2; i < 100; i++) {
    var deneme = govde + ' (' + i + ')' + uzanti;
    if (!klasor.getFilesByName(deneme).hasNext()) return deneme;
  }
  return govde + ' (' + Date.now() + ')' + uzanti;
}

/**
 * Ana dizindeki kalıba uyan dosyaları çözümler.
 * Taşıma ya da gönderme YAPMAZ — hem işleyici hem deneme() bunu kullanır.
 */
function bekleyenler() {
  var harita = seriHaritasi();
  var files = DriveApp.getRootFolder().getFiles();
  var liste = [];

  while (files.hasNext()) {
    var file = files.next();
    var ad = file.getName();
    var m = AD_KALIBI.exec(ad);
    if (!m) continue;                                   // ana dizindeki her şeye dokunmuyoruz

    var seri = harita[anahtar(m[1])];
    liste.push({
      file: file,
      ad: ad,
      seriAdi: m[1],
      tarih: m[2],
      seri: seri || null,
      hata: seri ? null : 'seri eşleşmedi: "' + m[1] + '" (/radar/series.json içinde yok)',
    });
  }
  return liste;
}

/** Hiçbir şeye dokunmadan ne olacağını yazar. */
function deneme() {
  var liste = bekleyenler();
  if (!liste.length) { Logger.log('Ana dizinde kalıba uyan dosya yok.'); return; }

  liste.forEach(function (i) {
    if (i.hata) { Logger.log('✗ ' + i.ad + ' — ' + i.hata); return; }
    Logger.log('→ ' + i.ad +
      '\n   GitHub : inbox/radar/' + i.seri.slug + '/' + i.tarih + '.md' +
      '\n   Drive  : ' + i.seri.driveFolder + '/' + i.tarih + '.md');
  });
  Logger.log(liste.length + ' dosya bulundu. (deneme — hiçbiri taşınmadı)');
}

function bultenleriIsle() {
  var liste = bekleyenler();
  if (!liste.length) { Logger.log('Ana dizinde kalıba uyan dosya yok.'); return; }

  var gonderilen = 0, atlanan = 0;

  liste.forEach(function (i) {
    if (i.hata) { Logger.log('atlandı — ' + i.ad + ': ' + i.hata); atlanan++; return; }

    var md = i.file.getBlob().getDataAsString('UTF-8');
    if (!md || md.length < ASGARI_UZUNLUK) {
      Logger.log('atlandı (çok kısa, ' + (md ? md.length : 0) + ' karakter): ' + i.ad);
      atlanan++;
      return;
    }

    // Ad ile frontmatter aynı günü söylemeli. Söylemiyorsa yayına giren
    // frontmatter'daki tarih olur; burada sadece uyarı bırakıyoruz.
    var fmTarih = /^---[\s\S]*?\bdate:\s*['"]?(\d{4}-\d{2}-\d{2})/.exec(md);
    if (fmTarih && fmTarih[1] !== i.tarih) {
      Logger.log('UYARI ' + i.ad + ': ad ' + i.tarih + ' diyor, frontmatter ' + fmTarih[1]);
    }

    var hedef = 'inbox/radar/' + i.seri.slug + '/' + i.tarih + '.md';

    // Önce GitHub. Burası patlarsa dosya ana dizinde kalır, yarın tekrar denenir.
    githubaYaz(hedef, md, i.ad);

    // Sonra Drive düzeni: seri klasörü + sade ad.
    var klasor = klasorYolu(i.seri.driveFolder);
    i.file.setName(benzersizAd(klasor, i.tarih + '.md'));
    i.file.moveTo(klasor);

    gonderilen++;
    Logger.log('gönderildi: ' + i.ad + ' -> ' + hedef);
  });

  Logger.log(gonderilen + ' bülten gönderildi' + (atlanan ? ', ' + atlanan + ' dosya bırakıldı' : '') + '.');
}

/** GitHub Contents API ile dosyayı yaz (varsa üzerine). */
function githubaYaz(yol, icerik, kaynakAd) {
  var token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN script property tanımlı değil');

  var api = 'https://api.github.com/repos/' + REPO + '/contents/' + yol;
  var ortak = {
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' },
    muteHttpExceptions: true,
  };

  // Dosya zaten varsa üzerine yazmak için mevcut sha gerekiyor.
  var sha = null;
  var mevcut = UrlFetchApp.fetch(api + '?ref=' + BRANCH, { headers: ortak.headers, muteHttpExceptions: true, method: 'get' });
  if (mevcut.getResponseCode() === 200) sha = JSON.parse(mevcut.getContentText()).sha;

  var govde = {
    message: 'Radar kuyruğu: ' + kaynakAd,
    content: Utilities.base64Encode(Utilities.newBlob(icerik).getBytes()),
    branch: BRANCH,
  };
  if (sha) govde.sha = sha;

  var res = UrlFetchApp.fetch(api, {
    headers: ortak.headers, muteHttpExceptions: true,
    method: 'put', contentType: 'application/json',
    payload: JSON.stringify(govde),
  });
  var kod = res.getResponseCode();
  if (kod !== 200 && kod !== 201) {
    throw new Error('GitHub yazma başarısız (' + kod + '): ' + res.getContentText().slice(0, 300));
  }
}
