import { forwardRef, useMemo, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { TextField, type TextFieldProps } from '@/components/ui/TextField'

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'rightSlot'> & {
  strengthValue?: string
  showStrength?: boolean
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ className, error, strengthValue, showStrength = true, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    const strength = useMemo(() => {
      if (!showStrength) return null
      if (!strengthValue) return null
      return getPasswordStrength(strengthValue)
    }, [showStrength, strengthValue])

    return (
      <div className={cn('grid gap-2', className)}>
        <TextField
          ref={ref}
          error={error}
          type={isVisible ? 'text' : 'password'}
          rightSlot={
            <button
              type="button"
              onClick={() => setIsVisible((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950/20 text-slate-100 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.15)] hover:bg-slate-900/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              aria-label={isVisible ? 'Hide password' : 'Show password'}
            >
              {isVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          }
          {...props}
        />

        {strength ? (
          <div className="grid gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Strength</span>
              <span className={cn('font-medium', strength.labelClass)}>{strength.label}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900/60">
              <div
                className={cn('h-full rounded-full transition-[width]', strength.barClass)}
                style={{ width: `${strength.percent}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        ) : null}
      </div>
    )
  },
)

PasswordField.displayName = 'PasswordField'

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  const clamped = Math.min(score, 5)
  const percent = (clamped / 5) * 100

  if (clamped <= 1) {
    return {
      label: 'Weak',
      percent,
      barClass: 'bg-rose-400/80',
      labelClass: 'text-rose-300',
    }
  }
  if (clamped <= 3) {
    return {
      label: 'Okay',
      percent,
      barClass: 'bg-amber-300/80',
      labelClass: 'text-amber-200',
    }
  }
  return {
    label: 'Strong',
    percent,
    barClass: 'bg-emerald-300/80',
    labelClass: 'text-emerald-200',
  }
}

