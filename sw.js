/* Service worker mínimo y honesto.
   - El armazón de la app (HTML e iconos) se guarda para que abra sin conexión.
   - Las llamadas a cotizaciones, tipo de cambio e histórico NUNCA se cachean:
     un precio viejo servido como si fuera actual sería peor que un error.
   Al publicar una versión nueva, sube CACHE una unidad. */
const CACHE = 'seguimiento-v4';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(new Request(u, {cache:'reload'})))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Dominios de datos en vivo: siempre red, nunca caché. */
const LIVE = /finnhub\.io|coingecko\.com|frankfurter|alphavantage\.co|stooq\.com/;

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (LIVE.test(req.url)) return;                     // que falle si no hay red: es información

  const sameOrigin = new URL(req.url).origin === self.location.origin;

  if (sameOrigin && (req.mode === 'navigate' || req.destination === 'document')) {
    // red primero para que las versiones nuevas entren solas; caché si no hay cobertura
    e.respondWith(
      fetch(req)
        .then(r => { caches.open(CACHE).then(c => c.put('./index.html', r.clone())); return r; })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  if (sameOrigin) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(n => {
      if (n.ok) caches.open(CACHE).then(c => c.put(req, n.clone()));
      return n;
    })));
    return;
  }

  // tipografías de Google y demás terceros: caché si está, si no red
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(n => {
    if (n.ok && n.type !== 'opaque') caches.open(CACHE).then(c => c.put(req, n.clone()));
    return n;
  }).catch(() => r)));
});
