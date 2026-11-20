import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router'
import { DelayedFallback } from '@/components/feedback/delayed-fallback'

const ReportFloodPage = lazy(() =>
  import('./pages/report-flood-page').then((module) => ({
    default: module.ReportFloodPage,
  })),
)

export const affectedAreaRoutes: RouteObject[] = [
  {
    path: 'report-flood',
    element: (
      <Suspense fallback={<DelayedFallback />}>
        <ReportFloodPage />
      </Suspense>
    ),
  },
]
