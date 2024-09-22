const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'style/reset.css',
  'style/style.css',
  '/script/script.js',
  './images/ToDoList192x192.png',
  './images/ToDoList512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

/*Permission for notifications */
Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Permiso de notificaciones concedido.");
    }
  });  
