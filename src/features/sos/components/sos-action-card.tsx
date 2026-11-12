import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type SosActionCardTone = 'warning' | 'info'

type SosActionCardProps = {
  icon: LucideIcon
  title: string
  description: string
  tag: string
  tone: SosActionCardTone
}

const toneClasses: Record<
  SosActionCardTone,
  {
    card: string
    icon: string
    tag: string
    title: string
    chevron: string
  }
> = {
  warning: {
    card: 'hover:border-warning/70 hover:shadow-md',
    icon: 'bg-warning-soft text-warning',
    tag: 'border-warning/25 bg-warning-soft text-warning',
    title: 'group-hover:text-warning',
    chevron: 'group-hover:bg-warning group-hover:text-warning-foreground',
  },
  info: {
    card: 'hover:border-info/70 hover:shadow-md',
    icon: 'bg-info-soft text-info',
    tag: 'border-info/25 bg-info-soft text-info',
    title: 'group-hover:text-info',
    chevron: 'group-hover:bg-info group-hover:text-info-foreground',
  },
}

export function SosActionCard({
  icon: Icon,
  title,
  description,
  tag,
  tone,
}: SosActionCardProps) {
  const classes = toneClasses[tone]

  return (
    <a
      href="#"
      className={cn(
        'group flex flex-col justify-between rounded-2xl border-2 border-border bg-card p-6 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        classes.card,
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span
            className={cn(
              'flex size-14 shrink-0 items-center justify-center rounded-2xl',
              classes.icon,
            )}
          >
            <Icon className="size-7" aria-hidden="true" />
          </span>

          <span
            className={cn(
              'shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
              classes.tag,
            )}
          >
            {tag}
          </span>
        </div>

        <div>
          <h3
            className={cn(
              'text-xl font-bold text-foreground transition-colors',
              classes.title,
            )}
          >
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-border-subtle pt-5">
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors',
            classes.chevron,
          )}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </a>
  )
}
