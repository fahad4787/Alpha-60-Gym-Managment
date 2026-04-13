import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type SwitchProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> & {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  leftLabel?: string
  rightLabel?: string
  size?: 'sm' | 'md'
  showLabels?: boolean
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      className,
      disabled,
      label,
      leftLabel = 'Absent',
      rightLabel = 'Present',
      size = 'md',
      showLabels = true,
      ...props
    },
    ref,
  ) => {
    const trackClass =
      size === 'sm'
        ? 'h-7 w-12'
        : 'h-9 w-16'
    const thumbClass =
      size === 'sm'
        ? 'h-5 w-5'
        : 'h-7 w-7'
    const thumbPos = size === 'sm' ? (checked ? 'left-6' : 'left-1') : (checked ? 'left-8' : 'left-1')

    return (
      <div className={cn('flex items-center justify-end gap-3', className)}>
        {label ? <span className="text-sm text-slate-300">{label}</span> : null}
        <div className="flex items-center gap-2">
          {showLabels ? (
            <span className={cn('text-xs font-medium', checked ? 'text-slate-500' : 'text-rose-200')}>
              {leftLabel}
            </span>
          ) : null}
          <button
            {...props}
            ref={ref}
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => {
              if (disabled) return
              onCheckedChange(!checked)
            }}
            className={cn(
              'relative rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 disabled:opacity-60',
              trackClass,
              checked
                ? 'border-emerald-400/40 bg-emerald-400/15'
                : 'border-rose-400/35 bg-rose-500/10',
            )}
          >
            <span
              className={cn(
                'absolute top-1/2 -translate-y-1/2 rounded-full bg-slate-50 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.8)] transition',
                thumbClass,
                thumbPos,
              )}
            />
          </button>
          {showLabels ? (
            <span className={cn('text-xs font-medium', checked ? 'text-emerald-200' : 'text-slate-500')}>
              {rightLabel}
            </span>
          ) : null}
        </div>
      </div>
    )
  },
)

Switch.displayName = 'Switch'

