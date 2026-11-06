const APP_SW_PATH = '/sw.js'
const APP_PRECACHE_PREFIX = 'workbox-precache-v2-'

export function getAppPrecacheCacheName(): string {
  const swUrl = new URL(APP_SW_PATH, window.location.origin)
  const scope = new URL('./', swUrl).href
  return `${APP_PRECACHE_PREFIX}${scope}`
}

export async function unregisterAppServiceWorkers(): Promise<void> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(
      registrations.map(async (registration) => {
        const workers = [
          registration.active,
          registration.waiting,
          registration.installing,
        ].filter((worker): worker is ServiceWorker => worker !== null)

        const isAppOwned = workers.some((worker) => {
          const url = new URL(worker.scriptURL)
          return (
            url.origin === window.location.origin && url.pathname === APP_SW_PATH
          )
        })

        if (isAppOwned) {
          await registration.unregister()
        }
      }),
    )
  } catch {
    return
  }
}

export async function clearAppOwnedCaches(): Promise<void> {
  if (typeof caches === 'undefined') {
    return
  }

  try {
    const cacheName = getAppPrecacheCacheName()
    const names = await caches.keys()

    if (names.includes(cacheName)) {
      await caches.delete(cacheName)
    }
  } catch {
    return
  }
}
