/**
 * Radar serilerini tek yerden okur: src/config.ts -> RADAR_SERIES.
 *
 * Node TypeScript dosyasını import edemediği için kaynak regex'le
 * taranıyor. Burada İKİNCİ BİR LİSTE YOK — kopya tutmak, bir seri
 * eklenince birinin unutulması demek. Format bozulursa sessizce boş
 * dönmüyor, hata veriyor.
 */
import { readFileSync } from 'node:fs';

/** [{ slug, name, driveFolder }] — config.ts'teki sırayla. */
export function radarSerileri(dosya = 'src/config.ts') {
  const src = readFileSync(dosya, 'utf8');
  const blok = /export const RADAR_SERIES = \{([\s\S]*?)\n\} as const;/.exec(src);
  if (!blok) throw new Error(`${dosya}: RADAR_SERIES bloğu bulunamadı — format değişmiş olabilir`);

  const seriler = [];
  const re = /'([a-z0-9-]+)':\s*\{([\s\S]*?)\n\s{2}\}/g;
  let m;
  while ((m = re.exec(blok[1]))) {
    const govde = m[2];
    const al = (k) => new RegExp(`${k}:\\s*'([^']*)'`).exec(govde)?.[1] ?? '';
    seriler.push({ slug: m[1], name: al('name'), driveFolder: al('driveFolder') });
  }
  if (!seriler.length) throw new Error(`${dosya}: RADAR_SERIES boş okundu — regex tutmadı`);
  return seriler;
}
