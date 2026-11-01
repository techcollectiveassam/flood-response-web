import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { useLanguage } from '@/hooks/use-language'

export function NotFoundPage() {
  const { t } = useTranslation()
  const { language } = useLanguage()

  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          404
        </p>
        <h1 className="text-2xl font-semibold">{t('notFound.title')}</h1>
        <p className="text-muted-foreground">{t('notFound.description')}</p>
      </div>
      <Link to={`/${language}`} className={buttonVariants()}>
        {t('common.goHome')}
      </Link>
    </section>
  )
}
