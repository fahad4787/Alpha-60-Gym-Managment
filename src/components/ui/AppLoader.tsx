import { BrandMark } from '@/components/brand/BrandMark'
import { BRAND_SHORT } from '@/config/brand'

export function AppLoader({
  subtitle,
}: {
  subtitle?: string
}) {
  return (
    <div className="grid min-h-dvh place-items-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-sm px-6">
        <div className="mx-auto grid place-items-center">
          <div className="relative">
            <BrandMark
              size="xl"
              className="relative border-emerald-300/30 bg-emerald-400/10"
              iconClassName="text-emerald-100"
            />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/90">
            {BRAND_SHORT}
          </p>
          {subtitle ? (
            <p className="mt-2 text-center text-sm text-slate-300">{subtitle}</p>
          ) : null}
        </div>

        <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-slate-900/70">
          <div className="h-full w-[45%] animate-[loader_1.2s_ease-in-out_infinite] rounded-full bg-linear-to-r from-emerald-300 via-slate-100 to-sky-200" />
        </div>
      </div>
    </div>
  )
}

