const _this = this;
const version = 11;
// const isOnline = true;
const host = _this.location.origin;
const CACHE_NAME = `talepod-v${version}`;
const urlsToCache = ["/", "/index.html"];

// Install service worker
const onInstall = (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => console.error("Error:>>> ", error))
  );
};

/*******/

// Listen for requests
const onFetch = (event) => {
  const { url } = event.request;

  if (url.includes(host)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Clone response to store in cache instead of original response
          // to avoid browser errors
          const cacheCopy = networkResponse.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, cacheCopy);
            })
            .catch((error) =>
              console.error("ServiceWorker:>>> Error:>>>", error)
            );
          return networkResponse;
        })
        .catch((error) => {
          console.error("ServiceWorker:>>> Activate Error:>>>", error);

          return caches.match(event.request);
        })
    );
  } else return;

  // State while revalidate strategy
  // if (url.includes(host)) {
  //   event.respondWith(
  //     caches.match(event.request).then((cachedResponse) => {
  //       // Even if the response is in the cache, we fetch it
  //       // and update the cache for future usage
  //       const fetchPromise = fetch(event.request).then((networkResponse) => {
  //         const cacheCopy = networkResponse.clone();
  //         caches.open(CACHE_NAME).then((cache) => {
  //           cache.put(event.request, cacheCopy);
  //           return networkResponse;
  //         });
  //       });
  //       // We use the currently cached version if it's there
  //       return cachedResponse || fetchPromise; // cached or a network fetch
  //     })
  //   );
  // } else return;
};

/*******/

// Activate service worker
const onActivate = (event) => {
  console.log(`ServiceWorker:>>> (v${version}) Activate:>>>`);
  event.waitUntil(handleActivation());
};

const handleActivation = async () => {
  await clearCaches();
};

const clearCaches = async () => {
  const newCache = [CACHE_NAME];
  const cacheNames = await caches.keys();
  const oldCacheNames = cacheNames.filter((cache) => !newCache.includes(cache));
  // Delete Old Cache (if any)
  await Promise.all(oldCacheNames.map((cacheName) => caches.delete(cacheName)));
};

_this.addEventListener("install", onInstall);
_this.addEventListener("activate", onActivate);
_this.addEventListener("fetch", onFetch);
