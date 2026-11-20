import { useIsDesktop } from '@/hooks/use-is-desktop'
import { ReportFloodDesktop } from '../components/report-flood-desktop'
import { ReportFloodMobile } from '../components/report-flood-mobile'

export function ReportFloodPage() {
  return useIsDesktop() ? <ReportFloodDesktop /> : <ReportFloodMobile />
}
