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

/**
 * ELLE TEST — günlük tetikleyiciyi beklemeden çalıştır.
 *
 * "Gönderildi" damgalarını temizler, böylece daha önce gönderilmiş
 * Doc'lar da yeniden gönderilir. Editörde fonksiyon listesinden
 * testGonder seç -> Çalıştır -> Yürütmeler sekmesinden sonucu izle.
 */
function testGonder() {
  const props = PropertiesService.getScriptProperties();
  const hepsi = props.getProperties();
  let n = 0;
  for (const k of Object.keys(hepsi)) {
    if (k.indexOf('gonderildi_') === 0) { props.deleteProperty(k); n++; }
  }
  Logger.log(n + ' damga temizlendi, yeniden gönderiliyor…');
  yeniBultenleriGonder();
}

/**
 * Bağlantıları sınar; hiçbir şey göndermez.
 * Token ve klasör doğru mu, Doc'ta görsel var mı — hepsini söyler.
 */
function kontrolEt() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('GITHUB_TOKEN');
  const folderId = props.getProperty('FOLDER_ID');
  Logger.log('GITHUB_TOKEN : ' + (token ? 'tanımlı (' + token.length + ' karakter)' : 'YOK'));
  Logger.log('FOLDER_ID    : ' + (folderId || 'YOK'));
  if (!token || !folderId) return;

  const res = UrlFetchApp.fetch('https://api.github.com/repos/' + REPO, {
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' },
    muteHttpExceptions: true,
  });
  Logger.log('GitHub erişimi: HTTP ' + res.getResponseCode() +
             (res.getResponseCode() === 200 ? ' — tamam' : ' — token veya izin hatalı'));

  const files = DriveApp.getFolderById(folderId).getFilesByType(MimeType.GOOGLE_DOCS);
  let n = 0;
  while (files.hasNext()) {
    const f = files.next();
    const g = ilkGorsel(f.getId());
    Logger.log('  Doc: ' + f.getName() +
               ' | güncellendi: ' + f.getLastUpdated().toISOString().slice(0, 16) +
               ' | görsel: ' + (g ? g.uzanti + ' ' + Math.round(g.bytes.length / 1024) + ' KB' : 'YOK'));
    n++;
  }
  Logger.log(n + ' Doc bulundu.');
}

function yeniBultenleriGonder() {
  const props    = PropertiesService.getScriptProperties();
  const folderId = props.getProperty('FOLDER_ID');
  if (!folderId) throw new Error('FOLDER_ID script property tanımlı değil');

  const files = DriveApp.getFolderById(folderId).getFilesByType(MimeType.GOOGLE_DOCS);
  let gonderilen = 0;

  while (files.hasNext()) {
    const file = files.next();
    const id   = file.getId();
    const anahtar = 'gonderildi_' + id;

    // Aynı Doc'u iki kez göndermeyelim. Doc sonradan düzenlenirse
    // güncelleme tarihi değiştiği için tekrar gönderilir.
    const damga = props.getProperty(anahtar);
    const guncel = String(file.getLastUpdated().getTime());
    if (damga === guncel) continue;

    let md = docuMarkdownOlarakAl(id);
    if (!md || md.length < 200) {
      Logger.log('atlandı (çok kısa): ' + file.getName());
      continue;
    }

    // Doc'a gömülü ilk görsel varsa kapak olarak kullanılıyor.
    // Docs'un markdown export'u görselleri süreli googleusercontent
    // bağlantısına çeviriyor — o yüzden ikili veriyi biz taşıyoruz.
    const gorsel = ilkGorsel(id);
    if (gorsel) {
      const yol = 'public/radar/' + id + '.' + gorsel.uzanti;
      githubaYaz(yol, gorsel.bytes, file.getName() + ' (kapak)', true);
      md = 'image: /radar/' + id + '.' + gorsel.uzanti + '\n' + md;
      Logger.log('  kapak: ' + yol + ' (' + Math.round(gorsel.bytes.length / 1024) + ' KB)');
    }

    githubaYaz('inbox/radar/' + SERI + '/' + id + '.md', md, file.getName());
    props.setProperty(anahtar, guncel);
    gonderilen++;
    Logger.log('gönderildi: ' + file.getName());
  }

  Logger.log(gonderilen + ' bülten gönderildi.');
}

/**
 * Doc'un içindeki ilk gömülü görseli ikili olarak döndürür.
 * Yoksa null — kapak isteğe bağlı.
 */
function ilkGorsel(fileId) {
  const body = DocumentApp.openById(fileId).getBody();
  const imgs = body.getImages();
  if (!imgs.length) return null;
  const blob = imgs[0].getBlob();
  const tip = blob.getContentType() || '';
  const uzanti = tip.indexOf('png') >= 0 ? 'png'
               : tip.indexOf('webp') >= 0 ? 'webp'
               : tip.indexOf('gif') >= 0 ? 'gif' : 'jpg';
  return { bytes: blob.getBytes(), uzanti: uzanti };
}

/** Google Doc -> markdown. Drive v3 export, Docs'un kendi dönüştürücüsü. */
function docuMarkdownOlarakAl(fileId) {
  const url = 'https://www.googleapis.com/drive/v3/files/' + fileId +
              '/export?mimeType=text%2Fmarkdown';
  const res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Doc export başarısız (' + res.getResponseCode() + '): ' +
                    res.getContentText().slice(0, 200));
  }
  return res.getContentText();
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
