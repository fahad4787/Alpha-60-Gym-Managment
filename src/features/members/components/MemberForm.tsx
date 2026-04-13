import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import type { MemberCreateInput } from '@/features/members/types'
import { Checkbox } from '@/components/ui/Checkbox'
import { PROGRAMS, type ProgramId } from '@/config/programs'
import { DatePicker } from '@/components/ui/DatePicker'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function todayDateOnly() {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

type FormValues = {
  fullName: string
  phone: string
  enrollDate: string
  fees: number
  age: number
  email: string
  notes: string
  programs: Record<ProgramId, boolean>
}

const programsSchema: z.ZodType<Record<ProgramId, boolean>> = z
  .object({
  weight_loss: z.boolean(),
  strength_conditioning: z.boolean(),
  martial_arts: z.boolean(),
  physiotherapy: z.boolean(),
  })
  .refine((v) => Object.values(v).some(Boolean), { message: 'Select programs' })

const schema = z.object({
  fullName: z.string().min(2, 'Enter full name'),
  phone: z.string().trim().min(7, 'Enter phone'),
  enrollDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Select enroll date'),
  fees: z.number().finite('Enter fees').positive('Enter fees'),
  age: z
    .number()
    .finite('Enter age')
    .int('Age must be a whole number')
    .min(1, 'Enter age'),
  email: z
    .string()
    .refine(
      (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      'Enter a valid email',
    ),
  notes: z.string(),
  programs: programsSchema,
})

export function MemberForm({
  onSubmit,
  isSubmitting,
  initialValues,
  submitLabel = 'Add member',
}: {
  onSubmit: (values: MemberCreateInput) => Promise<void> | void
  isSubmitting?: boolean
  initialValues?: Partial<FormValues>
  submitLabel?: string
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      fullName: '',
      phone: '',
      enrollDate: todayDateOnly(),
      fees: NaN,
      age: NaN,
      email: '',
      notes: '',
      programs: PROGRAMS.reduce(
        (acc, p) => {
          acc[p.id] = false
          return acc
        },
        {} as Record<ProgramId, boolean>,
      ),
      ...initialValues,
    },
    mode: 'onTouched',
  })

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={handleSubmit(async (v) => {
        const selectedPrograms = PROGRAMS.filter((p) => v.programs[p.id]).map((p) => p.id)
        const payload: MemberCreateInput = {
          fullName: v.fullName.trim(),
          phone: v.phone.trim(),
          enrollDate: v.enrollDate,
          fees: v.fees,
          age: v.age,
          email: v.email.trim() ? v.email.trim().toLowerCase() : undefined,
          programs: selectedPrograms,
          notes: v.notes.trim() ? v.notes.trim() : undefined,
          status: 'active',
        }
        await onSubmit(payload)
      })}
    >
      <TextField
        label="Full name"
        placeholder="e.g. Ali Khan"
        autoComplete="name"
        error={errors.fullName?.message}
        showErrorText={false}
        {...register('fullName')}
      />
      <TextField
        label="Phone"
        placeholder="e.g. +92 300 1234567"
        autoComplete="tel"
        error={errors.phone?.message}
        showErrorText={false}
        {...register('phone')}
      />
      <Controller
        control={control}
        name="enrollDate"
        render={({ field }) => (
          <DatePicker
            label="Enroll date"
            value={field.value}
            onChange={field.onChange}
            error={errors.enrollDate?.message}
            showErrorText={false}
          />
        )}
      />
      <TextField
        label="Fees"
        type="number"
        inputMode="numeric"
        min={1}
        error={errors.fees?.message}
        showErrorText={false}
        rightSlot={
          <span className="rounded-lg border border-slate-800/70 bg-slate-950/40 px-2 py-1 text-xs font-semibold tracking-wide text-slate-200">
            PKR
          </span>
        }
        {...register('fees', { valueAsNumber: true })}
      />
      <TextField
        label="Age"
        type="number"
        inputMode="numeric"
        min={1}
        error={errors.age?.message}
        showErrorText={false}
        {...register('age', { valueAsNumber: true })}
      />
      <TextField
        label="Email (optional)"
        type="email"
        inputMode="email"
        placeholder="e.g. member@example.com"
        autoComplete="email"
        error={errors.email?.message}
        showErrorText={false}
        {...register('email')}
      />

      <div className="grid gap-2 text-left sm:col-span-2">
        <p className="text-sm text-slate-200">Programs</p>
        <div
          className={[
            'grid gap-2 rounded-2xl border bg-slate-950/30 p-3',
            errors.programs
              ? 'border-rose-400/70 ring-2 ring-rose-400/20'
              : 'border-slate-800/70',
          ].join(' ')}
        >
          {PROGRAMS.map((p) => (
            <Checkbox key={p.id} label={p.label} {...register(`programs.${p.id}`)} />
          ))}
        </div>
      </div>

      <div className="grid gap-2 text-left sm:col-span-2">
        <label className="text-sm text-slate-200" htmlFor="notes">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          className="w-full resize-none rounded-2xl border border-slate-800/70 bg-slate-950/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15"
          placeholder="e.g. Goal: lose 5kg in 8 weeks"
          {...register('notes')}
        />
      </div>

      <div className="mt-2 flex items-center justify-end gap-3 sm:col-span-2">
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

