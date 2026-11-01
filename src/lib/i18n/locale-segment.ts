import { isLanguageCode } from './config'
import type { LanguageCode } from './config'

const LOCALE_LIKE_PATTERN = /^[a-zA-Z]{2,3}(?:-[a-zA-Z]{2})?$/

export function isLocaleLikeSegment(segment: string): boolean {
  return LOCALE_LIKE_PATTERN.test(segment)
}

export function normalizeLocaleSegment(segment: string): LanguageCode | null {
  const [base] = segment.toLowerCase().split('-')
  return isLanguageCode(base) ? base : null
}

export function getFirstPathSegment(pathname: string): string {
  const [, first = ''] = pathname.split('/')
  return first
}

export function stripLocalePrefix(
  pathname: string,
  language: LanguageCode,
): string {
  const prefix = `/${language}`

  if (pathname === prefix) {
    return ''
  }

  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length)
  }

  return pathname
}

export function buildLocalizedPath(
  language: LanguageCode,
  pathname: string,
): string {
  const rest = stripLocalePrefix(pathname, language)
  return `/${language}${rest === '/' ? '' : rest}`
}
