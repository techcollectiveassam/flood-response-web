import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router'
import { SosLayout } from './layouts/sos-layout'
import { DelayedFallback } from '@/components/feedback/delayed-fallback'

const SosListPage = lazy(() =>
  import('./pages/sos-list-page').then((module) => ({
    default: module.SosListPage,
  })),
)
const SosCreatePage = lazy(() =>
  import('./pages/sos-create-page').then((module) => ({
    default: module.SosCreatePage,
  })),
)

export const sosRoutes: RouteObject[] = [
  {
    path: 'sos',
    element: <SosLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<DelayedFallback />}>
            <SosListPage />
          </Suspense>
        ),
      },
      {
        path: 'new',
        element: (
          <Suspense fallback={<DelayedFallback />}>
            <SosCreatePage />
          </Suspense>
        ),
      },
    ],
  },
]
