import { GiBiceps } from 'react-icons/gi'
import { cn } from '@/lib/utils'

type BrandMarkProps = {
  className?: string
  iconClassName?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function BrandMark({
  className,
  iconClassName,
  size = 'md',
}: BrandMarkProps) {
  const boxClass = (() => {
    if (size === 'sm') return 'h-9 w-9 rounded-2xl'
    if (size === 'lg') return 'h-12 w-12 rounded-[22px]'
    if (size === 'xl') return 'h-16 w-16 rounded-[28px]'
    return 'h-10 w-10 rounded-2xl'
  })()

  const iconSize =
    size === 'sm' ? 20 : size === 'lg' ? 26 : size === 'xl' ? 34 : 22

  return (
    <div
      className={cn(
        'grid place-items-center border border-emerald-400/25 bg-emerald-400/10 shadow-[0_25px_80px_-50px_rgba(16,185,129,0.95)]',
        boxClass,
        className,
      )}
    >
      <GiBiceps className={cn('text-emerald-200', iconClassName)} size={iconSize} />
    </div>
  )
}

