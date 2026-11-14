import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type QuickActionCardTone = 'warning' | 'info'

type QuickActionCardProps = {
  icon: LucideIcon
  title: string
  description: string
  tone: QuickActionCardTone
}

const toneClasses: Record<QuickActionCardTone, string> = {
  warning: 'bg-warning-soft text-warning',
  info: 'bg-info-soft text-info',
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  tone,
}: QuickActionCardProps) {
  return (
    <a
      href="#"
      className="group flex min-h-[76px] items-center gap-4 rounded-xl border-2 border-border bg-card p-4 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-safe:active:scale-[0.99]"
    >
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl',
          toneClasses[tone],
        )}
      >
        <Icon className="size-6" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-lg font-bold leading-tight text-foreground">
          {title}
        </span>
        <span className="mt-0.5 block truncate text-sm text-muted-foreground">
          {description}
        </span>
      </span>

      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ChevronRight className="size-5" aria-hidden="true" />
      </span>
    </a>
  )
}
