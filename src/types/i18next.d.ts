import 'i18next'
import type { EnCatalog } from '@/lib/i18n/catalog'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: EnCatalog
    }
  }
}
