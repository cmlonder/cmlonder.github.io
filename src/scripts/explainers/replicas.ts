import { Explainer, type Control } from './base';

/**
 * <c-replicas> — okuma replikası simülasyonu.
 *
 * Gösterdiği şey playbook'un tezi: okuma yükü darboğazsa replika eklemek
 * işe yarar; ama yazma oranı yükseldikçe replikalar yardım etmeyi bırakır,
 * çünkü her yazma primary'yi meşgul eder VE her replikaya replikasyon işi
 * olarak geri döner. Bu yüzden replika sayısını artırmak yazma ağırlıklı
 * yükte kurtarmıyor — sharding tartışmasının başladığı yer tam da burası.
 */

type Kind = 'read' | 'write' | 'repl';

interface Req {
  kind: Kind;
  target: number;      // 0 = primary, 1..n = replika
  x: number; y: number;
  tx: number; ty: number;
  t: number;           // 0..1 yol ilerlemesi
  work: number;        // kalan servis süresi (sn)
  state: 'flying' | 'queued' | 'serving' | 'done' | 'dropped';
  age: number;
}

interface Node {
  x: number; y: number; w: number; h: number;
  busy: Req[];
  queue: Req[];
  util: number;        // yumuşatılmış doluluk 0..1
  dropFlash: number;
}

const SLOTS = 3;             // düğüm başına eşzamanlı servis
const QUEUE_MAX = 4;
const SERVICE_READ = 0.16;   // sn
const SERVICE_WRITE = 0.30;
const SERVICE_REPL = 0.10;   // replikasyonun replikaya maliyeti

export class ReplicaSim extends Explainer {
  private reqs: Req[] = [];
  private nodes: Node[] = [];
  private spawnAcc = 0;
  private served = 0;
  private dropped = 0;
  private elapsed = 0;

  protected controls(): Control[] {
    return [
      { key: 'rps', label: 'Requests/s', min: 5, max: 60, step: 1 },
      { key: 'read-pct', label: 'Reads', min: 0, max: 100, step: 5, unit: '%' },
      { key: 'replicas', label: 'Replicas', min: 0, max: 4, step: 1 },
    ];
  }

  protected stats() {
    const total = this.served + this.dropped;
    const rate = this.elapsed > 0 ? this.served / this.elapsed : 0;
    const primary = this.nodes[0];
    return [
      { label: 'Served/s', value: rate.toFixed(1) },
      { label: 'Dropped', value: total ? `${Math.round((this.dropped / total) * 100)}%` : '0%' },
      { label: 'Primary load', value: primary ? `${Math.round(primary.util * 100)}%` : '—' },
    ];
  }

  protected reset() {
    this.reqs = [];
    this.served = this.dropped = this.elapsed = this.spawnAcc = 0;
    this.layout();
  }

  private layout() {
    const n = this.params['replicas'] ?? 0;
    const padL = 92, padR = 16, padY = 26;
    const colW = 108;
    const x = Math.min(this.w - padR - colW, padL + 40);
    const rows = n + 1;
    const gap = 10;
    const avail = this.h - padY * 2;
    const hh = Math.max(26, Math.min(46, (avail - gap * (rows - 1)) / rows));
    const totalH = hh * rows + gap * (rows - 1);
    const y0 = (this.h - totalH) / 2;

    this.nodes = Array.from({ length: rows }, (_, i) => ({
      x, y: y0 + i * (hh + gap), w: colW, h: hh,
      busy: [], queue: [], util: 0, dropFlash: 0,
    }));
  }

  protected step(dt: number) {
    if (this.nodes.length !== (this.params['replicas'] ?? 0) + 1) this.layout();
    this.elapsed += dt;

    // — yeni istek üret —
    const rps = this.params['rps'] ?? 10;
    this.spawnAcc += rps * dt;
    while (this.spawnAcc >= 1) {
      this.spawnAcc -= 1;
      this.spawn();
    }

    // — uçuş ve servis —
    for (const r of this.reqs) {
      r.age += dt;
      if (r.state === 'flying') {
        r.t += dt * 2.6;
        // arrive() durumu değiştirir; yoksa aynı istek her karede yeniden
        // kuyruğa girer ve kuyruk anında dolar.
        if (r.t >= 1) { r.t = 1; this.arrive(r); }
      } else if (r.state === 'serving') {
        r.work -= dt;
        if (r.work <= 0) {
          r.state = 'done';
          if (r.kind !== 'repl') this.served++;
        }
      }
    }

    // — kuyruktan servise al —
    for (const node of this.nodes) {
      node.busy = node.busy.filter((r) => r.state === 'serving');
      while (node.busy.length < SLOTS && node.queue.length) {
        const r = node.queue.shift()!;
        r.state = 'serving';
        r.work = r.kind === 'read' ? SERVICE_READ : r.kind === 'write' ? SERVICE_WRITE : SERVICE_REPL;
        node.busy.push(r);
      }
      const load = (node.busy.length + node.queue.length) / (SLOTS + QUEUE_MAX);
      node.util += (load - node.util) * Math.min(1, dt * 4);   // yumuşat
      node.dropFlash = Math.max(0, node.dropFlash - dt * 3);
    }

    this.reqs = this.reqs.filter(
      (r) => r.state === 'flying' || r.state === 'queued' || r.state === 'serving'
    );
    if (this.reqs.length > 600) this.reqs.splice(0, this.reqs.length - 600);
  }

  private spawn() {
    const readPct = this.params['read-pct'] ?? 80;
    const replicas = this.params['replicas'] ?? 0;
    const isRead = Math.random() * 100 < readPct;

    // Yazma her zaman primary'ye. Okuma replika varsa onlara dağılır.
    const target = isRead && replicas > 0
      ? 1 + Math.floor(Math.random() * replicas)
      : 0;

    this.push(isRead ? 'read' : 'write', target);

    // Yazma, her replikaya replikasyon işi olarak geri döner — replikalar bedava değil.
    if (!isRead) for (let i = 1; i <= replicas; i++) this.push('repl', i);
  }

  private push(kind: Kind, target: number) {
    const node = this.nodes[target];
    if (!node) return;
    this.reqs.push({
      kind, target,
      x: 22, y: this.h / 2,
      tx: node.x, ty: node.y + node.h / 2,
      t: 0, work: 0, state: 'flying', age: 0,
    });
  }

  private arrive(r: Req) {
    const node = this.nodes[r.target];
    if (!node) { r.state = 'dropped'; return; }
    if (node.busy.length + node.queue.length >= SLOTS + QUEUE_MAX) {
      r.state = 'dropped';
      node.dropFlash = 1;
      if (r.kind !== 'repl') this.dropped++;
      return;
    }
    r.state = 'queued';
    node.queue.push(r);
  }

  protected draw() {
    const p = this.palette;
    this.clear();

    // kaynak
    this.box(8, this.h / 2 - 16, 28, 32, p.tinted, p.border);
    this.label('in', 22, this.h / 2, p.muted);

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const isPrimary = i === 0;

      const heat = n.dropFlash > 0
        ? `color-mix(in srgb, ${p.accent} ${Math.round(n.dropFlash * 55)}%, ${p.surface})`
        : `color-mix(in srgb, ${p.accent} ${Math.round(n.util * 22)}%, ${p.surface})`;
      this.box(n.x, n.y, n.w, n.h, heat, isPrimary ? p.accent : p.border);

      this.label(isPrimary ? 'primary' : `replica ${i}`, n.x + n.w / 2, n.y + n.h / 2 - 6,
                 isPrimary ? p.accent : p.text);

      // servis yuvaları
      const slotY = n.y + n.h / 2 + 7;
      for (let s = 0; s < SLOTS; s++) {
        const sx = n.x + n.w / 2 - (SLOTS - 1) * 6 + s * 12;
        const r = n.busy[s];
        this.dot(sx, slotY, 3.2, r ? this.colorFor(r.kind) : p.border);
      }

      // kuyruk
      for (let q = 0; q < n.queue.length; q++) {
        this.dot(n.x + n.w + 8 + q * 8, n.y + n.h / 2, 3, this.colorFor(n.queue[q].kind));
      }
    }

    // uçuştaki istekler
    for (const r of this.reqs) {
      if (r.state !== 'flying') continue;
      const e = r.t * r.t * (3 - 2 * r.t);          // ease-in-out
      const x = r.x + (r.tx - r.x) * e;
      const y = r.y + (r.ty - r.y) * e;
      this.dot(x, y, r.kind === 'repl' ? 2 : 3, this.colorFor(r.kind));
    }

    // gösterge
    const legend: [Kind, string][] = [['read', 'read'], ['write', 'write'], ['repl', 'replication']];
    legend.forEach(([k, text], i) => {
      const y = 12 + i * 14;
      this.dot(14, y, 3, this.colorFor(k));
      this.label(text, 22, y, this.palette.muted, 'left');
    });
  }

  private colorFor(k: Kind) {
    return k === 'read' ? this.palette.mark
      : k === 'write' ? this.palette.accent
      : this.palette.muted;
  }
}

if (!customElements.get('c-replicas')) customElements.define('c-replicas', ReplicaSim);
