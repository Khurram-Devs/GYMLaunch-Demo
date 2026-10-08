import { Phone } from 'lucide-react'
import Image from 'next/image'
import { VoltButton } from '@/components/volt-button'
import { Reveal } from '@/components/reveal'
import { CONTACT } from '@/lib/data'
import { BRAND } from '@/lib/brand'
import { whatsappLinkProps } from '@/lib/whatsapp'

export function ConversionCta() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="absolute inset-0">
        <Image
          src="/images/train-conditioning.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              <span className="h-px w-6 bg-accent" aria-hidden="true" />
              No Pressure. Just Come In.
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[0.92] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Ready to Change
              <br />
              The Way You Train?
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
              Your first step is simple. Come experience {BRAND.name} for
              yourself &mdash; tour the floor, meet a coach, and feel the
              difference.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <VoltButton {...whatsappLinkProps({ intent: 'visit', source: 'free-visit' })}>
              Book a Free Visit
            </VoltButton>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/5"
            >
              <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
              Call Us
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
