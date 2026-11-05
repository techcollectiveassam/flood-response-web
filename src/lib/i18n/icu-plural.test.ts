import { createInstance } from 'i18next'
import ICU from 'i18next-icu'
import { describe, expect, it } from 'vitest'
import type { LanguageCode } from '@/lib/i18n/config'

const messages = {
  'plural.basic': '{count, plural, one {one} other {other}}',
  'plural.exact': '{count, plural, =0 {zero} one {one} other {other}}',
}

const pluralLanguages: LanguageCode[] = ['as', 'hi', 'bn']

async function createTestI18n(language: LanguageCode) {
  const i18n = createInstance()

  await i18n.use(ICU).init({
    lng: language,
    fallbackLng: false,
    keySeparator: false,
    nsSeparator: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      [language]: {
        translation: messages,
      },
    },
  })

  return i18n
}

describe('i18next-icu plural behavior', () => {
  it.each(pluralLanguages)('%s treats 0 and 1 as one', (language) => {
    const pluralRules = new Intl.PluralRules(language)

    expect(pluralRules.select(0)).toBe('one')
    expect(pluralRules.select(1)).toBe('one')
    expect(pluralRules.select(2)).toBe('other')
  })

  it.each(pluralLanguages)('%s uses the one branch for 0', async (language) => {
    const i18n = await createTestI18n(language)
    const translate = i18n.t.bind(i18n) as (
      key: string,
      options?: Record<string, unknown>,
    ) => string

    expect(translate('plural.basic', { count: 0 })).toBe('one')
    expect(translate('plural.basic', { count: 1 })).toBe('one')
    expect(translate('plural.basic', { count: 2 })).toBe('other')
  })

  it.each(pluralLanguages)('%s supports an exact =0 branch', async (language) => {
    const i18n = await createTestI18n(language)
    const translate = i18n.t.bind(i18n) as (
      key: string,
      options?: Record<string, unknown>,
    ) => string

    expect(translate('plural.exact', { count: 0 })).toBe('zero')
    expect(translate('plural.exact', { count: 1 })).toBe('one')
    expect(translate('plural.exact', { count: 2 })).toBe('other')
  })

  it('keeps dotted keys flat when keySeparator is disabled', async () => {
    const i18n = await createTestI18n('as')
    const translate = i18n.t.bind(i18n) as (
      key: string,
      options?: Record<string, unknown>,
    ) => string

    expect(translate('plural.basic', { count: 1 })).toBe('one')
  })
})
