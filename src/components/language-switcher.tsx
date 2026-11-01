import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/hooks/use-language'
import { languages } from '@/lib/i18n/config'
import type { LanguageCode } from '@/lib/i18n/config'
import type { TranslationKey } from '@/lib/i18n/catalog'

const languageLabelKeys: Record<LanguageCode, TranslationKey> = {
  en: 'language.english',
  as: 'language.assamese',
  hi: 'language.hindi',
  bn: 'language.bengali',
}

type LanguageSwitcherVariant = 'inline' | 'segmented'

type LanguageSwitcherProps = {
  variant?: LanguageSwitcherVariant
  className?: string
}

export function LanguageSwitcher({
  variant = 'inline',
  className,
}: LanguageSwitcherProps) {
  const { t } = useTranslation()
  const { language: activeLanguage, setLanguage } = useLanguage()
  const isSegmented = variant === 'segmented'

  return (
    <div
      role="group"
      aria-label={t('footer.languageLabel')}
      className={cn(
        'flex items-center',
        isSegmented
          ? 'rounded-lg border border-border bg-background p-0.5'
          : 'flex-wrap justify-center gap-x-1 gap-y-0.5',
        className,
      )}
    >
      {languages.map((language, index) => (
        <Fragment key={language}>
          {index > 0 ? (
            isSegmented ? (
              <span aria-hidden="true" className="h-4 w-px bg-border" />
            ) : (
              <span aria-hidden="true" className="text-[10px] text-muted-foreground/60">
                ·
              </span>
            )
          ) : null}
          <button
            type="button"
            lang={language}
            aria-pressed={activeLanguage === language}
            onClick={() => {
              void setLanguage(language)
            }}
            className={cn(
              'rounded-md text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              isSegmented ? 'min-h-7 px-2.5' : 'min-h-8 px-1',
              activeLanguage === language
                ? 'font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t(languageLabelKeys[language])}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
