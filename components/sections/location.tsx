'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MapPin, Navigation2, Phone, Star } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { formatRange, getOpenStatus, type OpenStatus } from '@/lib/hours'
import { whatsappLinkProps } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/social-icons'
import { MapPlaceholder } from '@/components/map-placeholder'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { VoltButton } from '@/components/volt-button'
import { cn } from '@/lib/utils'

function Stars({ score }: { score: number }) {
  const fill = Math.max(0, Math.min(100, (score / 5) * 100))
  return (
    <span className="relative inline-flex" role="img" aria-label={`${score} out of 5 stars`}>
      <span className="flex gap-0.5 text-foreground/20">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-5 w-5 fill-current" aria-hidden="true" />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-accent"
        style={{ width: `${fill}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-5 w-5 shrink-0 fill-current" aria-hidden="true" />
        ))}
      </span>
    </span>
  )
}

function OpenBadge({ status }: { status: OpenStatus | null }) {
  if (!status) return <span className="block h-9 w-56 rounded-full bg-foreground/5" aria-hidden="true" />
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em]',
        status.open
          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
          : 'border-rose-400/30 bg-rose-400/10 text-rose-300',
      )}
    >
      <span
        className={cn('h-2 w-2 rounded-full', status.open ? 'bg-emerald-400' : 'bg-rose-400')}
        aria-hidden="true"
      />
      {status.open ? 'Open now' : 'Closed'}
      <span className="font-medium normal-case tracking-normal text-foreground/70">
        {status.detail}
      </span>
    </span>
  )
}

export function Location() {
  const [status, setStatus] = useState<OpenStatus | null>(null)

  useEffect(() => {
    const update = () => setStatus(getOpenStatus())
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="visit" className="relative border-t border-border py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted">
              {BRAND.mapSrc ? (
                <Image
                  src={BRAND.mapSrc}
                  alt={`Map showing the location of ${BRAND.name}`}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <MapPlaceholder />
              )}
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-background/90 via-background/60 to-transparent p-5 sm:flex-row sm:items-end sm:justify-between">
                <p className="flex items-start gap-2 text-sm text-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {BRAND.address}
                </p>
                <a
                  href={BRAND.directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground transition-all hover:brightness-110"
                >
                  <Navigation2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Get directions
                </a>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Visit Us"
              title={
                <>
                  Find Us In
                  <br />
                  <span className="text-accent">{BRAND.city}</span>
                </>
              }
            />

            <Reveal delay={80} className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-display text-4xl font-extrabold tracking-tight text-foreground">
                  {BRAND.rating.score.toFixed(1)}
                </span>
                <Stars score={BRAND.rating.score} />
                <span className="text-sm text-muted-foreground">
                  {BRAND.rating.reviews.toLocaleString('en-US')} {BRAND.rating.source} reviews
                </span>
              </div>
              <div className="min-h-9">
                <OpenBadge status={status} />
              </div>
            </Reveal>

            <Reveal delay={140}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Opening hours
              </h3>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {BRAND.hours.map((group) => {
                  const isToday = status !== null && group.days.includes(status.todayDay)
                  return (
                    <li
                      key={group.label}
                      className={cn(
                        'flex items-center justify-between py-3.5 text-sm',
                        isToday ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        {group.label}
                        {isToday && (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-foreground">
                            Today
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums">{formatRange(group)}</span>
                    </li>
                  )
                })}
              </ul>
            </Reveal>

            <Reveal delay={200} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <VoltButton {...whatsappLinkProps({ intent: 'visit', source: 'location' })} withArrow={false}>
                <span className="inline-flex items-center gap-2">
                  <WhatsAppIcon className="h-4 w-4" />
                  Message us
                </span>
              </VoltButton>
              <VoltButton
                href={`tel:${BRAND.phone.replace(/\s/g, '')}`}
                variant="secondary"
                withArrow={false}
              >
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
                  Call
                </span>
              </VoltButton>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
