'use client'

import { useLayoutEffect, useRef } from 'react'

const REFERENCE_SIZE = 100
const MIN_SIZE = 28
const MAX_SIZE = 128
const MAX_WIDTH = 880

type HeroSloganProps = {
  lines: readonly [string, string]
}

export function HeroSlogan({ lines }: HeroSloganProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    const heading = headingRef.current
    const container = heading?.parentElement
    if (!heading || !container) return

    const fit = () => {
      heading.style.fontSize = `${REFERENCE_SIZE}px`
      const widest = Math.max(
        ...Array.from(heading.children, (line) => line.getBoundingClientRect().width),
      )
      const available = Math.min(container.clientWidth, MAX_WIDTH)
      const size = widest > 0 ? (REFERENCE_SIZE * available) / widest : MAX_SIZE
      heading.style.fontSize = `${Math.floor(Math.min(MAX_SIZE, Math.max(MIN_SIZE, size)))}px`
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(container)

    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) fit()
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [lines])

  return (
    <h1
      ref={headingRef}
      className="font-display text-[clamp(2.25rem,9.5vw,8rem)] font-extrabold uppercase leading-[0.9] tracking-tight transition-none animate-in fade-in slide-in-from-bottom-6 duration-1000"
    >
      <span className="block w-max whitespace-nowrap">{lines[0]}</span>
      <span className="block w-max whitespace-nowrap text-accent">{lines[1]}</span>
    </h1>
  )
}
