import { useTranslation } from 'react-i18next'

export function DesktopMapPreview() {
  const { t } = useTranslation()

  return (
    <svg
      viewBox="0 0 640 220"
      role="img"
      aria-label={t('affectedArea.location.map.previewLabel')}
      className="h-48 w-full"
    >
      <rect width="640" height="220" fill="#e8f2e6" />

      <path
        d="M-30 146 C 70 104, 142 196, 232 152 S 380 64, 500 124 S 622 174, 690 112"
        fill="none"
        stroke="#b8dcf5"
        strokeLinecap="round"
        strokeWidth="44"
      />

      <path
        d="M-10 58 L 650 190"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
      />
      <path
        d="M120 -10 L 260 230"
        fill="none"
        stroke="#f2d58a"
        strokeWidth="3"
      />
      <path
        d="M420 -10 L 382 230"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <path
        d="M0 194 L 640 38"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.8"
        strokeWidth="2"
      />

      <circle cx="118" cy="116" r="22" fill="#cfe4c8" />
      <circle cx="540" cy="72" r="28" fill="#cfe4c8" />
      <circle cx="284" cy="54" r="16" fill="#cfe4c8" />
      <circle cx="470" cy="184" r="20" fill="#cfe4c8" />

      <circle cx="330" cy="132" r="18" fill="#dc2626" fillOpacity="0.18" />
    </svg>
  )
}
