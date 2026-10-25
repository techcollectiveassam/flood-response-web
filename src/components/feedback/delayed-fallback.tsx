import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_DELAY = Number(import.meta.env.VITE_SUSPENSE_FALLBACK_DELAY) || 200

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
    <div className={cn('flex h-[50vh] w-full items-center justify-center', className)}>
      <Loader2 className={cn('h-6 w-6 animate-spin text-muted-foreground', spinnerClassName)} />
    </div>
  )
}
