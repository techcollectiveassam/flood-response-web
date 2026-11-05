import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  isLanguageCode,
} from './config'
import type { LanguageCode } from './config'
import {
  getFirstPathSegment,
  isLocaleLikeSegment,
  normalizeLocaleSegment,
} from './locale-segment'

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readStoredLanguage(): LanguageCode | null {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  try {
    const value = storage.getItem(LANGUAGE_STORAGE_KEY)
    return value && isLanguageCode(value) ? value : null
  } catch {
    return null
  }
}

export function storeLanguage(language: LanguageCode): void {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}

export function detectBrowserLanguage(): LanguageCode | null {
  if (typeof navigator === 'undefined') {
    return null
  }

  const candidates =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language]

  for (const candidate of candidates) {
    const [base] = candidate.toLowerCase().split('-')
    if (isLanguageCode(base)) {
      return base
    }
  }

  return null
}

export function getPreferredLanguage(): LanguageCode {
  return readStoredLanguage() ?? detectBrowserLanguage() ?? DEFAULT_LANGUAGE
}

export function resolveInitialLanguage(pathname: string): LanguageCode {
  const firstSegment = getFirstPathSegment(pathname)

  if (isLocaleLikeSegment(firstSegment)) {
    const normalized = normalizeLocaleSegment(firstSegment)
    if (normalized) {
      return normalized
    }
  }

  return getPreferredLanguage()
}
