import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router'
import { DelayedFallback } from '@/components/feedback/delayed-fallback'
import { ReportFlowLayout } from './layouts/report-flow-layout'

const ReportFloodPage = lazy(() =>
  import('./pages/report-flood-page').then((module) => ({
    default: module.ReportFloodPage,
  })),
)

export const affectedAreaRoutes: RouteObject[] = [
  {
    path: 'report-flood',
    element: <ReportFlowLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<DelayedFallback />}>
            <ReportFloodPage />
          </Suspense>
        ),
      },
    ],
  },
]
