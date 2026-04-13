import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiUsers,
} from 'react-icons/fi'
import { BrandMark } from '@/components/brand/BrandMark'
import { BRAND_NAME } from '@/config/brand'
import { cn } from '@/lib/utils'

type AuthLayoutProps = {
  children: ReactNode
}

const AUTH_SLIDES = [
  {
    id: 'members',
    title: 'Members',
    description:
      'Profiles, programs, contact info, notes, and PKR fees—add, edit, or remove from one powerful table.',
    icon: FiUsers,
    iconWrap: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  },
  {
    id: 'attendance',
    title: 'Attendance',
    description:
      'Pick any day, search and filter present or absent, and flip status with a smooth switch—no clunky reloads.',
    icon: FiCalendar,
    iconWrap: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  },
  {
    id: 'payments',
    title: 'Payments',
    description:
      'Track monthly paid vs unpaid, see each member’s fee in-line, and filter down to who still owes.',
    icon: FiCreditCard,
    iconWrap: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
  },
] as const

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gym-surface">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/35 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-dvh max-w-6xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <div
            className="flex items-center gap-5 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[authFadeUp_0.75s_ease-out_forwards]"
            style={{ animationDelay: '80ms' }}
          >
            <BrandMark size="xl" />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-200/90">
                Welcome to
              </p>
              <p className="mt-1 text-balance bg-linear-to-r from-emerald-200 via-slate-50 to-sky-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
                {BRAND_NAME}
              </p>
              <div className="mt-4 h-px w-20 bg-linear-to-r from-emerald-300/70 to-transparent" />
            </div>
          </div>

          <h1
            className="mt-6 text-balance text-4xl font-semibold tracking-tight text-slate-50 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[authFadeUp_0.75s_ease-out_forwards]"
            style={{ animationDelay: '180ms' }}
          >
            Your gym, organized—members, floor, and fees
          </h1>
          <p
            className="mt-4 max-w-md text-sm leading-6 text-slate-300 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[authFadeUp_0.75s_ease-out_forwards]"
            style={{ animationDelay: '280ms' }}
          >
            Roster and programs, daily check-ins, and monthly fee status in one place—built for
            training floors and front desks.
          </p>

          <div
            className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[authFadeUp_0.75s_ease-out_forwards]"
            style={{ animationDelay: '380ms' }}
          >
            <AuthFeatureSlider />
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-md opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[authCardReveal_0.9s_cubic-bezier(0.22,1,0.36,1)_forwards] [animation-delay:120ms] lg:[animation-delay:200ms]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthFeatureSlider() {
  const [index, setIndex] = useState(0)
  const len = AUTH_SLIDES.length

  const goNext = useCallback(() => setIndex((i) => (i + 1) % len), [len])
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + len) % len), [len])

  useEffect(() => {
    const id = window.setInterval(goNext, 4200)
    return () => window.clearInterval(id)
  }, [goNext])

  return (
    <div className="mt-8">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_12px_40px_-24px_rgba(0,0,0,0.75)]">
        <div
          className="h-px w-full bg-linear-to-r from-transparent via-emerald-500/45 to-transparent"
          aria-hidden="true"

        />
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translate3d(-${index * 100}%,0,0)` }}
        >
          {AUTH_SLIDES.map((slide) => {
            const Icon = slide.icon
            return (
              <div key={slide.id} className="w-full shrink-0 px-5 py-6 sm:px-6 sm:py-7">
                <div className="flex gap-4 sm:gap-5">
                  <div
                    className={cn(
                      'grid h-12 w-12 shrink-0 place-items-center rounded-2xl border sm:h-14 sm:w-14',
                      slide.iconWrap,
                    )}
                    
                  >
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-semibold tracking-tight text-slate-50 sm:text-lg">
                      {slide.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-1.5" role="tablist" aria-label="Feature highlights">
          {AUTH_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={idx === index}
              aria-label={`${s.title} slide`}
              onClick={() => setIndex(idx)}
              className={cn(
                'h-2 rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50',
                idx === index ? 'w-8 bg-emerald-400/85' : 'w-2 bg-slate-600 hover:bg-slate-500',
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800/70 bg-slate-950/50 text-slate-200 transition hover:bg-slate-900/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800/70 bg-slate-950/50 text-slate-200 transition hover:bg-slate-900/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            aria-label="Next slide"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
