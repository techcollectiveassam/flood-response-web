import { DesktopReportStepLayout } from '../layouts/desktop-report-step-layout'
import type { ReportStepNumber } from '../utils/report-steps'
import { ReportLocationDesktop } from './report-location-desktop'
import { ReportSituationDesktop } from './report-situation-desktop'

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
      {currentStep === 2 ? (
        <ReportSituationDesktop onBack={() => onStepChange(1)} />
      ) : (
        <ReportLocationDesktop onNext={() => onStepChange(2)} />
      )}
    </DesktopReportStepLayout>
  )
}
