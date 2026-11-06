import { isRouteErrorResponse, useRouteError } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { resolveLanguage } from '@/lib/i18n/config'

export function RouteErrorBoundary() {
  const { t, i18n } = useTranslation()
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language)
  const homePath = `/${language}`
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            {error.status} {error.statusText}
          </h1>
          {error.data ? (
            <p className="text-muted-foreground">
              {typeof error.data === 'string' ? error.data : t('error.description')}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => (window.location.href = homePath)}>
            {t('common.goHome')}
          </Button>
          <Button onClick={() => window.location.reload()}>{t('common.reload')}</Button>
        </div>
      </div>
    )
  }

  if (error instanceof Error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{t('error.title')}</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => (window.location.href = homePath)}>
            {t('common.goHome')}
          </Button>
          <Button onClick={() => window.location.reload()}>{t('common.reload')}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t('error.title')}</h1>
        <p className="text-muted-foreground">{t('error.unexpected')}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => (window.location.href = homePath)}>
          {t('common.goHome')}
        </Button>
        <Button onClick={() => window.location.reload()}>{t('common.reload')}</Button>
      </div>
    </div>
  )
}
