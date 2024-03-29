var CACHE = 'game-of-life_v1';
var TOCACHE = [
    '/',
    '/scripts/game-of-life.js',
    '/scripts/drawer.js',
    '/scripts/controller.js',
    '/styles/main.css'
];


self.addEventListener('install', function(evt) {
    evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
    evt.respondWith(fromCache(evt.request));
    if (evt.request.method == 'GET')
        evt.waitUntil(update(evt.request));
});


function precache() {
    return caches.open(CACHE).then(function(cache) {
        return cache.addAll(TOCACHE);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            return matching || fetch(request);
        });
    });
}

function update(request) {
    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;
    return caches.open(CACHE).then(function(cache) {
        return fetch(request).then(function(response) {
            return cache.put(request, response);
        });
    });
}
