import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { catalogs, resources } from './catalog'
import { languages } from './config'

const i18nDirectory = path.join(process.cwd(), 'src/lib/i18n')
const localesDirectory = path.join(i18nDirectory, 'locales')
const reviewStatusPath = path.join(i18nDirectory, 'review-status.json')
const catalogSourcePath = path.join(i18nDirectory, 'catalog.ts')

describe('i18n catalog guard', () => {
  it('registers exactly the supported locales', () => {
    expect(Object.keys(catalogs).sort()).toEqual([...languages].sort())
    expect(Object.keys(resources).sort()).toEqual([...languages].sort())
  })

  it('keeps review tracking outside the locale catalog directory', () => {
    const localeFiles = readdirSync(localesDirectory)
      .filter((file) => file.endsWith('.json'))
      .sort()

    expect(localeFiles).toEqual(['as.json', 'bn.json', 'en.json', 'hi.json'])
    expect(reviewStatusPath.startsWith(localesDirectory)).toBe(false)
    expect(existsSync(reviewStatusPath)).toBe(true)
  })

  it('does not import review status into the catalog module', () => {
    const source = readFileSync(catalogSourcePath, 'utf8')

    expect(source).not.toContain('review-status')
  })
})
