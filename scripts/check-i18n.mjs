import {
  LOCALES,
  printErrors,
  validateCatalogs,
} from './i18n-validation.mjs'

const { errors } = await validateCatalogs()

if (errors.length > 0) {
  printErrors(errors)
  process.exit(1)
}

console.log(`i18n check passed for ${LOCALES.join(', ')}.`)
