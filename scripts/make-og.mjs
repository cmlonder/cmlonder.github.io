/**
 * OG kartlarını üretir: public/og/*.png (1200x630).
 *
 *   pnpm og            # hepsini üret
 *   pnpm og essays     # sadece birini
 *
 * Yazı tipleri assets/og-fonts/ altında repoda duruyor ve metin
 * GLIF YOLUNA çevrilip çiziliyor — SVG'ye font adı yazılmıyor.
 *
 * Sebebi: sharp'ın SVG çizicisi (librsvg) @font-face'i yerel dosyayla
 * yüklemiyor, sessizce sisteme düşüyor. Makineye kurulu olmayan Fraunces
 * yerine grotesk bir sans çiziliyor ve kart "üretildi" görünüyordu. Yol
 * olarak çizince font çözümlemesi hiç devreye girmiyor: çıktı bu makinede
 * de CI'da da aynı.
 *
 * Fraunces değişken font olarak dağıtılıyor; buradakiler opsz=144
 * (tokens.css'teki --axis-display) örnekleri. Üçü de OFL.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
// opentype.js CJS olarak geliyor; adlandırılmış import ESM'de tutmuyor.
import opentype from 'opentype.js';
import sharp from 'sharp';

const EN = 1200, BOY = 630;
const SOL = 90;                     // metin başlangıcı
const SAG_BOSLUK = 90;
const BANT = 26;                    // soldaki bordo bant

/*
 * Tipografi ölçüleri elle üretilmiş kartlardan ölçülerek eşlendi:
 * başlık 83px (üç farklı kartta da aynı çıktı), satır adımı 85px —
 * yani kasıtlı olarak sıkı bir satır arası. Bunları değiştirirsen
 * yedi kart da değişir.
 */
const BASLIK = 83;
const SATIR = 85;

// tokens.css ile aynı değerler.
const C = {
  zemin:  '#f6f5f1',
  bant:   '#5f023e',
  metin:  '#353534',
  soluk:  '#666360',
  isaret: '#04a5bb',
};

const yukle = (ad) => opentype.parse(readFileSync(`assets/og-fonts/${ad}`).buffer);
const SERIF_B = yukle('fraunces-144-700.ttf');
const SERIF   = yukle('fraunces-144-400.ttf');
const SANS_B  = yukle('lato-700.ttf');

/**
 * Kart metinleri. Koleksiyon kartlarının sözü src/config.ts içindeki
 * COLLECTION_BLURBS ile aynı: ilk cümle başlık, kalanı alt satır.
 * Orayı değiştirirsen burayı da değiştir ve kartı yeniden üret.
 */
const KARTLAR = {
  default: {
    kicker: 'CEMAL ÖNDER',
    baslik: 'Building software with agents, architecture, and scale.',
    alt: 'Essays · Notes · Playbooks · Signals',
    alan: 'cmlonder.com',
  },
  essays: {
    kicker: 'ESSAYS',
    baslik: 'Finished arguments.',
    alt: 'Long, opinionated, meant to change your mind.',
    alan: 'cmlonder.com',
  },
  notes: {
    kicker: 'NOTES',
    baslik: 'Thinking out loud.',
    alt: 'Unfinished, exploratory, often wrong.',
    alan: 'cmlonder.com',
  },
  playbooks: {
    kicker: 'PLAYBOOKS',
    baslik: 'Repeatable decisions.',
    alt: 'Problem, context, approach, tradeoffs.',
    alan: 'cmlonder.com',
  },
  signals: {
    kicker: 'SIGNALS',
    baslik: 'A link and why it matters.',
    alt: 'Two sentences, no more.',
    alan: 'cmlonder.com',
  },
  library: {
    kicker: 'LIBRARY',
    baslik: 'Books worth the shelf space.',
    alt: 'Systems, work, and myself.',
    alan: 'cmlonder.com',
  },
  radar: {
    kicker: 'RADAR · MAKİNE ÜRETİMİ',
    baslik: 'Bir ajan yazıyor. Her iddia yayından önce makineyle doğrulanıyor.',
    alt: 'Doğrulanamayan iddialar silinmez — işaretlenir.',
    alan: 'cmlonder.com/radar',
  },
};

/**
 * Metni glif yoluna çevirir.
 *
 * Satırın tamamı TEK bir <path> olarak yazılmıyor: librsvg uzun `d`
 * niteliğini sessizce kesiyor. Gözlenen: 39 bin karakterlik bir yol
 * "Long, opinionated, meant to" diye çizilip kalanı düştü, kart yine
 * "üretildi" göründü. O yüzden kelime kelime çiziliyor ve aşağıdaki
 * sınır aşılırsa hata veriliyor.
 */
const YOL_SINIRI = 30000;

function yaz(font, metin, x, y, boyut, renk) {
  const d = font.getPath(metin, x, y, boyut).toSVG(2);
  if (d.length > YOL_SINIRI) {
    throw new Error(`glif yolu çok uzun (${d.length}) — librsvg keser: "${metin}"`);
  }
  /*
   * opentype.js 2.0.0 bazı gliflerde NaN koordinat üretiyordu ("f", "E",
   * "ç"...). librsvg yolu NaN'ın olduğu yerde bırakıyor: kelime yarım
   * çiziliyor, hata yok, kart üretildi görünüyor. Sürüm 1.3.4'te sorun
   * yok ama sessiz kırılma sınıfı aynı — bir daha olursa burada dursun.
   */
  if (d.includes('NaN')) {
    throw new Error(`glif yolunda NaN var — librsvg orada keser: "${metin}"`);
  }
  return d.replace('<path', `<path fill="${renk}"`);
}

function yol(font, metin, x, y, boyut, renk, aralik = 0) {
  let imlec = x;
  const parcalar = [];

  // Harf aralığı yalnızca kicker'da var; orada harf harf ilerliyoruz.
  const birimler = aralik ? [...metin] : metin.split(' ');
  const bosluk = font.getAdvanceWidth(' ', boyut);

  for (const birim of birimler) {
    if (birim) parcalar.push(yaz(font, birim, imlec, y, boyut, renk));
    imlec += font.getAdvanceWidth(birim, boyut) + (aralik || bosluk);
  }
  return parcalar.join('');
}

/** Ölçerek sarar — satır sonlarını elle yazmaya gerek yok. */
function sar(font, metin, boyut, enAzami) {
  const kelimeler = metin.split(' ');
  const satirlar = [];
  let satir = '';
  for (const k of kelimeler) {
    const deneme = satir ? `${satir} ${k}` : k;
    if (satir && font.getAdvanceWidth(deneme, boyut) > enAzami) {
      satirlar.push(satir);
      satir = k;
    } else {
      satir = deneme;
    }
  }
  if (satir) satirlar.push(satir);
  return satirlar;
}

function kartUret(ad, k) {
  const genislik = EN - SOL - SAG_BOSLUK;
  const satirlar = sar(SERIF_B, k.baslik, BASLIK, genislik);
  if (satirlar.length > 3) {
    throw new Error(`${ad}: başlık ${satirlar.length} satır oldu, kart 3 satır alıyor`);
  }

  const parcalar = [
    `<rect width="${EN}" height="${BOY}" fill="${C.zemin}"/>`,
    `<rect width="${BANT}" height="${BOY}" fill="${C.bant}"/>`,
    yol(SANS_B, k.kicker, SOL, 101, 24, C.isaret, 1.8),
    ...satirlar.map((s, i) => yol(SERIF_B, s, SOL, 206 + i * SATIR, BASLIK, C.metin)),
    yol(SERIF, k.alt, SOL, 506, 36, C.soluk),
    yol(SERIF, k.alan, SOL, 591, 30, C.soluk),
  ];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${EN}" height="${BOY}" viewBox="0 0 ${EN} ${BOY}">${parcalar.join('')}</svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(`public/og/${ad}.png`);
}

const istenen = process.argv.slice(2);
const secilen = istenen.length ? istenen : Object.keys(KARTLAR);

mkdirSync('public/og', { recursive: true });
for (const ad of secilen) {
  const k = KARTLAR[ad];
  if (!k) {
    console.error(`bilinmeyen kart: ${ad} (${Object.keys(KARTLAR).join(', ')})`);
    process.exit(1);
  }
  const { size } = await kartUret(ad, k);
  console.log(`public/og/${ad}.png  ${(size / 1024).toFixed(0)} KB`);
}
