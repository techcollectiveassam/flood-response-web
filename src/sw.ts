import {
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching'
import type { PrecacheEntry } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { deleteObsoletePrecacheCaches } from '@/lib/pwa/precache-cleanup'

type ActivateEvent = {
  waitUntil: (promise: Promise<void>) => void
}

declare let self: {
  __WB_MANIFEST: Array<PrecacheEntry | string>
  addEventListener: {
    (type: 'activate', listener: (event: ActivateEvent) => void): void
    (
      type: 'message',
      listener: (event: MessageEvent<{ type?: string }>) => void,
    ): void
  }
  skipWaiting: () => Promise<void>
  registration: { scope: string }
}

precacheAndRoute(self.__WB_MANIFEST)
clientsClaim()

self.addEventListener('activate', (event) => {
  event.waitUntil(
    deleteObsoletePrecacheCaches(caches, self.registration.scope),
  )
})

registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), {
    denylist: [/^\/api(\/|$)/],
  }),
)

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    void self.skipWaiting()
  }
})
