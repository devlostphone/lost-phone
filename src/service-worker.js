const precacheVersion = self.__precacheManifest
  .map(p => p.revision)
  .join('');
const precacheFiles = self.__precacheManifest.map(p => p.url);

self.addEventListener('install', ev => {
  // Do not finish installing until every file in the app has been cached
  ev.waitUntil(
    caches.open(precacheVersion).then(
      cache => {
        cache.addAll(precacheFiles);
      }
    )
  );
});

// Optionally, to clear previous precaches, also use the following:
self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== precacheVersion).map(
        k => caches.delete(k)
      )
    ))
  );
});


self.addEventListener('fetch', ev => {
  ev.respondWith(
    caches.match(ev.request).then((cachedResponse) => {
      if (process.env.NODE_ENV === 'production') {
        if (cachedResponse) {
          return cachedResponse;
        }
      }
      return fetch(ev.request);
    }),
  );
});

