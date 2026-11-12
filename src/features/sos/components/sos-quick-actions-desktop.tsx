import { HandHeart, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { QuickActionCard } from './quick-action-card'
import { SosTriggerButton } from './sos-trigger-button'

export function SosQuickActionsDesktop() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <SosTriggerButton />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
    </div>
  )
}
