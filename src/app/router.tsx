import { createBrowserRouter } from 'react-router'
import { RootLayout } from './layouts/root-layout'
import { sosRoutes } from '@/features/sos/routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <div>Home</div>,
      },
      ...sosRoutes,
    ],
  },
])
