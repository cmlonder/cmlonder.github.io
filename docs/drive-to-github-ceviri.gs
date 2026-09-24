/**
 * Çeviri kuryesi — Drive ile GitHub arasında dosya taşır. ÇEVİRMEZ; çeviren Spark.
 *
 *   site /translate-queue/index.json  -> hedef diller (site config)
 *   site /translate-queue/<dil>.json  -> hedef dilde karşılığı olmayan Türkçe yazılar, ham GitHub URL'leri
 *     -> ceviriKuyrugunuIndir()  02:00  her kaynağı Drive/Ceviri/Kuyruk/<dil>/<dil>--<koleksiyon>--<slug>.md olarak indirir
 *     -> Spark görevi (docs/spark-prompt-ceviri.md, dil başına)  04:00  köke Ceviri-PARSE-<dil>--<koleksiyon>--<slug>.md yazar
 *     -> cevirileriIsle()  09:00  GitHub inbox/translations/'a iter; kaynak Kuyruk -> Islendi, çıktı -> Gonderilen
 *     -> repo: check-translations kapısı -> src/content/<koleksiyon>/<dil>/
 *
 * Radar kuryesinden (drive-to-github.gs) AYRI Apps Script projesi: ayrı tetikleyici,
 * ayrı log; biri patlayınca diğeri durmaz. GITHUB_TOKEN script property'si aynı
 * token, bu projede de tanımlanır. Kurulum: yapıştır, GITHUB_TOKEN'ı gir, kur() çalıştır.
 */

const REPO   = 'cmlonder/cmlonder.github.io';
const BRANCH = 'main';
const CEVIRI_DILLER_URL = 'https://cmlonder.com/translate-queue/index.json';
const CEVIRI_KALIBI = /^Ceviri-PARSE-([a-z]{2}--[a-z]+--[a-z0-9-]+(?:--[a-z0-9-]+)?)\.(?:md|markdown)$/i;
const ASGARI_UZUNLUK = 200;

function kur() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('ceviriKuyrugunuIndir').timeBased().everyDays(1).atHour(2).create();
  ScriptApp.newTrigger('cevirileriIsle').timeBased().everyDays(1).atHour(9).create();
  Logger.log('Tetikleyiciler kuruldu: kuyruk 02:00, gönderim 09:00. Şimdi kuyruğu bir kez indiriyorum…');
  ceviriKuyrugunuIndir();
}

function ceviriKuyrugunuIndir() {
  var d = UrlFetchApp.fetch(CEVIRI_DILLER_URL, { muteHttpExceptions: true });
  if (d.getResponseCode() !== 200) { Logger.log('Dil listesi alınamadı: ' + d.getResponseCode()); return; }
  var diller = JSON.parse(d.getContentText()).targets || [];
  diller.forEach(function (dil) {
    var res = UrlFetchApp.fetch('https://cmlonder.com/translate-queue/' + dil + '.json', { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) { Logger.log(dil + ': kuyruk alınamadı'); return; }
    var kuyruk = JSON.parse(res.getContentText()).items || [];
    var klasor = klasorYolu('Ceviri/Kuyruk/' + dil), islendi = klasorYolu('Ceviri/Islendi/' + dil);
    var indirilen = 0;
    kuyruk.forEach(function (i) {
      var ad = i.inbox + '.md';                                   // <dil>--<koleksiyon>--<slug>.md
      if (klasor.getFilesByName(ad).hasNext() || islendi.getFilesByName(ad).hasNext()) return;
      var kaynak = UrlFetchApp.fetch(i.raw, { muteHttpExceptions: true });
      if (kaynak.getResponseCode() !== 200) { Logger.log('indirilemedi: ' + i.raw); return; }
      klasor.createFile(ad, kaynak.getContentText('UTF-8'), 'text/markdown');
      indirilen++;
    });
    Logger.log(dil + ': ' + indirilen + ' kaynak indirildi (kuyrukta ' + kuyruk.length + ').');
  });
}

function cevirileriIsle() {
  var files = DriveApp.getRootFolder().getFiles();
  var gonderilen = 0;
  var giden = klasorYolu('Ceviri/Gonderilen');
  while (files.hasNext()) {
    var file = files.next();
    var m = CEVIRI_KALIBI.exec(file.getName());
    if (!m) continue;
    var md = file.getBlob().getDataAsString('UTF-8');
    if (!md || md.length < ASGARI_UZUNLUK || md.indexOf('---') !== 0) { Logger.log('atlandı (kısa ya da frontmatter yok): ' + file.getName()); continue; }
    var hedef = 'inbox/translations/' + m[1] + '.md';
    githubaYaz(hedef, md, 'Çeviri: ' + m[1]);                 // önce GitHub, patlarsa kökte kalır
    file.setName(benzersizAd(giden, m[1] + '.md')); file.moveTo(giden);
    var dil = m[1].slice(0, 2);                                // kaynak Kuyruk/<dil> -> Islendi/<dil>
    var k = klasorYolu('Ceviri/Kuyruk/' + dil).getFilesByName(m[1] + '.md');
    while (k.hasNext()) { var kf = k.next(); kf.moveTo(klasorYolu('Ceviri/Islendi/' + dil)); }
    gonderilen++;
    Logger.log('çeviri gönderildi: ' + hedef);
  }
  Logger.log(gonderilen + ' çeviri gönderildi.');
}

/* — Ortak yardımcılar (radar kuryesiyle aynı; iki proje birbirinden bağımsız çalışsın diye kopya) — */

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
    message: 'Çeviri kuyruğu: ' + kaynakAd,
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
