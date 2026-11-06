/*
 * Kill-switch service worker emitted in place of the real PWA worker when
 * VITE_PWA_ENABLED is not 'true'. It claims clients before unregistering so
 * existing pages are handed a worker that never serves cached content, and it
 * uses try/finally so a cache-API failure cannot leave the tombstone installed.
 * It must NEVER register a fetch handler: every request passes through to the
 * network. Cache ownership: only the Workbox precache named exactly
 * `workbox-precache-v2-<registration scope>` belongs to this app; other
 * same-origin apps' precaches and non-Workbox caches are never touched. If a
 * custom precache cacheName is configured, update this rule and
 * src/lib/pwa/cleanup.ts together.
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

const APP_PRECACHE_PREFIX = 'workbox-precache-v2-'

function getOwnedPrecacheCacheName() {
  return `${APP_PRECACHE_PREFIX}${self.registration.scope}`
}

async function deleteAppOwnedCaches() {
  const ownedCacheName = getOwnedPrecacheCacheName()
  const names = await caches.keys()
  await Promise.all(
    names
      .filter((name) => name === ownedCacheName)
      .map((name) => caches.delete(name)),
  )
}
