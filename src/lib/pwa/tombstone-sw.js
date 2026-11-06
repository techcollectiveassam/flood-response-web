/*
 * Kill-switch service worker emitted in place of the real PWA worker when
 * VITE_PWA_ENABLED is not 'true'. It claims clients before unregistering so
 * existing pages are handed a worker that never serves cached content, and it
 * uses try/finally so a cache-API failure cannot leave the tombstone installed.
 * It must NEVER register a fetch handler: every request passes through to the
 * network. Keep the cache prefix list in sync with src/lib/pwa/cleanup.ts.
 */
self.addEventListener('install', () => {
  void self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim()
      try {
        await deleteAppOwnedCaches()
      } finally {
        await self.registration.unregister()
      }
    })(),
  )
})

async function deleteAppOwnedCaches() {
  const prefixes = ['workbox-precache-']
  const names = await caches.keys()
  await Promise.all(
    names
      .filter((name) => prefixes.some((prefix) => name.startsWith(prefix)))
      .map((name) => caches.delete(name)),
  )
}
