import { Explainer, type Control } from './base';

/**
 * <c-overbooking> — fazla satış simülasyonu.
 *
 * Gösterdiği şey bölümün tezi: no-show belirsizken hiç fazla satmamak
 * her uçuşta boş koltuk (spoilage) demek; çok fazla satmak ise kapıda
 * yolcu bırakmak (denied boarding). İkisi de bedel. Model, iki bedelin
 * toplamını en aza indiren fazla satış sayısını arıyor — ve o sayı
 * sıfır değil.
 *
 * Uçuş uçuş çalışır: her uçuşta satılan biletlerin her biri no-show
 * olasılığıyla gelmez; gelenler koltuklara oturur, sığmayanlar kapıda
 * kalır, boş kalan koltuklar spoilage'a yazılır. Rastgelelik tohumlu:
 * aynı dt aynı sonucu verir.
 */

const SEATS = 180;
const COLS = 30;
const FLIGHT_EVERY = 0.9;   // sn — bir uçuşun çözülme süresi

interface Flight { shows: number; denied: number; empty: number }

export class OverbookingSim extends Explainer {
  private seed = 1;
  private acc = 0;
  private fill = 0;                 // mevcut uçuşta dolan koltuk sayısı (animasyon)
  private current: Flight | null = null;
  private history: Flight[] = [];
  private flights = 0;
  private totDenied = 0;
  private totEmpty = 0;

  protected controls(): Control[] {
    return [
      { key: 'overbook', label: 'Fazla satış', min: 0, max: 24, step: 1 },
      { key: 'noshow', label: 'No-show', min: 0, max: 15, step: 1, unit: '%' },
    ];
  }

  protected stats() {
    const n = Math.max(1, this.flights);
    return [
      { label: 'Uçuş', value: String(this.flights) },
      { label: 'Boş koltuk / uçuş', value: (this.totEmpty / n).toFixed(1) },
      { label: 'Kapıda kalan / uçuş', value: (this.totDenied / n).toFixed(2) },
    ];
  }

  protected reset() {
    this.seed = 7;
    this.acc = 0; this.fill = 0;
    this.current = null; this.history = [];
    this.flights = this.totDenied = this.totEmpty = 0;
  }

  /** Tohumlu, tekrarlanabilir rastgele sayı. Date.now() yok. */
  private rnd(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  private resolve(): Flight {
    const sold = SEATS + (this.params['overbook'] ?? 0);
    const p = (this.params['noshow'] ?? 0) / 100;
    let shows = 0;
    for (let i = 0; i < sold; i++) if (this.rnd() >= p) shows++;
    const denied = Math.max(0, shows - SEATS);
    const empty = Math.max(0, SEATS - shows);
    return { shows, denied, empty };
  }

  protected step(dt: number) {
    this.acc += dt;
    if (!this.current) this.current = this.resolve();
    // Koltuklar kademeli dolar; süre dolunca uçuş kapanır.
    this.fill = Math.min(this.current.shows, this.current.shows * (this.acc / (FLIGHT_EVERY * 0.7)));
    if (this.acc >= FLIGHT_EVERY) {
      this.history.push(this.current);
      if (this.history.length > 40) this.history.shift();
      this.flights++;
      this.totDenied += this.current.denied;
      this.totEmpty += this.current.empty;
      this.current = this.resolve();
      this.acc = 0; this.fill = 0;
    }
  }

  protected draw() {
    const p = this.palette;
    this.clear();
    const c = this.ctx;

    // — Koltuk ızgarası (sol) —
    const gridW = Math.min(this.w * 0.58, 330);
    const cell = Math.floor(gridW / COLS);
    const rows = Math.ceil(SEATS / COLS);
    const gx = 14, gy = 14;
    const filled = Math.floor(this.fill);
    const denied = this.current ? Math.max(0, Math.floor(this.fill) - SEATS) : 0;
    for (let i = 0; i < SEATS; i++) {
      const x = gx + (i % COLS) * cell, y = gy + Math.floor(i / COLS) * cell;
      const dolu = i < filled;
      this.box(x, y, cell - 2, cell - 2, dolu ? p.mark : p.tinted);
    }
    // Sığmayanlar: ızgaranın altında aksan renginde
    for (let i = 0; i < denied; i++) {
      this.dot(gx + i * (cell) + cell / 2, gy + rows * cell + 10, Math.max(2, cell / 3), p.accent);
    }
    this.label(`${SEATS} koltuk · ${SEATS + (this.params['overbook'] ?? 0)} bilet`, gx, gy + rows * cell + 26, p.muted, 'left');

    // — Geçmiş uçuşlar (sağ): her uçuş bir çubuk; yukarı boş koltuk, aşağı kapıda kalan —
    const hx = gx + gridW + 22, hw = this.w - hx - 14;
    const mid = this.h / 2;
    const n = 40, bw = Math.max(2, hw / n - 1);
    c.strokeStyle = p.border; c.lineWidth = 1;
    c.beginPath(); c.moveTo(hx, mid); c.lineTo(hx + hw, mid); c.stroke();
    this.history.forEach((f, i) => {
      const x = hx + i * (hw / n);
      const up = Math.min(mid - 16, f.empty * 3);
      const down = Math.min(mid - 16, f.denied * 9);
      if (up) this.box(x, mid - up, bw, up, p.muted);
      if (down) this.box(x, mid + 1, bw, down, p.accent);
    });
    this.label('boş koltuk ↑', hx, 12, p.muted, 'left');
    this.label('kapıda kalan ↓', hx, this.h - 12, p.accent, 'left');
  }
}

customElements.define('c-overbooking', OverbookingSim);
