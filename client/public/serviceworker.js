const version = 1;
const host = self.location.origin;
const CACHE_NAME = `talepod-v${version}`;
const urlsToCache = ["/", "/index.html", "/create", "/explore", "/story/:id"];

// Install service worker
const onInstall = (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) =>
        console.error("❌ Failed to install Service Worker!", { error })
      )
  );
};

// Listen for requests
const onFetch = (event) => {
  const { url } = event.request;

  // TODO: Uncomment if serving the client through server side.
  // // Bypass service worker for API requests
  // if (event.request.url.includes("/api/")) return;

  if (url.includes(host)) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Clone response to store in cache instead of original response to avoid browser errors
          const cacheCopy = networkResponse.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, cacheCopy);
            })
            .catch((error) =>
              console.error(
                `❌ Failed to open ${CACHE_NAME} in ServiceWorker!`,
                { error }
              )
            );
          return networkResponse;
        })
        .catch((error) => {
          console.error("❌ Failed to activate Service Worker!", { error });

          return caches.match(event.request);
        })
    );
  } else return;
};

// Activate service worker
const onActivate = (event) => {
  console.log(`✅ ServiceWorker (v${version}) Activated.`);
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

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("fetch", onFetch);
