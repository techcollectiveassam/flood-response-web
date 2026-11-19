import { Asterisk, Loader2, Plus } from 'lucide-react'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { getApiErrorKey } from '@/lib/api-error'
import { normalizeDigits } from '@/lib/normalize-digits'
import { cn } from '@/lib/utils'
import {
  isLocationError,
  useCreateSosRequest,
} from '../api/create-sos-request'
import { useGeolocationPermission } from '../hooks/use-geolocation-permission'

type SosTriggerButtonVariant = 'card' | 'plain'
type SosTriggerButtonSize = 'compact' | 'hero'

type SosTriggerButtonProps = {
  variant?: SosTriggerButtonVariant
  size?: SosTriggerButtonSize
}

const sizeClasses = {
  compact: {
    ambient: 'size-56',
    ring: 'size-52 p-2',
    button: 'size-full',
    icon: 'size-12',
    label: 'text-[2rem]',
  },
  hero: {
    ambient: 'size-60',
    ring: 'size-54 p-2',
    button: 'size-44',
    icon: 'size-10',
    label: 'text-[2rem]',
  },
} as const

export function SosTriggerButton({
  variant = 'card',
  size = 'compact',
}: SosTriggerButtonProps) {
  const { t } = useTranslation()
  const gpsSosRequest = useCreateSosRequest()
  const mobileSosRequest = useCreateSosRequest()
  const geolocationPermission = useGeolocationPermission()
  const [mobile, setMobile] = useState('')
  const [mobileError, setMobileError] = useState(false)
  const mobileInputId = useId()
  const locationMessageId = useId()
  const classes = sizeClasses[size]
  const Icon = size === 'hero' ? Plus : Asterisk
  const isSending = gpsSosRequest.isPending
  const isMobileSending = mobileSosRequest.isPending
  const isSubmitting = isSending || isMobileSending
  const locationPermissionDenied = geolocationPermission === 'denied'
  const locationBlocked =
    locationPermissionDenied || isLocationError(gpsSosRequest.error)

  function handleGpsSubmit() {
    if (isSubmitting) {
      return
    }

    gpsSosRequest.mutate()
  }

  function handleMobileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const normalizedMobile = normalizeDigits(mobile).trim()

    if (!/^\d{10}$/.test(normalizedMobile)) {
      setMobileError(true)
      return
    }

    setMobileError(false)
    mobileSosRequest.mutate({ reporterMobile: normalizedMobile })
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        variant === 'card' &&
          'rounded-2xl border border-border-subtle bg-card p-5',
      )}
    >
      <div className="relative flex items-center justify-center">
        <span
          className={cn(
            'absolute rounded-full bg-emergency-ring/40 motion-safe:animate-pulse',
            classes.ambient,
          )}
          aria-hidden="true"
        />

        <span
          className={cn(
            'relative flex items-center justify-center rounded-full bg-emergency-ring ring-1 ring-destructive/30',
            classes.ring,
          )}
        >
          <button
            type="button"
            aria-label={t('home.sos.ariaLabel')}
            aria-busy={isSending}
            aria-describedby={locationBlocked ? locationMessageId : undefined}
            disabled={isSubmitting || locationPermissionDenied}
            onClick={handleGpsSubmit}
            className={cn(
              'flex flex-col items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emergency-ring motion-safe:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-80',
              classes.button,
            )}
          >
            {isSending ? (
              <Loader2
                className={cn(
                  'text-destructive-soft motion-safe:animate-spin',
                  classes.icon,
                )}
                strokeWidth={3}
                aria-hidden="true"
              />
            ) : (
              <Icon
                className={cn('text-destructive-soft', classes.icon)}
                strokeWidth={3}
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                'font-extrabold leading-none tracking-tight',
                classes.label,
              )}
            >
              {t('home.sos.label')}
            </span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-destructive-soft">
              {t('home.sos.hint')}
            </span>
          </button>
        </span>
      </div>

      {locationBlocked && (
        <div className="mt-5 w-full max-w-xs rounded-2xl border border-border bg-muted/40 p-4 text-left">
          <p
            id={locationMessageId}
            role="status"
            className="text-xs font-medium leading-relaxed text-muted-foreground"
          >
            {t('sos.create.locationRequired')}
          </p>

          <form
            onSubmit={handleMobileSubmit}
            className="mt-3 space-y-2"
            noValidate
          >
            <label
              htmlFor={mobileInputId}
              className="block text-xs font-semibold text-foreground"
            >
              {t('sos.create.mobileLabel')}
            </label>
            <input
              id={mobileInputId}
              name="mobile"
              type="text"
              inputMode="tel"
              autoComplete="tel"
              required
              value={mobile}
              disabled={isSubmitting}
              aria-invalid={mobileError || undefined}
              aria-describedby={
                mobileError ? `${mobileInputId}-error` : undefined
              }
              onChange={(event) => {
                setMobile(normalizeDigits(event.target.value).replace(/\D/g, ''))
                setMobileError(false)
                mobileSosRequest.reset()
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-70"
            />

            {mobileError && (
              <p
                id={`${mobileInputId}-error`}
                role="alert"
                className="text-xs font-semibold text-destructive"
              >
                {t('sos.create.mobileInvalid')}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-lg bg-destructive px-3 py-2 text-sm font-bold text-destructive-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emergency-ring disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isMobileSending
                ? t('common.loading')
                : t('sos.create.sendWithMobile')}
            </button>

            {mobileSosRequest.isError && (
              <p
                role="alert"
                className="text-xs font-semibold text-destructive"
              >
                {t(getApiErrorKey(mobileSosRequest.error))}
              </p>
            )}
          </form>
        </div>
      )}

      {gpsSosRequest.isError && !isLocationError(gpsSosRequest.error) && (
        <p
          role="alert"
          className="mt-4 max-w-xs text-center text-xs font-semibold text-destructive"
        >
          {t(getApiErrorKey(gpsSosRequest.error))}
        </p>
      )}
    </div>
  )
}
