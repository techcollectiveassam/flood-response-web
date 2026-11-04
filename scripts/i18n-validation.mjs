import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from '@formatjs/icu-messageformat-parser'

export const LOCALES = ['en', 'as', 'hi', 'bn']

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const LOCALES_DIR = path.join(REPO_ROOT, 'src/lib/i18n/locales')

function addArgument(state, name, type, key) {
  const existing = state.arguments.get(name)

  if (existing && existing !== type) {
    state.errors.push(
      `${key}: argument "${name}" is used as both ${existing} and ${type}`,
    )
    return
  }

  state.arguments.set(name, type)
}

function addSelector(state, type, name, options, key) {
  const branches = Object.keys(options)

  state.selectors.push({ type, name, branches, key })
}

function collectNode(node, state, key) {
  switch (node.type) {
    case 'argument':
      addArgument(state, node.value, 'argument', key)
      break
    case 'number':
      addArgument(state, node.value, 'number', key)
      break
    case 'date':
      addArgument(state, node.value, 'date', key)
      break
    case 'time':
      addArgument(state, node.value, 'time', key)
      break
    case 'select':
      addArgument(state, node.value, 'select', key)
      addSelector(state, 'select', node.value, node.options, key)
      for (const option of Object.values(node.options)) {
        for (const child of option.value) {
          collectNode(child, state, key)
        }
      }
      break
    case 'plural':
    case 'selectordinal':
      addArgument(state, node.value, node.type, key)
      addSelector(state, node.type, node.value, node.options, key)
      for (const option of Object.values(node.options)) {
        for (const child of option.value) {
          collectNode(child, state, key)
        }
      }
      break
    case 'tag':
      for (const child of node.children) {
        collectNode(child, state, key)
      }
      break
    case 'pound':
    case 'literal':
      break
    default:
      break
  }
}

function analyzeMessage(message, key, errors) {
  let ast

  try {
    ast = parse(message)
  } catch (error) {
    errors.push(`${key}: invalid ICU message (${error.message})`)
    return null
  }

  const state = {
    arguments: new Map(),
    selectors: [],
    errors,
  }

  for (const node of ast) {
    collectNode(node, state, key)
  }

  return state
}

function selectorSignature(selector) {
  return `${selector.type}:${selector.name}`
}

function compareSelectors(enSelectors, targetSelectors, key, locale, errors) {
  const targetBySignature = new Map()

  for (const selector of targetSelectors) {
    const signature = selectorSignature(selector)
    const entries = targetBySignature.get(signature) ?? []
    entries.push(selector)
    targetBySignature.set(signature, entries)
  }

  const enBySignature = new Map()

  for (const selector of enSelectors) {
    const signature = selectorSignature(selector)
    const entries = enBySignature.get(signature) ?? []
    entries.push(selector)
    enBySignature.set(signature, entries)
  }

  for (const [signature, enEntries] of enBySignature) {
    const targetEntries = targetBySignature.get(signature) ?? []

    if (targetEntries.length !== enEntries.length) {
      errors.push(
        `${locale}:${key}: expected ${enEntries.length} ${signature} selector(s), found ${targetEntries.length}`,
      )
      continue
    }

    for (const [index, enSelector] of enEntries.entries()) {
      const targetSelector = targetEntries[index]
      const enStandard = enSelector.branches.filter((branch) => !branch.startsWith('='))
      const targetStandard = targetSelector.branches.filter(
        (branch) => !branch.startsWith('='),
      )

      if (enSelector.type === 'select') {
        const enBranches = [...enSelector.branches].sort()
        const targetBranches = [...targetSelector.branches].sort()

        if (enBranches.join('|') !== targetBranches.join('|')) {
          errors.push(
            `${locale}:${key}: select branches for "${enSelector.name}" differ (en: ${enBranches.join(', ') || 'none'}; ${locale}: ${targetBranches.join(', ') || 'none'})`,
          )
        }
        continue
      }

      const enSet = new Set(enStandard)
      const targetSet = new Set(targetStandard)

      for (const branch of enSet) {
        if (!targetSet.has(branch)) {
          errors.push(
            `${locale}:${key}: missing plural branch "${branch}" for "${enSelector.name}"`,
          )
        }
      }

      for (const branch of targetSet) {
        if (!enSet.has(branch)) {
          errors.push(
            `${locale}:${key}: unsupported plural branch "${branch}" for "${enSelector.name}" (use an exact =N branch for locale-specific values)`,
          )
        }
      }
    }
  }

  for (const signature of targetBySignature.keys()) {
    if (!enBySignature.has(signature)) {
      errors.push(`${locale}:${key}: unexpected selector "${signature}"`)
    }
  }
}

function compareArguments(enState, targetState, key, locale, errors) {
  for (const [name, type] of enState.arguments) {
    const targetType = targetState.arguments.get(name)

    if (!targetType) {
      errors.push(`${locale}:${key}: missing ICU argument "${name}"`)
      continue
    }

    if (targetType !== type) {
      errors.push(
        `${locale}:${key}: ICU argument "${name}" is ${targetType}, expected ${type}`,
      )
    }
  }

  for (const name of targetState.arguments.keys()) {
    if (!enState.arguments.has(name)) {
      errors.push(`${locale}:${key}: unexpected ICU argument "${name}"`)
    }
  }
}

function validateCatalogShape(locale, catalog, errors) {
  if (catalog === null || typeof catalog !== 'object' || Array.isArray(catalog)) {
    errors.push(`${locale}: catalog must be a flat JSON object`)
    return false
  }

  for (const [key, value] of Object.entries(catalog)) {
    if (typeof value !== 'string') {
      errors.push(
        `${locale}:${key}: value must be a string, received ${Array.isArray(value) ? 'array' : typeof value}`,
      )
    }
  }

  return true
}

export async function loadCatalogs() {
  const entries = await Promise.all(
    LOCALES.map(async (locale) => {
      const file = path.join(LOCALES_DIR, `${locale}.json`)
      const source = await readFile(file, 'utf8')

      try {
        return [locale, JSON.parse(source)]
      } catch (error) {
        throw new Error(`${locale}.json is not valid JSON: ${error.message}`, { cause: error })
      }
    }),
  )

  return Object.fromEntries(entries)
}

export async function validateCatalogs({ checkDirectory = true } = {}) {
  const errors = []
  const catalogs = await loadCatalogs()

  if (checkDirectory) {
    const files = (await readdir(LOCALES_DIR))
      .filter((file) => file.endsWith('.json'))
      .sort()
    const expected = LOCALES.map((locale) => `${locale}.json`).sort()

    if (files.join('|') !== expected.join('|')) {
      errors.push(
        `src/lib/i18n/locales must contain exactly ${expected.join(', ')}; found ${files.join(', ') || 'nothing'}`,
      )
    }
  }

  const en = catalogs.en

  if (!validateCatalogShape('en', en, errors)) {
    return { catalogs, errors }
  }

  const enKeys = Object.keys(en).sort()
  const enMessages = new Map()

  for (const key of enKeys) {
    const analysis = analyzeMessage(en[key], key, errors)
    if (analysis) {
      enMessages.set(key, analysis)
    }
  }

  for (const locale of LOCALES) {
    if (locale === 'en') {
      continue
    }

    const catalog = catalogs[locale]

    if (!validateCatalogShape(locale, catalog, errors)) {
      continue
    }

    const localeKeys = Object.keys(catalog).sort()
    const missingKeys = enKeys.filter((key) => !(key in catalog))
    const extraKeys = localeKeys.filter((key) => !(key in en))

    for (const key of missingKeys) {
      errors.push(`${locale}:${key}: missing key`)
    }

    for (const key of extraKeys) {
      errors.push(`${locale}:${key}: key does not exist in en.json`)
    }

    for (const key of enKeys) {
      if (typeof catalog[key] !== 'string') {
        continue
      }

      const enAnalysis = enMessages.get(key)
      if (!enAnalysis) {
        continue
      }

      const targetAnalysis = analyzeMessage(catalog[key], key, errors)
      if (!targetAnalysis) {
        continue
      }

      compareArguments(enAnalysis, targetAnalysis, key, locale, errors)
      compareSelectors(
        enAnalysis.selectors,
        targetAnalysis.selectors,
        key,
        locale,
        errors,
      )
    }
  }

  return { catalogs, errors }
}

export function printErrors(errors) {
  console.error(`i18n check failed with ${errors.length} error(s):`)
  for (const error of errors) {
    console.error(`  - ${error}`)
  }
}
