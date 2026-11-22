import type { TranslationKey } from '@/lib/i18n/catalog'

export type ReportStepNumber = 1 | 2 | 3 | 4

export type ReportStep = {
  number: ReportStepNumber
  labelKey: TranslationKey
}

export const reportSteps: ReportStep[] = [
  { number: 1, labelKey: 'affectedArea.step.location' },
  { number: 2, labelKey: 'affectedArea.step.situation' },
  { number: 3, labelKey: 'affectedArea.step.photos' },
  { number: 4, labelKey: 'affectedArea.step.review' },
]
