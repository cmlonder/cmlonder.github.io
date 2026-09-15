/**
 * İnteraktif açıklayıcılar için ortak taban.
 *
 * Yöntem samwho.dev'den: simülasyon, yazının içine düz HTML olarak gömülen bir
 * custom element. Parametreler HTML niteliği. Markdown'a dokunmadan çalışır,
 * MDX gerekmez, framework yok.
 *
 *   <c-replicas rps="30" read-pct="90" replicas="2"
 *               description="..."></c-replicas>
 *
 * Bu sınıf şunları halleder: canvas ölçekleme, oynat/durdur/sıfırla, hız,
 * ekrandan çıkınca duraklatma, prefers-reduced-motion, ve renklerin siteyle
 * aynı token'lardan okunması (tema değişince simülasyon da değişir).
 */

export interface Control {
  key: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  /** Değerin yanında görünen birim. */
  unit?: string;
}

export type Palette = Record<
  'bg' | 'surface' | 'tinted' | 'text' | 'muted' | 'border' | 'accent' | 'mark',
  string
>;

const TOKENS: Record<keyof Palette, string> = {
  bg: '--c-bg',
  surface: '--c-surface',
  tinted: '--c-tinted',
  text: '--c-text',
  muted: '--c-muted',
  border: '--c-border',
  accent: '--c-accent',
  mark: '--c-mark',
};

export abstract class Explainer extends HTMLElement {
  protected ctx!: CanvasRenderingContext2D;
  protected w = 0;
  protected h = 0;
  protected palette!: Palette;
  protected params: Record<string, number> = {};

  private canvas!: HTMLCanvasElement;
  private raf = 0;
  private last = 0;
  private running = false;
  private visible = false;
  private reduced = false;
  private readouts = new Map<string, HTMLElement>();
  private playBtn!: HTMLButtonElement;
  private observers: (() => void)[] = [];

  /** Alt sınıf doldurur. */
  protected abstract controls(): Control[];
  protected abstract reset(): void;
  /** dt saniye cinsinden. */
  protected abstract step(dt: number): void;
  protected abstract draw(): void;
  /** Kontrollerin altında gösterilecek canlı sayılar. */
  protected stats(): { label: string; value: string }[] {
    return [];
  }

  connectedCallback() {
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // readParams build'den ÖNCE olmalı — slider'lar bu değerlerle kurulur.
    this.readParams();
    this.build();
    this.readPalette();
    this.resize();
    this.reset();
    this.draw();

    const ro = new ResizeObserver(() => { this.resize(); this.draw(); });
    ro.observe(this);
    this.observers.push(() => ro.disconnect());

    // Ekran dışındayken CPU harcama.
    const io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (!this.visible) this.pause(); else if (!this.reduced) this.play();
    }, { threshold: 0.2 });
    io.observe(this);
    this.observers.push(() => io.disconnect());

    // Tema değişince paleti tazele.
    const mo = new MutationObserver(() => { this.readPalette(); this.draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onScheme = () => { this.readPalette(); this.draw(); };
    mq.addEventListener('change', onScheme);
    this.observers.push(() => { mo.disconnect(); mq.removeEventListener('change', onScheme); });
  }

  disconnectedCallback() {
    this.pause();
    this.observers.forEach((off) => off());
  }

  // — kurulum —

  private build() {
    const desc = this.getAttribute('description') ?? '';
    const figure = document.createElement('figure');
    figure.className = 'ex';

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('role', 'img');
    if (desc) this.canvas.setAttribute('aria-label', desc);
    this.ctx = this.canvas.getContext('2d')!;
    figure.append(this.canvas);

    const bar = document.createElement('div');
    bar.className = 'ex-bar';

    this.playBtn = document.createElement('button');
    this.playBtn.type = 'button';
    this.playBtn.className = 'ex-play';
    figure.append(bar);

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'ex-reset';
    resetBtn.textContent = '↺';
    resetBtn.setAttribute('aria-label', 'Reset');

    bar.append(this.playBtn, resetBtn);

    for (const c of this.controls()) {
      const wrap = document.createElement('label');
      wrap.className = 'ex-ctl';
      const name = document.createElement('span');
      name.textContent = c.label;
      const input = document.createElement('input');
      input.type = 'range';
      input.min = String(c.min); input.max = String(c.max);
      input.step = String(c.step ?? 1);
      input.value = String(this.params[c.key] ?? c.min);
      const out = document.createElement('output');
      out.textContent = input.value + (c.unit ?? '');
      input.addEventListener('input', () => {
        this.params[c.key] = Number(input.value);
        out.textContent = input.value + (c.unit ?? '');
        this.reset();
        this.draw();
      });
      wrap.append(name, input, out);
      bar.append(wrap);
    }

    const stats = document.createElement('dl');
    stats.className = 'ex-stats';
    for (const s of this.stats()) {
      const dt = document.createElement('dt'); dt.textContent = s.label;
      const dd = document.createElement('dd'); dd.textContent = s.value;
      this.readouts.set(s.label, dd);
      stats.append(dt, dd);
    }
    if (this.readouts.size) figure.append(stats);

    if (desc) {
      const cap = document.createElement('figcaption');
      cap.textContent = desc;
      figure.append(cap);
    }

    this.playBtn.addEventListener('click', () => (this.running ? this.pause() : this.play()));
    resetBtn.addEventListener('click', () => { this.reset(); this.draw(); this.syncStats(); });

    this.append(figure);
    this.syncPlayLabel();
  }

  private readParams() {
    for (const c of this.controls()) {
      const raw = this.getAttribute(c.key);
      const n = raw === null ? c.min : Number(raw);
      this.params[c.key] = Number.isFinite(n) ? Math.min(c.max, Math.max(c.min, n)) : c.min;
    }
  }

  private readPalette() {
    const cs = getComputedStyle(document.documentElement);
    this.palette = Object.fromEntries(
      Object.entries(TOKENS).map(([k, v]) => [k, cs.getPropertyValue(v).trim()])
    ) as Palette;
  }

  private resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.w = rect.width || this.clientWidth || 600;
    this.h = rect.height || 200;
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // — döngü —

  private play() {
    if (this.running || !this.visible) return;
    this.running = true;
    this.syncPlayLabel();
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.running) return;
      const dt = Math.min((now - this.last) / 1000, 0.1); // sekme geri gelince sıçramasın
      this.last = now;
      this.step(dt);
      this.draw();
      this.syncStats();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private pause() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.syncPlayLabel();
  }

  private syncPlayLabel() {
    const playing = this.running;
    this.playBtn.textContent = playing ? '❙❙' : '▶';
    this.playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    this.playBtn.setAttribute('aria-pressed', String(playing));
  }

  private syncStats() {
    for (const s of this.stats()) {
      const el = this.readouts.get(s.label);
      if (el && el.textContent !== s.value) el.textContent = s.value;
    }
  }

  // — çizim yardımcıları —

  protected clear() {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

  protected box(x: number, y: number, w: number, h: number, fill: string, stroke?: string) {
    const c = this.ctx;
    c.beginPath();
    c.roundRect(x, y, w, h, 5);
    c.fillStyle = fill;
    c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
  }

  protected dot(x: number, y: number, r: number, fill: string) {
    const c = this.ctx;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fillStyle = fill;
    c.fill();
  }

  protected label(text: string, x: number, y: number, color: string, align: CanvasTextAlign = 'center') {
    const c = this.ctx;
    c.fillStyle = color;
    c.font = '11px ui-sans-serif, system-ui, sans-serif';
    c.textAlign = align;
    c.textBaseline = 'middle';
    c.fillText(text, x, y);
  }
}
