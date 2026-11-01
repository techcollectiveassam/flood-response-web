import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const getDefaultDelay = () => {
  const raw = import.meta.env.VITE_SUSPENSE_FALLBACK_DELAY
  if (raw === undefined || raw === '') {
    return 200
  }
  const parsed = Number(raw)
  if (Number.isFinite(parsed)) {
    return parsed
  }
  return 200
}

const DEFAULT_DELAY = getDefaultDelay()

type DelayedFallbackProps = {
  delay?: number
  className?: string
  spinnerClassName?: string
}

export function DelayedFallback({ delay = DEFAULT_DELAY, className, spinnerClassName }: DelayedFallbackProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  if (!show) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex h-[50vh] w-full items-center justify-center', className)}
    >
      <Loader2
        aria-hidden="true"
        className={cn('h-6 w-6 animate-spin text-muted-foreground', spinnerClassName)}
      />
      <span className="sr-only">Loading</span>
    </div>
  )
}
