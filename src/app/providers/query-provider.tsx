import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { isRetryableApiError } from '@/lib/api-error'

const QUERY_STALE_TIME_MS = 30_000
const MAX_QUERY_RETRIES = 2

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      retry: (failureCount, error) =>
        failureCount < MAX_QUERY_RETRIES && isRetryableApiError(error),
    },
  },
})

type QueryProviderProps = {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
