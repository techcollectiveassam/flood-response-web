import { MapPinSearch, Mic, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { normalizeDigits } from '@/lib/normalize-digits'
import { cn } from '@/lib/utils'
import { OptionRadioIndicator } from './option-radio-indicator'

type DesktopSearchCardProps = {
  checked: boolean
  onSelect: () => void
  query: string
  onQueryChange: (query: string) => void
  available?: boolean
}

export function DesktopSearchCard({
  checked,
  onSelect,
  query,
  onQueryChange,
  available = true,
}: DesktopSearchCardProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'rounded-2xl border border-border-subtle bg-card p-5',
        !available && 'opacity-60',
      )}
    >
      <label
        aria-disabled={!available || undefined}
        className={cn(
          'flex min-w-0 items-start gap-3 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/50',
          available ? 'cursor-pointer' : 'cursor-not-allowed',
        )}
      >
        <input
          type="radio"
          name="location-method"
          value="search"
          checked={checked}
          onChange={onSelect}
          disabled={!available}
          aria-label={t('affectedArea.location.search.desktopTitle')}
          className="sr-only"
        />
        <OptionRadioIndicator checked={checked} />

        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <MapPinSearch className="size-5" aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-lg font-bold leading-tight text-foreground">
              {t('affectedArea.location.search.desktopTitle')}
            </span>
            {!available && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                {t('affectedArea.location.methodUnavailable')}
              </span>
            )}
          </span>

          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            {t('affectedArea.location.search.desktopDescription')}
          </span>
        </span>
      </label>

      <div className="mt-4 ml-8 flex items-center gap-2 rounded-xl border border-border-subtle bg-muted/40 p-1.5 pl-4">
        <Search
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          name="location-search"
          value={query}
          disabled={!available}
          onFocus={onSelect}
          onChange={(event) =>
            onQueryChange(normalizeDigits(event.target.value))
          }
          aria-label={t('affectedArea.location.search.desktopTitle')}
          placeholder={t('affectedArea.location.search.placeholder')}
          className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="button"
          disabled
          aria-label={t('affectedArea.voiceUnavailable')}
          title={t('affectedArea.voiceUnavailable')}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-card text-primary transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Mic className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
