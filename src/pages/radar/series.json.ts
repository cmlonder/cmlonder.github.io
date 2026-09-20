import type { APIRoute } from 'astro';
import { RADAR_SERIES } from '../../config';

/**
 * Seri listesinin makine tarafı.
 *
 * Drive'daki Apps Script bunu okuyup dosya adındaki seri adını slug'a
 * çeviriyor. Yeni seri açarken tek değişen yer src/config.ts kalsın
 * diye var: liste orada, burada sadece yayınlanıyor.
 */
export const GET: APIRoute = () => {
  // Takma adlar ayrı satır: Apps Script ad -> slug haritasını satır satır
  // kuruyor, script'e dokunmadan eski dosya adları da eşleşiyor.
  const series = Object.entries(RADAR_SERIES).flatMap(([slug, s]) =>
    [s.name, ...((s as { aliases?: readonly string[] }).aliases ?? [])].map((name) => ({
      slug, name, driveFolder: s.driveFolder,
    })));

  return new Response(JSON.stringify({ series }, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
};
