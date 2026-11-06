import { precacheAndRoute } from 'workbox-precaching'
import type { PrecacheEntry } from 'workbox-precaching'

declare let self: { __WB_MANIFEST: Array<PrecacheEntry | string> }

precacheAndRoute(self.__WB_MANIFEST)
