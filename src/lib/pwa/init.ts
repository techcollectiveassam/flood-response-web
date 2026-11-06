import { isPwaEnabled } from '@/config/pwa'
import { clearAppOwnedCaches, unregisterAppServiceWorkers } from './cleanup'

export function initPwa() {
  if (isPwaEnabled) {
    return
  }

  void unregisterAppServiceWorkers()
  void clearAppOwnedCaches()
}
