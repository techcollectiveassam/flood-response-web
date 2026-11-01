import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import { languages, t } from '@/lib/i18n'
import type { LanguageCode, TranslationKey } from '@/lib/i18n'

const languageLabelKeys: Record<LanguageCode, TranslationKey> = {
  en: 'language.english',
  as: 'language.assamese',
  hi: 'language.hindi',
  bn: 'language.bengali',
}

type LanguageSwitcherVariant = 'inline' | 'segmented'

type LanguageSwitcherProps = {
  value: LanguageCode
  onChange: (value: LanguageCode) => void
  variant?: LanguageSwitcherVariant
  className?: string
}

export function LanguageSwitcher({
  value,
  onChange,
  variant = 'inline',
  className,
}: LanguageSwitcherProps) {
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
            aria-pressed={value === language}
            onClick={() => onChange(language)}
            className={cn(
              'rounded-md text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              isSegmented ? 'min-h-7 px-2.5' : 'min-h-8 px-1',
              value === language
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
