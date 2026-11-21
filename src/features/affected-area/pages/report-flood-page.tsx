import { useState } from 'react'
import { useIsDesktop } from '@/hooks/use-is-desktop'
import { ReportFlowDesktop } from '../components/report/flow/report-flow-desktop'
import { ReportFlowMobile } from '../components/report/flow/report-flow-mobile'
import type { ReportStepNumber } from '../utils/report-steps'

export function ReportFloodPage() {
  const [currentStep, setCurrentStep] = useState<ReportStepNumber>(1)

  return useIsDesktop() ? (
    <ReportFlowDesktop
      currentStep={currentStep}
      onStepChange={setCurrentStep}
    />
  ) : (
    <ReportFlowMobile
      currentStep={currentStep}
      onStepChange={setCurrentStep}
    />
  )
}
