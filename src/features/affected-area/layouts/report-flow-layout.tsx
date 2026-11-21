import { Outlet } from 'react-router'
import { ReportDraftProvider } from '../contexts/report-draft-provider'

export function ReportFlowLayout() {
  return (
    <ReportDraftProvider>
      <Outlet />
    </ReportDraftProvider>
  )
}
