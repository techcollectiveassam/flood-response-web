import { localeConfig } from './config'
import type { LanguageCode } from './config'

type DateInput = Date | number | string

type RelativeTimeUnit =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'

const UNIT_MS: Record<RelativeTimeUnit, number> = {
  second: 1_000,
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
  week: 604_800_000,
  month: 2_629_800_000,
  quarter: 7_889_400_000,
  year: 31_557_600_000,
}

function singularUnit(
  unit: Intl.RelativeTimeFormatUnit,
): RelativeTimeUnit {
  return (unit.endsWith('s') ? unit.slice(0, -1) : unit) as RelativeTimeUnit
}

const FORMATTER_CACHE_LIMIT = 256

const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>()
const numberFormatters = new Map<string, Intl.NumberFormat>()
const relativeTimeFormatters = new Map<string, Intl.RelativeTimeFormat>()
const listFormatters = new Map<string, Intl.ListFormat>()
const collators = new Map<string, Intl.Collator>()

function cacheKey(language: LanguageCode, options: object): string {
  return `${language}|${JSON.stringify(options)}`
}

function getCachedFormatter<T>(
  cache: Map<string, T>,
  key: string,
  create: () => T,
): T {
  const existing = cache.get(key)
  if (existing !== undefined) {
    return existing
  }

  if (cache.size >= FORMATTER_CACHE_LIMIT) {
    cache.clear()
  }

  const formatter = create()
  cache.set(key, formatter)
  return formatter
}

function intlLocale(language: LanguageCode): string {
  const { intlLocale: base, numberingSystem } = localeConfig[language]
  return `${base}-u-nu-${numberingSystem}`
}

function toTime(value: DateInput): number {
  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === 'number') {
    return value
  }

  return new Date(value).getTime()
}

const DATE_COMPONENT_OPTIONS = [
  'weekday',
  'era',
  'year',
  'month',
  'day',
  'dayPeriod',
  'hour',
  'minute',
  'second',
  'fractionalSecondDigits',
  'timeZoneName',
] as const satisfies readonly (keyof Intl.DateTimeFormatOptions)[]

function hasDateComponentOptions(
  options: Intl.DateTimeFormatOptions,
): boolean {
  return DATE_COMPONENT_OPTIONS.some(
    (option) => options[option] !== undefined,
  )
}

export function formatDate(
  value: DateInput,
  language: LanguageCode,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const formatter = getCachedFormatter(
    dateTimeFormatters,
    cacheKey(language, options),
    () =>
      new Intl.DateTimeFormat(
        intlLocale(language),
        hasDateComponentOptions(options)
          ? options
          : { dateStyle: 'medium', ...options },
      ),
  )

  return formatter.format(toTime(value))
}

export function formatNumber(
  value: number,
  language: LanguageCode,
  options: Intl.NumberFormatOptions = {},
): string {
  const formatter = getCachedFormatter(
    numberFormatters,
    cacheKey(language, options),
    () => new Intl.NumberFormat(intlLocale(language), options),
  )

  return formatter.format(value)
}

export function formatCurrency(
  value: number,
  language: LanguageCode,
  currency = 'INR',
  options: Intl.NumberFormatOptions = {},
): string {
  return formatNumber(value, language, {
    style: 'currency',
    currency,
    ...options,
  })
}

export function formatRelativeTime(
  value: DateInput,
  language: LanguageCode,
  options: {
    now?: DateInput
    unit?: Intl.RelativeTimeFormatUnit
  } = {},
): string {
  const target = toTime(value)
  const now = options.now === undefined ? Date.now() : toTime(options.now)

  if (!Number.isFinite(target)) {
    throw new RangeError('Invalid relative-time date value')
  }

  if (!Number.isFinite(now)) {
    throw new RangeError('Invalid relative-time now value')
  }

  const formatter = getCachedFormatter(
    relativeTimeFormatters,
    language,
    () =>
      new Intl.RelativeTimeFormat(intlLocale(language), { numeric: 'auto' }),
  )

  if (options.unit) {
    const unitMs = UNIT_MS[singularUnit(options.unit)]
    return formatter.format(Math.round((target - now) / unitMs), options.unit)
  }

  const difference = target - now

  const units: RelativeTimeUnit[] = [
    'year',
    'month',
    'week',
    'day',
    'hour',
    'minute',
    'second',
  ]

  for (const unit of units) {
    const unitMs = UNIT_MS[unit]
    if (Math.abs(difference) >= unitMs) {
      return formatter.format(Math.round(difference / unitMs), unit)
    }
  }

  return formatter.format(0, 'second')
}

export function formatList(
  items: string[],
  language: LanguageCode,
  options: Intl.ListFormatOptions = {},
): string {
  const formatter = getCachedFormatter(
    listFormatters,
    cacheKey(language, options),
    () =>
      new Intl.ListFormat(intlLocale(language), {
        style: 'long',
        type: 'conjunction',
        ...options,
      }),
  )

  return formatter.format(items)
}

export function compareText(
  left: string,
  right: string,
  language: LanguageCode,
): number {
  const collator = getCachedFormatter(
    collators,
    language,
    () => new Intl.Collator(intlLocale(language), { sensitivity: 'base' }),
  )

  return collator.compare(left, right)
}

export function formatIdentifier(value: string): string {
  return value
}
