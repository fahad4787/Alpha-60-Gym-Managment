import type { ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  label: string
  error?: string
  rightSlot?: ReactNode
  showErrorText?: boolean
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { className, label, error, rightSlot, showErrorText = true, id, ...props },
    ref,
  ) => {
    const autoId = useId()
    const inputId = id ?? autoId
    const describedBy = error && showErrorText ? `${inputId}-error` : undefined

    return (
      <div className={cn('grid gap-2 text-left', className)}>
        <label htmlFor={inputId} className="text-sm text-slate-200">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              'h-11 w-full rounded-xl border bg-slate-950/30 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition',
              rightSlot ? 'pr-11' : undefined,
              error
                ? 'border-rose-400/70 focus:ring-2 focus:ring-rose-400/30'
                : 'border-slate-800/70 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15',
            )}
            {...props}
          />
          {rightSlot ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {rightSlot}
            </div>
          ) : null}
        </div>
        {error && showErrorText ? (
          <p id={describedBy} className="text-xs text-rose-300">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

TextField.displayName = 'TextField'

