import { useTranslation } from 'react-i18next'
import { DesktopConnectivitySupportCard } from './desktop-connectivity-support-card'
import { DesktopEmergencySupportCard } from './desktop-emergency-support-card'
import { DesktopPrivacySupportCard } from './desktop-privacy-support-card'

export function DesktopSupportColumn() {
  const { t } = useTranslation()

  return (
    <aside
      aria-label={t('affectedArea.support.ariaLabel')}
      className="flex min-w-0 flex-col gap-4"
    >
      <DesktopEmergencySupportCard />
      <DesktopPrivacySupportCard />
      <DesktopConnectivitySupportCard />
    </aside>
  )
}
