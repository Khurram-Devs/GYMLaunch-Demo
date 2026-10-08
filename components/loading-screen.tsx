'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const MIN_VISIBLE_MS = 900
const FADE_MS = 500

export function LoadingScreen() {
  const [leaving, setLeaving] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    const start = performance.now()
    let hideTimer: ReturnType<typeof setTimeout>
    let removeTimer: ReturnType<typeof setTimeout>

    const finish = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start))
      hideTimer = setTimeout(() => {
        setLeaving(true)
        removeTimer = setTimeout(() => setRemoved(true), FADE_MS)
      }, wait)
    }

    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', finish, { once: true })

    return () => {
      window.removeEventListener('load', finish)
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  useEffect(() => {
    if (removed) return
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previous
    }
  }, [removed])

  if (removed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading GYM LAUNCH"
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background transition-opacity ease-out',
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <span className="font-display text-2xl font-extrabold uppercase tracking-[0.18em] text-foreground sm:text-3xl">
        GYM<span className="text-accent">.</span>LAUNCH
      </span>
      <div className="h-0.5 w-40 overflow-hidden rounded-full bg-foreground/10">
        <div className="animate-loader-bar h-full w-2/5 rounded-full bg-accent" />
      </div>
    </div>
  )
}
