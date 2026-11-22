import type { ReactNode } from 'react'
import type { ReportStepNumber } from '../../../utils/report-steps'

type ReportFlowStepContentProps = {
  currentStep: ReportStepNumber
  location: ReactNode
  situation: ReactNode
  photos: ReactNode
  review: ReactNode
}

export function ReportFlowStepContent({
  currentStep,
  location,
  situation,
  photos,
  review,
}: ReportFlowStepContentProps) {
  const steps: Record<ReportStepNumber, ReactNode> = {
    1: location,
    2: situation,
    3: photos,
    4: review,
  }

  return <>{steps[currentStep]}</>
}
