import type { ReactNode } from 'react'
import { MobileReportStepLayout } from '../layouts/mobile-report-step-layout'
import type { ReportStepNumber } from '../utils/report-steps'
import { ReportLocationMobile } from './report-location-mobile'
import { ReportPhotosMobile } from './report-photos-mobile'
import { ReportReviewMobile } from './report-review-mobile'
import { ReportSituationMobile } from './report-situation-mobile'

type ReportFlowMobileProps = {
  currentStep: ReportStepNumber
  onStepChange: (step: ReportStepNumber) => void
}

export function ReportFlowMobile({
  currentStep,
  onStepChange,
}: ReportFlowMobileProps) {
  let content: ReactNode

  switch (currentStep) {
    case 2:
      content = (
        <ReportSituationMobile
          onBack={() => onStepChange(1)}
          onNext={() => onStepChange(3)}
        />
      )
      break
    case 3:
      content = (
        <ReportPhotosMobile
          onBack={() => onStepChange(2)}
          onNext={() => onStepChange(4)}
          onSkip={() => onStepChange(4)}
        />
      )
      break
    case 4:
      content = (
        <ReportReviewMobile
          onBack={() => onStepChange(3)}
          onEditLocation={() => onStepChange(1)}
          onEditSituation={() => onStepChange(2)}
          onEditPhotos={() => onStepChange(3)}
        />
      )
      break
    default:
      content = <ReportLocationMobile onNext={() => onStepChange(2)} />
  }

  return (
    <MobileReportStepLayout currentStep={currentStep}>
      {content}
    </MobileReportStepLayout>
  )
}
