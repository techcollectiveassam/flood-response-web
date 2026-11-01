import { localeConfig } from './config'
import type { LanguageCode } from './config'

type DateInput = Date | number | string

const UNIT_MS: Partial<Record<Intl.RelativeTimeFormatUnit, number>> = {
  second: 1_000,
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
  week: 604_800_000,
  month: 2_629_800_000,
  year: 31_557_600_000,
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

export function formatDate(
  value: DateInput,
  language: LanguageCode,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat(intlLocale(language), {
    dateStyle: 'medium',
    ...options,
  }).format(toTime(value))
}

export function formatNumber(
  value: number,
  language: LanguageCode,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(intlLocale(language), options).format(value)
}

export function formatCurrency(
  value: number,
  language: LanguageCode,
  currency = 'INR',
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(intlLocale(language), {
    style: 'currency',
    currency,
    ...options,
  }).format(value)
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
  const formatter = new Intl.RelativeTimeFormat(intlLocale(language), {
    numeric: 'auto',
  })

  if (options.unit) {
    const unitMs = UNIT_MS[options.unit] ?? 1_000
    return formatter.format(Math.round((target - now) / unitMs), options.unit)
  }

  const difference = target - now

  const units: Intl.RelativeTimeFormatUnit[] = [
    'year',
    'month',
    'week',
    'day',
    'hour',
    'minute',
    'second',
  ]

  for (const unit of units) {
    const unitMs = UNIT_MS[unit] ?? 1_000
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
  return new Intl.ListFormat(intlLocale(language), {
    style: 'long',
    type: 'conjunction',
    ...options,
  }).format(items)
}

export function compareText(
  left: string,
  right: string,
  language: LanguageCode,
): number {
  return new Intl.Collator(intlLocale(language), {
    sensitivity: 'base',
  }).compare(left, right)
}

export function formatIdentifier(value: string): string {
  return value
}
