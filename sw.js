self.onmessage = (ev) => {
    console.log('Worker received message:', ev);
    self.postMessage('Hello from worker!');
}


self.addEventListener("fetch", (e) => {
    console.log("[SW] Fetching url:", e.request.url);
    e.respondWith((async () => {
        const match = await caches.match(e.request);
        if (match) return match;

        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        cache.put(e.request, response.clone());
        return response;
    })());
});
