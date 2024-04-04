const cacheName = 'app-cache-v1';

const assetsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/icons/icon-192x192.png',
];

self.addEventListener('install', event => {
    console.log('[SW] Le service worker est en train de s\'installer.');

    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('[SW] Mise en cache des assets');
                return cache.addAll(assetsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('[SW] Le service worker est activé.');

    event.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (key !== cacheName) {
                        console.log('[SW] Suppression de l’ancien cache', key);
                        return caches.delete(key);
                    }
                }));
            })
    );

    self.clients.claim();
});

self.addEventListener('fetch', event => {
    console.log('[SW] Récupération:', event.request.url);

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(cacheName)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});

self.addEventListener('message', event => {
    console.log('[SW] Message reçu:', event.data);
});
