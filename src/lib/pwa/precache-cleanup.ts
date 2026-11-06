type CacheStorageLike = {
  keys: () => Promise<string[]>
  delete: (cacheName: string) => Promise<boolean>
}

// Workbox 3 used `workbox-precache-<scope>`; Workbox 4+ uses the v2 name.
const OBSOLETE_PRECACHE_NAMES = (scope: string) => [
  `workbox-precache-${scope}`,
]

export async function deleteObsoletePrecacheCaches(
  cacheStorage: CacheStorageLike,
  scope: string,
): Promise<void> {
  const obsoleteNames = OBSOLETE_PRECACHE_NAMES(scope)
  const cacheNames = await cacheStorage.keys()
  await Promise.all(
    obsoleteNames
      .filter((name) => cacheNames.includes(name))
      .map((name) => cacheStorage.delete(name)),
  )
}
