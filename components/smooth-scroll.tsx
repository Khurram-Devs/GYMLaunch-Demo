'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { registerLenis } from '@/lib/scroll-lock'

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: true })
    registerLenis(lenis)
    return () => {
      registerLenis(null)
      lenis.destroy()
    }
  }, [])

  return null
}
