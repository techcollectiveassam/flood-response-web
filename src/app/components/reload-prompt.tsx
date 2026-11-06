import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/button'

const OFFLINE_READY_DISMISS_MS = 5000

export function ReloadPrompt() {
  const { t } = useTranslation()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW()

  useEffect(() => {
    if (!offlineReady) {
      return
    }

    const timeout = window.setTimeout(() => {
      setOfflineReady(false)
    }, OFFLINE_READY_DISMISS_MS)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [offlineReady, setOfflineReady])

  if (!needRefresh && !offlineReady) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex w-full max-w-md flex-col gap-3 rounded-xl border border-border bg-background p-4 text-foreground shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
      >
        {needRefresh ? (
          <>
            <p className="text-sm">{t('pwa.updateAvailable')}</p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                className="min-h-11 px-4"
                onClick={() => setNeedRefresh(false)}
              >
                {t('pwa.dismiss')}
              </Button>
              <Button
                type="button"
                className="min-h-11 px-4"
                onClick={() => void updateServiceWorker(true)}
              >
                {t('pwa.reload')}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm">{t('pwa.offlineReady')}</p>
        )}
      </div>
    </div>
  )
}
