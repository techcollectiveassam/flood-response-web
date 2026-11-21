import { DesktopReportStepLayout } from '../../../layouts/desktop-report-step-layout'
import {
  nextReportStep,
  previousReportStep,
} from '../../../utils/report-flow'
import type { ReportStepNumber } from '../../../utils/report-steps'
import { ReportFlowStepContent } from './report-flow-step-content'
import { ReportLocationDesktop } from '../location/report-location-desktop'
import { ReportPhotosDesktop } from '../photos/report-photos-desktop'
import { ReportReviewDesktop } from '../review/report-review-desktop'
import { ReportSituationDesktop } from '../situation/report-situation-desktop'

type ReportFlowDesktopProps = {
  currentStep: ReportStepNumber
  onStepChange: (step: ReportStepNumber) => void
}

export function ReportFlowDesktop({
  currentStep,
  onStepChange,
}: ReportFlowDesktopProps) {
  return (
    <DesktopReportStepLayout currentStep={currentStep}>
      <ReportFlowStepContent
        currentStep={currentStep}
        location={
          <ReportLocationDesktop
            onNext={() => onStepChange(nextReportStep[1])}
          />
        }
        situation={
          <ReportSituationDesktop
            onBack={() => onStepChange(previousReportStep[2])}
            onNext={() => onStepChange(nextReportStep[2])}
          />
        }
        photos={
          <ReportPhotosDesktop
            onBack={() => onStepChange(previousReportStep[3])}
            onNext={() => onStepChange(nextReportStep[3])}
            onSkip={() => onStepChange(nextReportStep[3])}
          />
        }
        review={
          <ReportReviewDesktop
            onBack={() => onStepChange(previousReportStep[4])}
            onEditLocation={() => onStepChange(1)}
            onEditSituation={() => onStepChange(2)}
            onEditPhotos={() => onStepChange(3)}
          />
        }
      />
    </DesktopReportStepLayout>
  )
}
