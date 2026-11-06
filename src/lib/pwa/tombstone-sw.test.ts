/// <reference types="node" />
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createContext, runInContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

const tombstoneSource = readFileSync(
  path.join(process.cwd(), 'src/lib/pwa/tombstone-sw.js'),
  'utf8',
)

type TombstoneContext = {
  deleteAppOwnedCaches: () => Promise<void>
}

function loadTombstone(scope: string, cacheNames: string[]) {
  const deleteCache = vi.fn().mockResolvedValue(true)
  const self = {
    addEventListener: vi.fn(),
    skipWaiting: vi.fn(),
    clients: { claim: vi.fn() },
    registration: { scope, unregister: vi.fn() },
  }
  const caches = {
    keys: vi.fn().mockResolvedValue(cacheNames),
    delete: deleteCache,
  }
  const context = createContext({ self, caches }) as TombstoneContext
  runInContext(tombstoneSource, context)

  return { context, deleteCache }
}

describe('tombstone service worker cache cleanup', () => {
  it('deletes only the precache for its own registration scope', async () => {
    const scope = 'https://flood.example/'
    const ownedCache = `workbox-precache-v2-${scope}`
    const otherAppCache = 'workbox-precache-v2-https://flood.example/other/'
    const foreignCache = 'app-offline-queue'
    const { context, deleteCache } = loadTombstone(scope, [
      ownedCache,
      otherAppCache,
      foreignCache,
    ])

    await context.deleteAppOwnedCaches()

    expect(deleteCache).toHaveBeenCalledWith(ownedCache)
    expect(deleteCache).not.toHaveBeenCalledWith(otherAppCache)
    expect(deleteCache).not.toHaveBeenCalledWith(foreignCache)
  })
})
