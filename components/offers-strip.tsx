'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronRight, Megaphone, Pause, Play } from 'lucide-react'
import { OfferModal } from '@/components/offer-modal'
import { OFFER_ICONS } from '@/components/offer-icons'
import { OFFERS } from '@/lib/offers'
import { setScrollLock } from '@/lib/scroll-lock'
import { cn } from '@/lib/utils'

const SCROLL_SPEED_PX_PER_SECOND = 55

function OfferItems({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <>
      {OFFERS.map((offer) => {
        const Icon = OFFER_ICONS[offer.icon]
        return (
          <li key={offer.id} className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => onSelect(offer.id)}
              aria-haspopup="dialog"
              aria-label={`${offer.tag}: ${offer.headline}. View offer details`}
              className="group flex h-9 items-center gap-2.5 whitespace-nowrap px-4 text-xs text-foreground/85 transition-colors duration-200 hover:text-foreground focus-visible:outline-offset-[-2px] sm:px-5 sm:text-[13px]"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-foreground">
                <Icon className="h-3 w-3" aria-hidden="true" />
                {offer.tag}
              </span>
              <span className="font-medium">{offer.headline}</span>
              <ChevronRight
                className="h-3.5 w-3.5 text-accent transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
            <span aria-hidden="true" className="mx-2 h-1 w-1 shrink-0 rotate-45 bg-accent/50 sm:mx-3" />
          </li>
        )
      })}
    </>
  )
}

export function OffersStrip() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const firstSetRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const firstSet = firstSetRef.current
    if (!track || !firstSet) return
    const syncDuration = () => {
      const seconds = firstSet.offsetWidth / SCROLL_SPEED_PX_PER_SECOND
      if (seconds > 0) track.style.setProperty('--offers-duration', `${seconds}s`)
    }
    syncDuration()
    const observer = new ResizeObserver(syncDuration)
    observer.observe(firstSet)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setScrollLock('offer', open)
    return () => setScrollLock('offer', false)
  }, [open])

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setOpen(true)
  }, [])

  const handleViewportBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.scrollLeft = 0
  }, [])

  const selectedOffer = OFFERS.find((offer) => offer.id === selectedId) ?? null

  return (
    <section
      aria-label="Current offers"
      className="relative border-b border-accent/20 bg-[color-mix(in_oklab,var(--accent)_8%,var(--background))]"
    >
      <div className="flex h-9 items-stretch">
        <div className="flex shrink-0 items-center gap-2 border-r border-accent/20 px-3 text-accent sm:px-5">
          <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Offers</span>
        </div>

        <div
          className="offers-viewport offers-mask relative min-w-0 flex-1 overflow-hidden"
          onBlurCapture={handleViewportBlur}
        >
          <div
            ref={trackRef}
            data-paused={paused || open}
            className="offers-track flex w-max items-center"
          >
            <ul ref={firstSetRef} className="flex min-w-[100vw] shrink-0 items-center">
              <OfferItems onSelect={handleSelect} />
            </ul>
            <ul
              inert
              aria-hidden="true"
              className="offers-duplicate flex min-w-[100vw] shrink-0 items-center"
            >
              <OfferItems onSelect={handleSelect} />
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          aria-label={paused ? 'Resume offers ticker' : 'Pause offers ticker'}
          className={cn(
            'inline-flex w-9 shrink-0 items-center justify-center border-l border-accent/20 text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-offset-[-2px] motion-reduce:hidden sm:w-11',
          )}
        >
          {paused ? (
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      <span
        aria-hidden="true"
        className="offers-sheen pointer-events-none absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent"
      />

      {selectedOffer && (
        <OfferModal offer={selectedOffer} open={open} onOpenChange={setOpen} />
      )}
    </section>
  )
}
