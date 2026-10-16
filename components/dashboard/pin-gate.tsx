'use client'

import { useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'

// Demo-only gate: the PIN is checked in the browser. Move this check to the
// server (session/cookie) when the dashboard goes to production.
const DEMO_PIN = '001256'
const STORAGE_KEY = 'gym-dashboard-unlocked'

export function useDashboardLock() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      setUnlocked(false)
    }
  }, [])

  const unlock = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* storage unavailable */
    }
    setUnlocked(true)
  }

  const lock = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* storage unavailable */
    }
    setUnlocked(false)
  }

  return { unlocked, unlock, lock }
}

export function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = (pin: string) => {
    if (pin === DEMO_PIN) {
      onUnlock()
      return
    }
    setError(true)
    setValue('')
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(value)
        }}
        className="flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border border-border bg-card/50 p-8 text-center"
      >
        <BrandMark textClassName="text-base" />
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Owner dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Enter your 6-digit PIN to continue.</p>
        </div>

        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          value={value}
          aria-label="6-digit PIN"
          aria-invalid={error}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, '').slice(0, 6)
            setValue(next)
            setError(false)
            if (next.length === 6) submit(next)
          }}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-2xl tracking-[0.6em] text-foreground outline-none transition-colors focus:border-accent"
          placeholder="••••••"
        />

        <p className="h-4 text-xs font-medium text-red-400" role="alert">
          {error ? 'Incorrect PIN. Try again.' : ''}
        </p>

        <button
          type="submit"
          disabled={value.length < 6}
          className="w-full rounded-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground transition-opacity disabled:opacity-40"
        >
          Unlock
        </button>
      </form>
    </div>
  )
}
