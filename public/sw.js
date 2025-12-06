self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
});

self.addEventListener('fetch', (e) => {
    // Basic pass-through fetch
    e.respondWith(fetch(e.request));
});
