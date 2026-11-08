import { HandHeart, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { QuickActionCard } from './quick-action-card'
import { SosTriggerButton } from './sos-trigger-button'

export function SosQuickActions() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 lg:hidden">
      <div className="flex flex-col gap-3">
        <QuickActionCard
          icon={TriangleAlert}
          title={t('home.action.reportArea.title')}
          description={t('home.action.reportArea.description')}
          tone="warning"
        />
        <QuickActionCard
          icon={HandHeart}
          title={t('home.action.requestRelief.title')}
          description={t('home.action.requestRelief.description')}
          tone="info"
        />
      </div>

      <SosTriggerButton />
    </div>
  )
}
