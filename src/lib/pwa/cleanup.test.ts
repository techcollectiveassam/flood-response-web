import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clearAppOwnedCaches,
  unregisterAppServiceWorkers,
} from './cleanup'

const origin = window.location.origin

function createWorker(scriptURL: string) {
  return { scriptURL } as ServiceWorker
}

function createRegistration({
  active = null,
  waiting = null,
  installing = null,
}: {
  active?: ServiceWorker | null
  waiting?: ServiceWorker | null
  installing?: ServiceWorker | null
} = {}) {
  return {
    active,
    waiting,
    installing,
    unregister: vi.fn().mockResolvedValue(true),
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('unregisterAppServiceWorkers', () => {
  it('unregisters a registration whose active worker is /sw.js', async () => {
    const appRegistration = createRegistration({
      active: createWorker(`${origin}/sw.js`),
    })
    vi.stubGlobal('navigator', {
      serviceWorker: {
        getRegistrations: vi.fn().mockResolvedValue([appRegistration]),
      },
    })

    await unregisterAppServiceWorkers()

    expect(appRegistration.unregister).toHaveBeenCalledOnce()
  })

  it('detects an app-owned worker while waiting or installing', async () => {
    const waitingRegistration = createRegistration({
      waiting: createWorker(`${origin}/sw.js`),
    })
    const installingRegistration = createRegistration({
      installing: createWorker(`${origin}/sw.js`),
    })
    vi.stubGlobal('navigator', {
      serviceWorker: {
        getRegistrations: vi
          .fn()
          .mockResolvedValue([waitingRegistration, installingRegistration]),
      },
    })

    await unregisterAppServiceWorkers()

    expect(waitingRegistration.unregister).toHaveBeenCalledOnce()
    expect(installingRegistration.unregister).toHaveBeenCalledOnce()
  })

  it('leaves registrations owned by other apps untouched', async () => {
    const otherPath = createRegistration({
      active: createWorker(`${origin}/other/sw.js`),
    })
    const otherOrigin = createRegistration({
      active: createWorker('https://other.example/sw.js'),
    })
    vi.stubGlobal('navigator', {
      serviceWorker: {
        getRegistrations: vi
          .fn()
          .mockResolvedValue([otherPath, otherOrigin]),
      },
    })

    await unregisterAppServiceWorkers()

    expect(otherPath.unregister).not.toHaveBeenCalled()
    expect(otherOrigin.unregister).not.toHaveBeenCalled()
  })

  it('does not throw when the service worker API is absent', async () => {
    await expect(unregisterAppServiceWorkers()).resolves.toBeUndefined()
  })
})

describe('clearAppOwnedCaches', () => {
  it('deletes only app-owned caches', async () => {
    const appCache = 'workbox-precache-v2-http://localhost/'
    const foreignCache = 'app-offline-queue'
    const deleteCache = vi.fn().mockResolvedValue(true)
    vi.stubGlobal('caches', {
      keys: vi.fn().mockResolvedValue([appCache, foreignCache]),
      delete: deleteCache,
    })

    await clearAppOwnedCaches()

    expect(deleteCache).toHaveBeenCalledWith(appCache)
    expect(deleteCache).not.toHaveBeenCalledWith(foreignCache)
  })

  it('does not throw when the cache API is absent', async () => {
    await expect(clearAppOwnedCaches()).resolves.toBeUndefined()
  })
})
