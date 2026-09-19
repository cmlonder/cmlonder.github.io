/**
 * Açıklayıcı yükleyici. Sayfada custom element yoksa hiçbir şey indirilmez.
 * Yeni bir açıklayıcı eklerken buraya bir satır yazmak yeterli.
 */
const REGISTRY: Record<string, () => Promise<unknown>> = {
  'c-replicas': () => import('./replicas'),
  'c-overbooking': () => import('./overbooking'),
};

for (const [tag, load] of Object.entries(REGISTRY)) {
  if (document.querySelector(tag)) load();
}
