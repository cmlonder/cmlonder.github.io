import type { APIRoute } from 'astro';
import { TRANSLATION_TARGETS } from '../../config';

/** Hedef dillerin listesi — Apps Script buradan okur, her dil için /translate-queue/<dil>.json çeker. */
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ from: 'tr', targets: TRANSLATION_TARGETS, queue: '/translate-queue/<lang>.json' }, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' },
  });
