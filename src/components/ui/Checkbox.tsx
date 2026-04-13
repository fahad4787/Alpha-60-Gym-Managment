import { forwardRef } from 'react'
import { FiCheck } from 'react-icons/fi'
import { cn } from '@/lib/utils'

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className={cn('flex cursor-pointer items-center gap-3', className)}>
        <span className="relative grid h-5 w-5 place-items-center rounded-md border border-slate-800/80 bg-slate-950/40 text-slate-950 transition">
          <input
            ref={ref}
            type="checkbox"
            className="peer absolute inset-0 cursor-pointer opacity-0"
            {...props}
          />
          <span className="pointer-events-none opacity-0 transition peer-checked:opacity-100">
            <FiCheck size={14} className="text-emerald-200" />
          </span>
        </span>
        <span className="text-sm text-slate-200">{label}</span>
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'

