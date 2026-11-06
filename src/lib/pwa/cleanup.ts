export const APP_CACHE_PREFIXES = ['workbox-precache-']
const APP_SW_PATH = '/sw.js'

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
    const names = await caches.keys()
    await Promise.all(
      names
        .filter((name) =>
          APP_CACHE_PREFIXES.some((prefix) => name.startsWith(prefix)),
        )
        .map((name) => caches.delete(name)),
    )
  } catch {
    return
  }
}
