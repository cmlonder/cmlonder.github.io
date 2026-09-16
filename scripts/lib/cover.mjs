/**
 * Bülten kapağı — deterministik, veriden türeyen tipografik SVG.
 *
 * Girdi aynıysa çıktı birebir aynı: hiç rastgelelik yok, tamamı
 * doğrulanmış grafik verisinden hesaplanıyor. Aynı bülten bugün de bir
 * yıl sonra da aynı görseli verir.
 *
 * İnsan yok, telifli malzeme yok, dış servis yok, AI yok.
 */

const W = 1200, H = 420;
const L = 70, R = 70;

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const fmtNum = (v) =>
  v >= 1e6 ? (v / 1e6).toFixed(v % 1e6 ? 1 : 0) + 'M'
: v >= 1e3 ? (v / 1e3).toFixed(v % 1e3 ? 1 : 0) + 'K'
: String(Math.round(v));

/**
 * @param chart  { title, points:[{label,value}] } — doğrulanmış noktalar
 * @param meta   { date, passed, total } — grafik yoksa yedek içerik
 */
export function coverSvg(chart, meta) {
  if (!chart || chart.points.length < 2) return fallbackCover(meta);

  const pts = chart.points;
  const n = pts.length;
  const vals = pts.map((p) => p.value);
  const first = vals[0], last = vals[n - 1];

  const T = 250, HH = 110;
  const max = Math.max(...vals), min = Math.min(...vals, 0), span = (max - min) || 1;
  const x = (i) => L + ((W - L - R) * i) / (n - 1);
  const y = (v) => T + HH - ((v - min) / span) * HH;

  const poly = pts.map((p, i) => `${x(i).toFixed(0)},${y(p.value).toFixed(0)}`).join(' ');
  const dots = pts.map((p, i) =>
    `<circle class="cv-d" cx="${x(i).toFixed(0)}" cy="${y(p.value).toFixed(0)}" r="5"/>`).join('');
  const ticks = pts.map((p, i) =>
    `<text class="cv-tk" x="${x(i).toFixed(0)}" y="${T + HH + 34}" `
    + `text-anchor="${i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}">${esc(p.label)}</text>`).join('');

  // Yüzde değişim yalnızca anlamlıysa. Sıfırdan başlayan seride
  // "%0" veya "%sonsuz" yazmak yanlış olur.
  const delta = first > 0 ? Math.round(((last - first) / first) * 100) : null;
  const pct = delta === null ? ''
    : `<text class="cv-pct" x="${W - R}" y="196" text-anchor="end">${delta > 0 ? '+' : ''}${delta}%</text>`;

  // Rakamlar TEK <text> içinde tspan olarak diziliyor: yerleşimi
  // tarayıcı yapıyor, sabit x konumu hesaplamaya çalışmıyoruz —
  // aksi halde "250K" ile "3M" üst üste biniyordu.
  return `<svg class="cv" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="presentation" aria-hidden="true">
  <text class="cv-kick" x="${L}" y="78">${esc(chart.title)}</text>
  <line class="cv-rule" x1="${L}" y1="100" x2="${W - R}" y2="100"/>
  <text class="cv-big" x="${L}" y="196"><tspan>${fmtNum(first)}</tspan><tspan class="cv-arr" dx="26">&#8594;</tspan><tspan class="cv-to" dx="26">${fmtNum(last)}</tspan></text>
  ${pct}
  <polyline class="cv-ln" points="${poly}"/>${dots}${ticks}
</svg>`;
}

const AYLAR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
               'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

function trTarih(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
  if (!m) return String(iso);
  return `${Number(m[3])} ${AYLAR[Number(m[2]) - 1]} ${m[1]}`;
}

/**
 * Grafik verisi olmayan bülten için: tarih ve doğrulama sayacı.
 * Her iddia bir işaret; kaynağıyla eşleşen dolu, eşleşmeyen boş.
 * Veriden türüyor, uydurma yok.
 */
function fallbackCover(meta = {}) {
  const { date = '', passed = 0, total = 0 } = meta;
  const marks = [];
  const size = 20, gap = 12, y = 300;
  for (let i = 0; i < total; i++) {
    const cx = L + i * (size + gap) + size / 2;
    marks.push(
      `<circle class="${i < passed ? 'cv-m' : 'cv-mo'}" cx="${cx}" cy="${y}" r="${size / 2}"/>`,
    );
  }
  return `<svg class="cv" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="presentation" aria-hidden="true">
  <text class="cv-kick" x="${L}" y="78">Solo Kurucu Bülteni</text>
  <line class="cv-rule" x1="${L}" y1="100" x2="${W - R}" y2="100"/>
  <text class="cv-big" x="${L}" y="214">${esc(trTarih(date))}</text>
  ${marks.join('')}
  ${total ? `<text class="cv-tk" x="${L}" y="${y + 66}">${passed}/${total} iddia kaynağıyla eşleşti</text>` : ''}
</svg>`;
}
