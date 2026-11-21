import type { ReactNode } from 'react'
import { MobileReportProgress } from '../components/mobile-report-progress'
import type { ReportStepNumber } from '../utils/report-steps'

type MobileReportStepLayoutProps = {
  currentStep: ReportStepNumber
  children: ReactNode
}

export function MobileReportStepLayout({
  currentStep,
  children,
}: MobileReportStepLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <MobileReportProgress currentStep={currentStep} />
      {children}
    </div>
  )
}
