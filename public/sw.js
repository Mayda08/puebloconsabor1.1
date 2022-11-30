const preLoad = function () {
    return caches.open("offline").then(function (cache) {
        // caching index and important routes
        return cache.addAll(filesToCache);
    });
};

const CACHE_INMUTABLE_NAME = 'inmutable-v1';


const cacheinmutable = caches.open(CACHE_INMUTABLE_NAME)
    .then(cache => {
        return cache.addAll([
            'https://fonts.googleapis.com/css?family=Nunito',
            'https://use.fontawesome.com/releases/v5.6.3/css/all.css',
            'https://fonts.googleapis.com/css2?family=Lobster&display=swap',
            'https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&display=swap',
            'https://fonts.googleapis.com/css2?family=Merienda:wght@700&family=Open+Sans+Condensed:wght@300&display=swap',
        ]);
    });
e.respondWith(Promise.all([respuesta, cacheinmutable]));

self.addEventListener("install", function (event) {
    event.waitUntil(preLoad());
});

const filesToCache = [
    '/',
    '/Directorio',
    '/Huejutla',
    '/Contactanos',
    '/login',
    '/css/app.css',
    '/css/css/all.css',
    '/css/styleOriginal.css',
    '/js/app.js',
    '/js/bootstrap.min.js',
    '/storage/uploads/lG696Wpl9T6bGN2My2cb1AfYvHQxsUdbGkTVek95.png',
    '/storage/uploads/Huejutla.jpg',
    '/offline.html',
    '/offline1.html'
];

function limpiarcache(cacheName, numeroItems){
    caches.open(cacheName)
    .then(cache =>{
        return cache.keys()
        .then (keys =>{
            console.log(keys);
        });
    })
}

self.addEventListener('fetch', e=>{
    const respuesta = caches.match(e.request)
    .then(res=> {
        if(res) return res;
        console.log('no existe', e.request.url);

        return fetch(e.request).then(newResp =>{

            caches.open(e.request).then( newResp => {
                cache.put(e.request, newResp)
                limpiarcache(CACHE_DYNAMIC_NAME,5);
            });
            
        });
        return newResp.clone();
    });
});

const checkResponse = function (request) {
    return new Promise(function (fulfill, reject) {
        fetch(request).then(function (response) {
            if (response.status !== 404) {
                fulfill(response);
            } else {
                reject();
            }
        }, reject);
    });
};

const addToCache = function (request) {
    return caches.open("offline").then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
};

const returnFromCache = function (request) {
    return caches.open("offline").then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status === 404) {
                return cache.match("offline.html");
            } else {
                return matching;
            }
        });
    });
};

self.addEventListener("fetch", function (event) {
    event.respondWith(checkResponse(event.request).catch(function () {
        return returnFromCache(event.request);
    }));
    if(!event.request.url.startsWith('http')){
        event.waitUntil(addToCache(event.request));
    }
});
