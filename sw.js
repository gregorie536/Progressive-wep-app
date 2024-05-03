const cacheName = 'weather-app-cache-v1';

const assetsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    '/icons/icon-192x192.png',
    '/manifest.webmanifest'
];

self.addEventListener('install', event => {
    console.log('[SW] Le service worker est en train de s\'installer.');

    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('[SW] Mise en cache des assets');
                return Promise.all(assetsToCache.map(url => {
                    return cache.add(url).catch(reason => {
                        console.warn(`[SW] Erreur lors de la mise en cache de ${url}: ${reason}`);
                    });
                }));
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

    if (!event.request.url.startsWith('http')) {
        console.log('[SW] Ignoré:', event.request.url);
        return;
    }

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