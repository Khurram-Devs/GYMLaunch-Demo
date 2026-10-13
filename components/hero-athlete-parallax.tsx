'use client'

import { useEffect, useRef, type ReactNode } from 'react'

const MAX_X = 22
const MAX_Y = 12
const MAX_TILT = 1.6
const EASING = 0.07
const SETTLE = 0.01
const START_DELAY_MS = 2600

export function HeroAthleteParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const section = el?.closest('section')
    if (!el || !section) return

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!canHover.matches || reducedMotion.matches) return

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frame = 0
    let inView = true
    let enabled = false

    const render = () => {
      current.x += (target.x - current.x) * EASING
      current.y += (target.y - current.y) * EASING
      el.style.transform = `translate3d(${(current.x * MAX_X).toFixed(2)}px, ${(current.y * MAX_Y).toFixed(2)}px, 0) rotate(${(current.x * MAX_TILT).toFixed(3)}deg)`

      const settled =
        Math.abs(target.x - current.x) < SETTLE / 10 && Math.abs(target.y - current.y) < SETTLE / 10
      frame = settled ? 0 : requestAnimationFrame(render)
    }

    const schedule = () => {
      if (!frame && inView) frame = requestAnimationFrame(render)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== 'mouse') return
      target.x = (event.clientX / window.innerWidth) * 2 - 1
      target.y = (event.clientY / window.innerHeight) * 2 - 1
      schedule()
    }

    const recenter = () => {
      target.x = 0
      target.y = 0
      schedule()
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (!inView && frame) {
        cancelAnimationFrame(frame)
        frame = 0
      } else if (inView) {
        schedule()
      }
    })
    observer.observe(section)

    const enableTimer = window.setTimeout(() => {
      enabled = true
    }, START_DELAY_MS)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', recenter)
    window.addEventListener('blur', recenter)

    return () => {
      window.clearTimeout(enableTimer)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', recenter)
      window.removeEventListener('blur', recenter)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
      el.style.transform = ''
    }
  }, [])

  return (
    <div ref={ref} className="relative h-full w-full will-change-transform">
      {children}
    </div>
  )
}
