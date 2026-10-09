'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/data'
import { BRAND } from '@/lib/brand'
import { BrandMark } from '@/components/brand-mark'
import { whatsappLinkProps } from '@/lib/whatsapp'
import { setScrollLock } from '@/lib/scroll-lock'
import { cn } from '@/lib/utils'

function Wordmark({ className }: { className?: string }) {
  return (
    <a href="#home" className={className} aria-label={`${BRAND.name} home`}>
      <BrandMark textClassName="text-lg" />
    </a>
  )
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const closeDrawer = useCallback(() => {
    setScrollLock('menu', false)
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    setScrollLock('menu', open)
    if (open) firstLinkRef.current?.focus()
    return () => setScrollLock('menu', false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, closeDrawer])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8',
          scrolled ? 'h-16' : 'h-20',
        )}
      >
        <Wordmark />

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'relative text-sm font-medium tracking-wide transition-colors duration-200',
                active === link.href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              aria-current={active === link.href ? 'true' : undefined}
            >
              {link.label}
              <span
                className={cn(
                  'absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300',
                  active === link.href ? 'w-full' : 'w-0',
                )}
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            {...whatsappLinkProps({ intent: 'join', source: 'nav' })}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_-6px_var(--accent)]"
          >
            Join Now
          </a>
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        inert={!open}
        className={cn(
          'fixed inset-0 z-50 flex flex-col bg-background transition-all duration-500 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex h-20 items-center justify-between px-5 sm:px-8">
          <Wordmark />
          <button
            type="button"
            onClick={closeDrawer}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-2 px-6 pb-16" aria-label="Mobile">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={link.href}
              onClick={closeDrawer}
              className={cn(
                'font-display text-4xl font-extrabold uppercase tracking-tight text-foreground transition-all duration-500',
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
              )}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
            >
              <span className="mr-3 text-sm text-accent align-super">0{i + 1}</span>
              {link.label}
            </a>
          ))}
          <a
            {...whatsappLinkProps({ intent: 'join', source: 'nav-mobile' })}
            onClick={closeDrawer}
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground"
          >
            Join Now
          </a>
        </nav>
      </div>
    </header>
  )
}
