import { MobileReportStepLayout } from '../layouts/mobile-report-step-layout'
import type { ReportStepNumber } from '../utils/report-steps'
import { ReportLocationMobile } from './report-location-mobile'
import { ReportSituationMobile } from './report-situation-mobile'

type ReportFlowMobileProps = {
  currentStep: ReportStepNumber
  onStepChange: (step: ReportStepNumber) => void
}

export function ReportFlowMobile({
  currentStep,
  onStepChange,
}: ReportFlowMobileProps) {
  return (
    <MobileReportStepLayout currentStep={currentStep}>
      {currentStep === 2 ? (
        <ReportSituationMobile onBack={() => onStepChange(1)} />
      ) : (
        <ReportLocationMobile onNext={() => onStepChange(2)} />
      )}
    </MobileReportStepLayout>
  )
}
