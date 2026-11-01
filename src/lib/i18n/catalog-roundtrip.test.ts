import { describe, expect, it } from 'vitest'
import { catalogs } from './catalog'
import { languages } from './config'

type CatalogSnapshot = {
  keys: string[]
  messages: Record<string, string>
}

function snapshot(catalog: Record<string, string>): CatalogSnapshot {
  return {
    keys: Object.keys(catalog).sort(),
    messages: { ...catalog },
  }
}

describe('i18n catalog round-trip', () => {
  it.each(languages)('%s catalog survives JSON serialization unchanged', (locale) => {
    const catalog = catalogs[locale]
    const serialized = JSON.stringify(catalog)
    const deserialized = JSON.parse(serialized) as Record<string, string>

    expect(snapshot(deserialized)).toEqual(snapshot(catalog))
    expect(Object.keys(deserialized)).toEqual(Object.keys(catalog))
  })

  it.each(languages)('%s keeps dotted keys flat', (locale) => {
    const catalog = catalogs[locale]

    for (const key of Object.keys(catalog)) {
      expect(key.includes('.')).toBe(true)
    }
  })

  it.each(languages)('%s preserves ICU message text exactly', (locale) => {
    const catalog = catalogs[locale]
    const serialized = JSON.stringify(catalog)
    const deserialized = JSON.parse(serialized) as Record<string, string>

    for (const [key, message] of Object.entries(catalog)) {
      expect(deserialized[key]).toBe(message)
    }
  })
})
