import { createBrowserRouter } from 'react-router'
import { RootLayout } from './layouts/root-layout'
import { HomePage } from './pages/home-page'
import { sosRoutes } from '@/features/sos/routes'
import { RouteErrorBoundary } from './components/route-error-boundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      ...sosRoutes,
    ],
  },
])
