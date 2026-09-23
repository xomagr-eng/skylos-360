/* ΣΚΥΛΟΣ 360° — service worker (offline λειτουργία)
   ΑΛΛΑΞΕ το VERSION σε κάθε αλλαγή αρχείων, ώστε οι χρήστες να πάρουν τη νέα έκδοση. */
const VERSION = 'skylos360-v5';
const SHELL = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-192.png', './icons/maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  /* Μόνο αρχεία της ίδιας της εφαρμογής. Φωτογραφίες (Wikimedia) και βίντεο (YouTube)
     δεν αποθηκεύονται — περνούν κατευθείαν στο δίκτυο, μόνο όταν τα ζητήσει ο χρήστης. */
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    /* Σελίδα: πρώτα δίκτυο (για νέες εκδόσεις), αλλιώς η αποθηκευμένη (offline). */
    e.respondWith(fetch(req.url, { cache: 'no-cache' }).then(r => { /* επανέλεγχος με τον server (ETag) */
      const copy = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return r;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  /* Υπόλοιπα (εικονίδια, manifest): πρώτα cache. */
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  })));
});
