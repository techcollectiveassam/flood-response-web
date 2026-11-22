import type { TranslationKey } from '@/lib/i18n/catalog'
import { MobileReportStepLayout } from '../../../layouts/mobile-report-step-layout'
import {
  nextReportStep,
  previousReportStep,
} from '../../../utils/report-flow'
import type { ReportStepNumber } from '../../../utils/report-steps'
import { ReportFlowStepContent } from './report-flow-step-content'
import { ReportLocationMobile } from '../location/report-location-mobile'
import { ReportPhotosMobile } from '../photos/report-photos-mobile'
import { ReportReviewMobile } from '../review/report-review-mobile'
import { ReportSituationMobile } from '../situation/report-situation-mobile'

type ReportFlowMobileProps = {
  currentStep: ReportStepNumber
  onStepChange: (step: ReportStepNumber) => void
  onSubmit: () => void
  isSubmitting: boolean
  errorKey: TranslationKey | null
}

export function ReportFlowMobile({
  currentStep,
  onStepChange,
  onSubmit,
  isSubmitting,
  errorKey,
}: ReportFlowMobileProps) {
  return (
    <MobileReportStepLayout currentStep={currentStep}>
      <ReportFlowStepContent
        currentStep={currentStep}
        location={
          <ReportLocationMobile
            onNext={() => onStepChange(nextReportStep[1])}
          />
        }
        situation={
          <ReportSituationMobile
            onBack={() => onStepChange(previousReportStep[2])}
            onNext={() => onStepChange(nextReportStep[2])}
          />
        }
        photos={
          <ReportPhotosMobile
            onBack={() => onStepChange(previousReportStep[3])}
            onNext={() => onStepChange(nextReportStep[3])}
            onSkip={() => onStepChange(nextReportStep[3])}
          />
        }
        review={
          <ReportReviewMobile
            onBack={() => onStepChange(previousReportStep[4])}
            onEditLocation={() => onStepChange(1)}
            onEditSituation={() => onStepChange(2)}
            onEditPhotos={() => onStepChange(3)}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            errorKey={errorKey}
          />
        }
      />
    </MobileReportStepLayout>
  )
}
