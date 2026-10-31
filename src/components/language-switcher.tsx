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

type LanguageSwitcherProps = {
  value: LanguageCode
  onChange: (value: LanguageCode) => void
  className?: string
}

export function LanguageSwitcher({ value, onChange, className }: LanguageSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={t('footer.languageLabel')}
      className={cn('flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5', className)}
    >
      {languages.map((language, index) => (
        <Fragment key={language}>
          {index > 0 ? (
            <span aria-hidden="true" className="text-[10px] text-muted-foreground/60">
              ·
            </span>
          ) : null}
          <button
            type="button"
            aria-pressed={value === language}
            onClick={() => onChange(language)}
            className={cn(
              'min-h-8 rounded-md px-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
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
