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
  const series = Object.entries(RADAR_SERIES).map(([slug, s]) => ({
    slug, name: s.name, driveFolder: s.driveFolder,
  }));

  return new Response(JSON.stringify({ series }, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
};
