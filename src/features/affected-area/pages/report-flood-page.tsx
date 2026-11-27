import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useLanguage } from '@/hooks/use-language'
import { useIsDesktop } from '@/hooks/use-is-desktop'
import { buildLocalizedPath } from '@/lib/i18n/locale-segment'
import { ReportFlowDesktop } from '../components/report/flow/report-flow-desktop'
import { ReportFlowMobile } from '../components/report/flow/report-flow-mobile'
import { ReportSubmitted } from '../components/report/submitted/report-submitted'
import { useReportSubmission } from '../hooks/use-report-submission'
import type { ReportStepNumber } from '../utils/report-steps'

export function ReportFloodPage() {
  const [currentStep, setCurrentStep] = useState<ReportStepNumber>(1)
  const submission = useReportSubmission()
  const isDesktop = useIsDesktop()
  const navigate = useNavigate()
  const { language } = useLanguage()

  function handleDone() {
    submission.reset()
    navigate(buildLocalizedPath(language, '/'))
  }

  function handleReportAnother() {
    submission.reset()
    setCurrentStep(1)
  }

  if (submission.result) {
    return (
      <ReportSubmitted
        result={submission.result}
        onDone={handleDone}
        onReportAnother={handleReportAnother}
      />
    )
  }

  return isDesktop ? (
    <ReportFlowDesktop
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onSubmit={submission.submit}
      isSubmitting={submission.isSubmitting}
      errorKey={submission.errorKey}
    />
  ) : (
    <ReportFlowMobile
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onSubmit={submission.submit}
      isSubmitting={submission.isSubmitting}
      errorKey={submission.errorKey}
    />
  )
}
