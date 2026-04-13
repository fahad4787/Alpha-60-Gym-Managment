import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 disabled:opacity-60 disabled:pointer-events-none'

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-[0_16px_40px_-24px_rgba(16,185,129,0.75)]',
  secondary:
    'bg-slate-900/60 text-slate-100 border border-slate-800/70 hover:bg-slate-900/80',
  ghost: 'bg-transparent text-slate-200 hover:bg-slate-900/40',
  danger:
    'bg-rose-500 text-white hover:bg-rose-400 shadow-[0_16px_40px_-24px_rgba(244,63,94,0.6)]',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', isLoading, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(base, variantClass[variant], sizeClass[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
              aria-hidden="true"
            />
            <span>Loading</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

