import { createBrowserRouter, redirect } from 'react-router'
import type { LoaderFunctionArgs, RouteObject } from 'react-router'
import { sosRoutes } from '@/features/sos/routes'
import { i18n } from '@/lib/i18n/i18n'
import { getPreferredLanguage } from '@/lib/i18n/detect-language'
import {
  getFirstPathSegment,
  isLocaleLikeSegment,
  normalizeLocaleSegment,
} from '@/lib/i18n/locale-segment'
import { RouteErrorBoundary } from '@/app/components/route-error-boundary'
import { NotFoundPage } from '@/app/components/not-found-page'
import { LocaleLayout } from '@/app/layouts/locale-layout'
import { RootLayout } from '@/app/layouts/root-layout'
import { HomePage } from '@/app/pages/home-page'

const RESERVED_SEGMENTS = new Set(['sos'])

function locationSuffix(request: Request): string {
  const url = new URL(request.url)
  return `${url.search}${url.hash}`
}

function preferredPath(request: Request, path = ''): string {
  return `/${getPreferredLanguage()}${path}${locationSuffix(request)}`
}

function indexLoader({ request }: LoaderFunctionArgs) {
  return redirect(preferredPath(request))
}

function sosLoader({ request }: LoaderFunctionArgs) {
  return redirect(preferredPath(request, '/sos'))
}

function sosCreateLoader({ request }: LoaderFunctionArgs) {
  return redirect(preferredPath(request, '/sos/new'))
}

async function localeLoader({ params, request }: LoaderFunctionArgs) {
  const raw = params.lang ?? ''
  const { pathname } = new URL(request.url)
  const firstSegment = getFirstPathSegment(pathname)
  const rest = pathname.slice(firstSegment.length + 1)
  const suffix = `${rest}${locationSuffix(request)}`
  const normalized = normalizeLocaleSegment(raw)

  if (normalized) {
    if (normalized !== raw) {
      return redirect(`/${normalized}${suffix}`)
    }

    await i18n.changeLanguage(normalized)
    return null
  }

  if (RESERVED_SEGMENTS.has(raw.toLowerCase())) {
    return redirect(preferredPath(request, `/${raw}${rest}`))
  }

  if (isLocaleLikeSegment(raw) && rest !== '') {
    return redirect(preferredPath(request, rest))
  }

  return redirect(preferredPath(request, `/${raw}${rest}`))
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        loader: indexLoader,
      },
      {
        path: 'sos',
        loader: sosLoader,
      },
      {
        path: 'sos/new',
        loader: sosCreateLoader,
      },
      {
        path: ':lang',
        element: <LocaleLayout />,
        loader: localeLoader,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          ...sosRoutes,
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
