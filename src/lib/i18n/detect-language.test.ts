import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  detectBrowserLanguage,
  getPreferredLanguage,
  readStoredLanguage,
  resolveInitialLanguage,
  storeLanguage,
} from './detect-language'
import { LANGUAGE_STORAGE_KEY } from './config'

describe('language detection', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads and writes the stored language', () => {
    expect(readStoredLanguage()).toBeNull()

    storeLanguage('bn')

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('bn')
    expect(readStoredLanguage()).toBe('bn')
  })

  it('ignores unsupported stored values', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr')

    expect(readStoredLanguage()).toBeNull()
  })

  it('detects the first supported browser language', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['fr-FR', 'as-IN', 'en'])

    expect(detectBrowserLanguage()).toBe('as')
  })

  it('prefers stored language over browser language', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['as-IN'])
    storeLanguage('hi')

    expect(getPreferredLanguage()).toBe('hi')
  })

  it('uses the URL only when it normalizes to a supported locale', () => {
    storeLanguage('hi')

    expect(resolveInitialLanguage('/as/sos')).toBe('as')
    expect(resolveInitialLanguage('/as-IN/sos')).toBe('as')
    expect(resolveInitialLanguage('/xx/sos')).toBe('hi')
    expect(resolveInitialLanguage('/sos')).toBe('hi')
    expect(resolveInitialLanguage('/about')).toBe('hi')
    expect(resolveInitialLanguage('/')).toBe('hi')
  })
})
