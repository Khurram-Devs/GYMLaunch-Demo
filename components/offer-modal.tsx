'use client'

import Image from 'next/image'
import { Dialog } from '@base-ui/react/dialog'
import { Check, Clock, X } from 'lucide-react'
import { OFFER_ICONS } from '@/components/offer-icons'
import { WhatsAppIcon } from '@/components/social-icons'
import { PLANS } from '@/lib/data'
import type { Offer, OfferPricing } from '@/lib/offers'
import { whatsappLinkProps } from '@/lib/whatsapp'

const formatPkr = (value: number) => value.toLocaleString('en-US')

function PriceGrid({ pricing }: { pricing: OfferPricing }) {
  const plans = PLANS.filter((plan) => !pricing.plans || pricing.plans.includes(plan.id))

  return (
    <div>
      <ul
        className="grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${plans.length}, minmax(0, 1fr))` }}
      >
        {plans.map((plan) => {
          const discounted = Math.round(plan.monthly * (1 - pricing.pct / 100))
          return (
            <li
              key={plan.id}
              className="rounded-xl border border-border bg-background/50 px-3 py-3.5 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {plan.name}
              </p>
              <p className="mt-2 font-display text-xl font-extrabold tabular-nums tracking-tight text-accent sm:text-2xl">
                {formatPkr(discounted)}
              </p>
              <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
                <span className="sr-only">Regular price </span>
                <s>{formatPkr(plan.monthly)}</s>
              </p>
            </li>
          )
        })}
      </ul>
      <p className="mt-2.5 text-xs text-muted-foreground">PKR · {pricing.note}</p>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
      {children}
    </h3>
  )
}

const stagger = (index: number) => ({ animationDelay: `${160 + index * 60}ms` })

export function OfferModal({
  offer,
  open,
  onOpenChange,
}: {
  offer: Offer
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const Icon = OFFER_ICONS[offer.icon]

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal="trap-focus">
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm transition-opacity duration-300 data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
          <Dialog.Popup
            className="relative flex max-h-[92svh] w-full max-w-[34rem] flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-[0_40px_140px_-30px_rgba(0,0,0,0.95)] outline-none transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] data-starting-style:translate-y-10 data-starting-style:opacity-0 data-ending-style:translate-y-10 data-ending-style:opacity-0 sm:max-h-[90svh] sm:rounded-2xl sm:data-starting-style:translate-y-4 sm:data-starting-style:scale-95 sm:data-ending-style:translate-y-4 sm:data-ending-style:scale-95"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
            />

            <Dialog.Close
              aria-label="Close offer"
              className="absolute right-3.5 top-3.5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-background/60 text-foreground backdrop-blur-md transition-colors duration-200 hover:bg-background/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
              <div className="relative h-48 overflow-hidden bg-muted sm:h-56">
                <Image
                  src={offer.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 34rem, 100vw"
                  className="animate-offer-zoom object-cover"
                  style={{ objectPosition: offer.imagePosition ?? 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/55 to-card/5" />
                <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_0%_100%,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_70%)]" />

                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-foreground">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {offer.tag}
                </span>

                <div className="absolute inset-x-5 bottom-4 flex items-end gap-3">
                  <span className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards font-display text-6xl font-black leading-[0.85] tracking-tighter text-accent duration-700 sm:text-7xl">
                    {offer.stat.value}
                  </span>
                  <span className="max-w-[11rem] pb-0.5 text-[11px] font-semibold uppercase leading-snug tracking-[0.18em] text-foreground/85">
                    {offer.stat.label}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-7 px-5 pb-7 pt-6 sm:px-8">
                <div>
                  <Dialog.Title className="font-display text-2xl font-extrabold uppercase tracking-tight text-foreground text-balance sm:text-3xl">
                    {offer.title}
                  </Dialog.Title>
                  <Dialog.Description className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
                    {offer.summary}
                  </Dialog.Description>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {offer.validity}
                  </p>
                </div>

                {offer.pricing && (
                  <section aria-label="Offer pricing" className="flex flex-col gap-3">
                    <SectionLabel>Your price</SectionLabel>
                    <PriceGrid pricing={offer.pricing} />
                  </section>
                )}

                <section className="flex flex-col gap-3.5">
                  <SectionLabel>What you get</SectionLabel>
                  <ul className="flex flex-col gap-3">
                    {offer.perks.map((perk, i) => (
                      <li
                        key={perk}
                        className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards flex items-start gap-3 text-sm text-foreground/90 duration-500"
                        style={stagger(i)}
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="flex flex-col gap-3.5">
                  <SectionLabel>How to claim</SectionLabel>
                  <ol className="flex flex-col gap-3">
                    {offer.steps.map((step, i) => (
                      <li key={step} className="flex items-start gap-3 text-sm text-foreground/90">
                        <span
                          aria-hidden="true"
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/40 text-xs font-bold tabular-nums text-accent"
                        >
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="border-t border-border pt-5">
                  <SectionLabel>Terms</SectionLabel>
                  <ul className="mt-3 flex flex-col gap-1.5 text-xs leading-relaxed text-muted-foreground">
                    {offer.terms.map((term) => (
                      <li key={term}>{term}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            <div className="shrink-0 border-t border-border bg-card/95 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md sm:px-8 sm:pb-6">
              <a
                {...whatsappLinkProps({
                  intent: 'offer',
                  source: 'offer-modal',
                  offer: offer.title,
                  offerDetail: offer.claim,
                })}
                className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_40px_-8px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.99]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Avail Offer
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/30 opacity-0 blur-md transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
                />
              </a>
              <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
                Opens WhatsApp with your message ready to send.
              </p>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
