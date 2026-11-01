import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  LOCALES,
  printErrors,
  validateCatalogs,
} from './i18n-validation.mjs'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REVIEW_STATUS_PATH = path.join(
  REPO_ROOT,
  'src/lib/i18n/review-status.json',
)

const { catalogs, errors } = await validateCatalogs()

const reviewSource = await readFile(REVIEW_STATUS_PATH, 'utf8')
let reviewStatus

try {
  reviewStatus = JSON.parse(reviewSource)
} catch (error) {
  errors.push(`review-status.json is not valid JSON: ${error.message}`)
}

if (reviewStatus === null || typeof reviewStatus !== 'object' || Array.isArray(reviewStatus)) {
  errors.push('review-status.json must map locale codes to arrays of keys')
} else {
  for (const locale of Object.keys(reviewStatus)) {
    if (!LOCALES.includes(locale) || locale === 'en') {
      errors.push(`review-status.json contains an unsupported locale: ${locale}`)
      continue
    }

    const keys = reviewStatus[locale]

    if (!Array.isArray(keys)) {
      errors.push(`review-status.json:${locale} must be an array`)
      continue
    }

    const seen = new Set()

    for (const key of keys) {
      if (typeof key !== 'string') {
        errors.push(`review-status.json:${locale} contains a non-string key`)
        continue
      }

      if (seen.has(key)) {
        errors.push(`review-status.json:${locale} contains duplicate key ${key}`)
      }
      seen.add(key)

      if (!(key in catalogs[locale])) {
        errors.push(`review-status.json:${locale} references unknown key ${key}`)
      }
    }
  }
}

if (errors.length > 0) {
  printErrors(errors)
  process.exit(1)
}

const draftedCounts = LOCALES.filter((locale) => locale !== 'en').map((locale) => {
  const count = reviewStatus[locale]?.length ?? 0
  return `${locale}: ${count}`
})

console.log(`i18n draft status: ${draftedCounts.join(', ')}`)

const draftedTotal = LOCALES.filter((locale) => locale !== 'en').reduce(
  (total, locale) => total + (reviewStatus[locale]?.length ?? 0),
  0,
)

if (draftedTotal > 0) {
  console.error(
    `Release blocked: ${draftedTotal} machine-drafted key(s) remain in review-status.json.`,
  )
  process.exit(1)
}

console.log('i18n release gate passed.')
