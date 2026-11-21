import type { ReactNode } from 'react'
import { DesktopReportStepLayout } from '../layouts/desktop-report-step-layout'
import type { ReportStepNumber } from '../utils/report-steps'
import { ReportLocationDesktop } from './report-location-desktop'
import { ReportPhotosDesktop } from './report-photos-desktop'
import { ReportReviewDesktop } from './report-review-desktop'
import { ReportSituationDesktop } from './report-situation-desktop'

type ReportFlowDesktopProps = {
  currentStep: ReportStepNumber
  onStepChange: (step: ReportStepNumber) => void
}

export function ReportFlowDesktop({
  currentStep,
  onStepChange,
}: ReportFlowDesktopProps) {
  let content: ReactNode

  switch (currentStep) {
    case 2:
      content = (
        <ReportSituationDesktop
          onBack={() => onStepChange(1)}
          onNext={() => onStepChange(3)}
        />
      )
      break
    case 3:
      content = (
        <ReportPhotosDesktop
          onBack={() => onStepChange(2)}
          onNext={() => onStepChange(4)}
          onSkip={() => onStepChange(4)}
        />
      )
      break
    case 4:
      content = (
        <ReportReviewDesktop
          onBack={() => onStepChange(3)}
          onEditLocation={() => onStepChange(1)}
          onEditSituation={() => onStepChange(2)}
          onEditPhotos={() => onStepChange(3)}
        />
      )
      break
    default:
      content = <ReportLocationDesktop onNext={() => onStepChange(2)} />
  }

  return (
    <DesktopReportStepLayout currentStep={currentStep}>
      {content}
    </DesktopReportStepLayout>
  )
}
