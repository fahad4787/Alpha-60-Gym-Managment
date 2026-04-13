import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getAuthInstance, getDb } from '@/lib/firebase'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { Card } from '@/components/ui/Card'
import { TextField } from '@/components/ui/TextField'
import { PasswordField } from '@/components/ui/PasswordField'
import { Button } from '@/components/ui/Button'
import { BRAND_SHORT } from '@/config/brand'
import { BrandMark } from '@/components/brand/BrandMark'

type BootstrapState = 'loading' | 'needsOwner' | 'ready'

const signInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, 'Enter your full name'),
})

type SignInValues = z.infer<typeof signInSchema>
type SignUpValues = z.infer<typeof signUpSchema>

const LOCAL_BOOTSTRAP_KEY = 'gym.bootstrap.ready'

export function AuthPage() {
  const navigate = useNavigate()
  const [bootstrap, setBootstrap] = useState<BootstrapState>('loading')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (getLocalBootstrapReady()) {
          if (cancelled) return
          setBootstrap('ready')
          return
        }
        const snap = await getDoc(doc(getDb(), 'app', 'bootstrap'))
        if (cancelled) return
        setBootstrap(snap.exists() ? 'ready' : 'needsOwner')
      } catch (e) {
        if (cancelled) return
        if (isPermissionDenied(e)) {
          setFormError(
            'Firestore permissions are blocking setup status. Enable Firestore or relax rules for local testing.',
          )
          setBootstrap('needsOwner')
          return
        }
        setBootstrap('needsOwner')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const mode = bootstrap === 'needsOwner' ? 'signUp' : 'signIn'

  const schema = useMemo(
    () => (mode === 'signUp' ? signUpSchema : signInSchema),
    [mode],
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues | SignUpValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' } as SignInValues,
    mode: 'onTouched',
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      const auth = getAuthInstance()
      if (mode === 'signUp') {
        const v = values as SignUpValues
        const cred = await createUserWithEmailAndPassword(auth, v.email, v.password)
        await updateProfile(cred.user, { displayName: v.fullName })
        try {
          await setDoc(
            doc(getDb(), 'app', 'bootstrap'),
            {
              ownerUid: cred.user.uid,
              ownerEmail: cred.user.email ?? null,
              createdAt: serverTimestamp(),
            },
            { merge: true },
          )
        } catch (e) {
          if (isPermissionDenied(e)) {
            setLocalBootstrapReady(true)
            setFormError(
              'Account created, but Firestore rules blocked saving setup status. Signup will be disabled only on this device until rules are updated.',
            )
          } else {
            throw e
          }
        }
        setBootstrap('ready')
        navigate('/dashboard', { replace: true })
        return
      }

      const v = values as SignInValues
      await signInWithEmailAndPassword(auth, v.email, v.password)
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setFormError(toAuthErrorMessage(e))
    }
  })

  const passwordValue = watch('password') as string | undefined

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <BrandMark size="md" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/90">
              {BRAND_SHORT}
            </p>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
            {bootstrap === 'loading'
              ? 'Loading…'
              : mode === 'signIn'
                ? 'Sign in to your studio'
                : 'Create the owner account'}
          </h2>
          <p className="text-sm text-slate-300">
            {bootstrap === 'loading'
              ? 'Checking setup status.'
              : mode === 'signIn'
                ? 'Access members, attendance, and monthly payments for your gym.'
                : 'First sign-up registers this app for your studio. After that, only sign-in is available.'}
          </p>
        </header>

        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          {mode === 'signUp' ? (
            <TextField
              label="Full name"
              autoComplete="name"
              placeholder="e.g. Fahad Nadeem"
              error={'fullName' in errors ? errors.fullName?.message : undefined}
              {...register('fullName' as const)}
            />
          ) : null}

          <TextField
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordField
            label="Password"
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            placeholder="••••••••"
            error={errors.password?.message}
            strengthValue={passwordValue}
            showStrength
            {...register('password')}
          />

          {formError ? (
            <div className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {formError}
            </div>
          ) : null}

          <Button
            type="submit"
            className="mt-1 w-full"
            size="lg"
            isLoading={isSubmitting}
            disabled={bootstrap === 'loading' || isSubmitting}
          >
            {mode === 'signIn' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        {mode === 'signUp' ? (
          <footer className="mt-6 text-xs leading-5 text-slate-400">
            After this account exists, new sign-ups are turned off so only your studio staff use the
            dashboard.
          </footer>
        ) : null}
      </Card>
    </AuthLayout>
  )
}

function toAuthErrorMessage(error: unknown): string {
  const errObj = typeof error === 'object' && error ? (error as Record<string, unknown>) : null
  const message = errObj && typeof errObj.message === 'string' ? errObj.message : ''
  const code = errObj && typeof errObj.code === 'string' ? errObj.code : ''

  if (code === 'auth/invalid-credential') return 'Incorrect email or password.'
  if (code === 'auth/email-already-in-use') return 'This email is already in use.'
  if (code === 'auth/too-many-requests') return 'Too many attempts. Try again later.'
  if (code === 'auth/network-request-failed') return 'Network error. Check your connection.'
  if (code === 'auth/weak-password') return 'Password is too weak.'
  if (code === 'auth/invalid-email') return 'Enter a valid email.'

  return message || 'Something went wrong. Please try again.'
}

function isPermissionDenied(error: unknown): boolean {
  const errObj = typeof error === 'object' && error ? (error as Record<string, unknown>) : null
  const code = errObj && typeof errObj.code === 'string' ? errObj.code : ''
  return code === 'permission-denied' || code === 'firestore/permission-denied'
}

function getLocalBootstrapReady(): boolean {
  try {
    return window.localStorage.getItem(LOCAL_BOOTSTRAP_KEY) === '1'
  } catch {
    return false
  }
}

function setLocalBootstrapReady(value: boolean) {
  try {
    if (value) window.localStorage.setItem(LOCAL_BOOTSTRAP_KEY, '1')
    else window.localStorage.removeItem(LOCAL_BOOTSTRAP_KEY)
  } catch {
    return
  }
}

