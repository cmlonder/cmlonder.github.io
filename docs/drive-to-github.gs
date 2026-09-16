/**
 * Spark -> Drive -> GitHub  (Google Apps Script)
 *
 * Spark'ın Drive'a yazdığı bülten Doc'larını markdown olarak repodaki
 * inbox/ dizinine iter. Gerisini .github/workflows/radar.yml yapar.
 *
 * KURULUM (bir kez):
 *   1. script.google.com -> Yeni proje -> bu dosyanın içeriğini yapıştır
 *   2. Proje ayarları -> Script properties:
 *        GITHUB_TOKEN  = fine-grained PAT, cmlonder.github.io reposunda
 *                        "Contents: Read and write" izniyle
 *        FOLDER_ID     = Drive klasörünün ID'si (klasör URL'sindeki son parça)
 *   3. Bir kez kur() fonksiyonunu çalıştır -> izinleri onayla
 *      (aynı fonksiyon günlük tetikleyiciyi de kurar)
 *
 * Sonrası tamamen otomatik.
 */

const REPO   = 'cmlonder/cmlonder.github.io';
const SERI   = 'solo-founder';
const BRANCH = 'main';

function kur() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('yeniBultenleriGonder')
    .timeBased().everyDays(1).atHour(8).create();
  Logger.log('Günlük tetikleyici kuruldu (08:00). Şimdi bir kez deneme yapıyorum…');
  yeniBultenleriGonder();
}

function yeniBultenleriGonder() {
  const props    = PropertiesService.getScriptProperties();
  const folderId = props.getProperty('FOLDER_ID');
  if (!folderId) throw new Error('FOLDER_ID script property tanımlı değil');

  const folder = DriveApp.getFolderById(folderId);

  // Spark artık düz .md yazıyor. Google Doc'a gerek yok — ve olmaması
  // daha iyi: Docs'un markdown export'u köşeli parantezi kaçırıyor
  // ("\[1\]"), başlık seviyelerini düzleştiriyor, araya &nbsp; koyuyor.
  // Düz dosyada bunların hiçbiri olmuyor, baytlar olduğu gibi geçiyor.
  const files = folder.getFiles();
  let gonderilen = 0;

  while (files.hasNext()) {
    const file = files.next();
    const ad   = file.getName();
    const id   = file.getId();

    if (file.getMimeType() === MimeType.GOOGLE_DOCS) {
      Logger.log('atlandı (Google Doc, .md bekleniyor): ' + ad);
      continue;
    }
    if (!/\.md$/i.test(ad)) continue;

    const anahtar = 'gonderildi_' + id;

    // Aynı Doc'u iki kez göndermeyelim. Doc sonradan düzenlenirse
    // güncelleme tarihi değiştiği için tekrar gönderilir.
    const damga = props.getProperty(anahtar);
    const guncel = String(file.getLastUpdated().getTime());
    if (damga === guncel) continue;

    const md = file.getBlob().getDataAsString('UTF-8');
    if (!md || md.length < 200) {
      Logger.log('atlandı (çok kısa): ' + ad);
      continue;
    }


    githubaYaz('inbox/radar/' + SERI + '/' + ad, md, ad);
    props.setProperty(anahtar, guncel);
    gonderilen++;
    Logger.log('gönderildi: ' + ad);
  }

  Logger.log(gonderilen + ' bülten gönderildi.');
}

/** GitHub Contents API ile dosyayı yaz (varsa üzerine). */
function githubaYaz(yol, icerik, docAdi, ikili) {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN script property tanımlı değil');

  const api = 'https://api.github.com/repos/' + REPO + '/contents/' + yol;
  const ortak = {
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' },
    muteHttpExceptions: true,
  };

  // Dosya zaten varsa üzerine yazmak için mevcut sha gerekiyor.
  let sha = null;
  const mevcut = UrlFetchApp.fetch(api + '?ref=' + BRANCH, { ...ortak, method: 'get' });
  if (mevcut.getResponseCode() === 200) sha = JSON.parse(mevcut.getContentText()).sha;

  const govde = {
    message: 'Radar kuyruğu: ' + docAdi,
    content: Utilities.base64Encode(ikili ? icerik : Utilities.newBlob(icerik).getBytes()),
    branch: BRANCH,
  };
  if (sha) govde.sha = sha;

  const res = UrlFetchApp.fetch(api, {
    ...ortak, method: 'put', contentType: 'application/json',
    payload: JSON.stringify(govde),
  });
  const kod = res.getResponseCode();
  if (kod !== 200 && kod !== 201) {
    throw new Error('GitHub yazma başarısız (' + kod + '): ' +
                    res.getContentText().slice(0, 300));
  }
}
