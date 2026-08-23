import { MapPin, Phone, Mail } from 'lucide-react'
import Image from 'next/image'
import { VoltButton } from '@/components/volt-button'
import { Reveal } from '@/components/reveal'
import { CONTACT } from '@/lib/data'

const CONTACT_ITEMS = [
  { icon: MapPin, label: CONTACT.location, href: undefined },
  { icon: Phone, label: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
  { icon: Mail, label: CONTACT.email, href: `mailto:${CONTACT.email}` },
]

export function FinalCta() {
  return (
    <section id="final-cta" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/cta-bg.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 py-28 text-center sm:px-8 lg:py-40">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            <span className="h-px w-6 bg-accent" aria-hidden="true" />
            Join GYM Launch
            <span className="h-px w-6 bg-accent" aria-hidden="true" />
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="mt-8 font-display text-5xl font-extrabold uppercase leading-[0.88] tracking-tight text-balance sm:text-7xl lg:text-8xl">
            Your Next Level
            <br />
            <span className="text-accent">Starts Here.</span>
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            No contracts to figure out today. Just walk in, see the space and
            decide for yourself.
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <VoltButton href="#membership">Join GYM Launch</VoltButton>
          <VoltButton href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} variant="secondary" withArrow={false}>
            Book a Visit
          </VoltButton>
        </Reveal>

        <Reveal delay={320} className="mt-16 flex flex-col items-center gap-6 border-t border-border pt-10 sm:flex-row sm:gap-10">
          {CONTACT_ITEMS.map(({ icon: Icon, label, href }) => {
            const content = (
              <span className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                {label}
              </span>
            )
            return href ? (
              <a key={label} href={href}>
                {content}
              </a>
            ) : (
              <span key={label}>{content}</span>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
