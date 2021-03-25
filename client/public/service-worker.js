const APP_PREFIX = "Movie-Search";
const VERSION = "v1";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "/",
  "/src/componentsFooter.js",
  "/src/componentsLoginForm.js",
  "/src/componentsNavbar.js",
  "/src/componentsSignupForm.js",
  "/src/pagesSavedMovies.js",
  "/src/pagesSearchMovies.js",
  "/src/App.js",
  "/src/index.css",
  "/src/index.js",
  "/manifest.json",
];
// install
self.addEventListener('install', function(e) {
  e.waitUntil(
      caches.open('pwa-example').then(function(cache) {
          return cache.addAll([
              '/',
              '/index.html',
              '/app.js',
              '/app.css' //Add any other assets your web page needs
          ]);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
          return response || fetch(event.request);
      })
  );
});

// activate
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// fetch
self.addEventListener("fetch", (evt) => {
  if (evt.request.url.includes("/api/")) {
    console.log("[Service Worker] Fetch(data)", evt.request.url);

    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(evt.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch((err) => {
            return cache.match(evt.request);
          });
      })
    );
    return;
  }

  evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request).then((response) => {
        return response || fetch(evt.request);
      });
    })
  );
});
