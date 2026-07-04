const CACHE_NAME = "haven-v2";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./residence.html",
  "./amenities.html",
  "./gallery.html",
  "./location.html",
  "./faq.html",
  "./social-media.html",
  "./reserve.html",
  "./404.html",
  "./styles.css",
  "./script.js",
  "./assets/haven-haraya-logo.svg",
  "./assets/favicon.svg",
  "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600,1,400&display=swap"
];

/* ---------- Install: pre-cache critical assets ---------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* ---------- Activate: purge old caches ---------- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* ---------- Fetch handlers ---------- */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // HTML pages: network-first with offline fallback
  if (request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached;
            return new Response(offlinePage(), {
              headers: { "Content-Type": "text/html" }
            });
          })
        )
    );
    return;
  }

  // Static assets: cache-first, then network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});

/* ---------- Offline fallback HTML ---------- */
function offlinePage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Offline - Haven Haraya</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f8f3ea;color:#24231f;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:2rem}
    .wrap{max-width:420px}
    h1{font-size:1.6rem;margin-bottom:.5rem}
    p{font-size:1rem;line-height:1.6;color:#5a5448;margin-bottom:1.5rem}
    a{color:#9e583c;text-decoration:underline;font-weight:500}
    @media(prefers-color-scheme:dark){body{background:#1a1510;color:#f1ece2}p{color:#b5a99a}a{color:#c7885a}}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>You're offline</h1>
    <p>It looks like you've lost your internet connection. Please reconnect and try again.</p>
    <a href="./">Back to Haven Haraya</a>
  </div>
</body>
</html>`;
}
