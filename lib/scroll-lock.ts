import type Lenis from 'lenis'

let lenis: Lenis | null = null
const locks = new Set<string>()

function sync() {
  const locked = locks.size > 0
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}

export function registerLenis(instance: Lenis | null) {
  lenis = instance
  sync()
}

export function setScrollLock(key: string, locked: boolean) {
  if (locked) locks.add(key)
  else locks.delete(key)
  sync()
}
