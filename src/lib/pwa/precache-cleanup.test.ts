import { describe, expect, it, vi } from 'vitest'
import { deleteObsoletePrecacheCaches } from './precache-cleanup'

describe('deleteObsoletePrecacheCaches', () => {
  it('deletes only known obsolete precaches for this scope', async () => {
    const scope = 'https://flood.example/'
    const obsolete = `workbox-precache-${scope}`
    const current = `workbox-precache-v2-${scope}`
    const otherAppObsolete = 'workbox-precache-https://flood.example/other/'
    const otherAppCurrent = 'workbox-precache-v2-https://flood.example/other/'
    const deleteCache = vi.fn().mockResolvedValue(true)
    const cacheStorage = {
      keys: vi
        .fn()
        .mockResolvedValue([
          obsolete,
          current,
          otherAppObsolete,
          otherAppCurrent,
        ]),
      delete: deleteCache,
    }

    await deleteObsoletePrecacheCaches(cacheStorage, scope)

    expect(deleteCache).toHaveBeenCalledWith(obsolete)
    expect(deleteCache).not.toHaveBeenCalledWith(current)
    expect(deleteCache).not.toHaveBeenCalledWith(otherAppObsolete)
    expect(deleteCache).not.toHaveBeenCalledWith(otherAppCurrent)
  })

  it('does nothing when no obsolete cache exists', async () => {
    const scope = 'https://flood.example/'
    const deleteCache = vi.fn().mockResolvedValue(true)
    const cacheStorage = {
      keys: vi.fn().mockResolvedValue([`workbox-precache-v2-${scope}`]),
      delete: deleteCache,
    }

    await deleteObsoletePrecacheCaches(cacheStorage, scope)

    expect(deleteCache).not.toHaveBeenCalled()
  })
})
