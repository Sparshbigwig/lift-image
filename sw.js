const CACHE_NAME = 'signet-notices-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './BINTEX.jpg',
  './BOD26.jpg',
  './Sgnet Lift Power failure Caution Poster.jpg',
  './Signet BOD Notice on Sale of Flat.jpg',
  './Signet Water Saving.jpg'
];

// Pre-cache all files into internal memory on first load
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE.map(url => encodeURI(url)));
    })
  );
  self.skipWaiting();
});

// Clean up older cache versions when new slides are added
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercept requests and serve from internal cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
