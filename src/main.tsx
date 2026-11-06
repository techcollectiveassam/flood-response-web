import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { router } from '@/app/router'
import { i18n } from '@/lib/i18n/i18n'
import { initPwa } from '@/lib/pwa/init'

initPwa()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  </StrictMode>,
)
